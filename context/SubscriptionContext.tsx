import Constants, { ExecutionEnvironment } from 'expo-constants';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

const API_KEYS = {
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
};

interface SubscriptionContextType {
    isPro: boolean;
    isClub: boolean;
    packages: PurchasesPackage[];
    purchasePackage: (pack: PurchasesPackage) => Promise<void>;
    restorePurchases: () => Promise<void>;
    isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Set to true to bypass paywall for development/testing
const DEV_MODE = false;

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const [isPro, setIsPro] = useState(DEV_MODE);
    const [isClub, setIsClub] = useState(false);
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                // Skip RevenueCat on web or Expo Go
                const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
                if (Platform.OS === 'web' || isExpoGo) {
                    console.log('RevenueCat not available on web/Expo Go - using free tier');
                    setIsLoading(false);
                    return;
                }

                if (Platform.OS === 'ios' && API_KEYS.ios) {
                    await Purchases.configure({ apiKey: API_KEYS.ios });
                } else if (Platform.OS === 'android' && API_KEYS.android) {
                    await Purchases.configure({ apiKey: API_KEYS.android });
                } else {
                    console.warn('RevenueCat API key not configured');
                    setIsLoading(false);
                    return;
                }

                const info = await Purchases.getCustomerInfo();
                updateEntitlements(info);

                const offerings = await Purchases.getOfferings();
                if (offerings.current && offerings.current.availablePackages.length !== 0) {
                    setPackages(offerings.current.availablePackages);
                }
            } catch (e) {
                console.error('Error initializing RevenueCat', e);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    const updateEntitlements = (info: CustomerInfo) => {
        setIsPro(typeof info.entitlements.active['pro'] !== 'undefined');
        setIsClub(typeof info.entitlements.active['club'] !== 'undefined');
    };

    const purchasePackage = async (pack: PurchasesPackage) => {
        const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
        if (Platform.OS === 'web' || isExpoGo) {
            console.log('Mock purchase successful');
            setIsPro(true);
            return;
        }

        try {
            const { customerInfo } = await Purchases.purchasePackage(pack);
            updateEntitlements(customerInfo);
        } catch (e: any) {
            if (!e.userCancelled) {
                console.error('Error purchasing package', e);
            }
        }
    };

    const restorePurchases = async () => {
        try {
            const info = await Purchases.restorePurchases();
            updateEntitlements(info);
        } catch (e) {
            console.error('Error restoring purchases', e);
        }
    };

    return (
        <SubscriptionContext.Provider
            value={{
                isPro,
                isClub,
                packages,
                purchasePackage,
                restorePurchases,
                isLoading,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
