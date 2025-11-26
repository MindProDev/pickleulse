import { getThemedColors, Typography } from '@/constants/theme';
import { useSubscription } from '@/context/SubscriptionContext';
import { useTheme } from '@/context/ThemeContext';
import { ChartBar, CloudArrowUp, Users, X } from 'phosphor-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PaywallProps {
    visible: boolean;
    onClose: () => void;
}

export function Paywall({ visible, onClose }: PaywallProps) {
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);
    const { packages, purchasePackage, restorePurchases } = useSubscription();

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={28} color={colors.textSecondary} weight="bold" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Unlock PicklePulse Pro</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Take your game to the next level with advanced features.
                    </Text>

                    <View style={styles.featuresList}>
                        <FeatureItem icon="infinity" text="Unlimited Match History" />
                        <FeatureItem icon="cloud" text="Cloud Backup" />
                        <FeatureItem icon="chart" text="Advanced Statistics" />
                        <FeatureItem icon="users" text="Doubles Team Profiles" />
                    </View>

                    <View style={styles.packagesContainer}>
                        {packages.map((pack) => (
                            <TouchableOpacity
                                key={pack.identifier}
                                style={[styles.packageButton, { backgroundColor: colors.accent }]}
                                onPress={() => purchasePackage(pack)}
                            >
                                <Text style={[styles.packageTitle, { color: colors.backgroundPrimary }]}>{pack.product.title}</Text>
                                <Text style={[styles.packagePrice, { color: colors.backgroundPrimary }]}>{pack.product.priceString}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity onPress={restorePurchases} style={styles.restoreButton}>
                        <Text style={[styles.restoreText, { color: colors.textSecondary }]}>Restore Purchases</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
}

function FeatureItem({ icon, text }: { icon: 'infinity' | 'cloud' | 'chart' | 'users'; text: string }) {
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);
    const iconMap = {
        infinity: CloudArrowUp,
        cloud: CloudArrowUp,
        chart: ChartBar,
        users: Users,
    };
    const IconComponent = iconMap[icon];

    return (
        <View style={[styles.featureItem, { backgroundColor: colors.accent + '15' }]}>
            <IconComponent size={24} color={colors.accentDark} weight="duotone" />
            <Text style={[styles.featureText, { color: colors.textPrimary }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        alignItems: 'flex-end',
    },
    closeButton: {
        padding: 8,
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        ...Typography.h1,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        ...Typography.bodyLarge,
        textAlign: 'center',
        marginBottom: 32,
    },
    featuresList: {
        width: '100%',
        marginBottom: 32,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
    },
    featureText: {
        ...Typography.h4,
        marginLeft: 12,
    },
    packagesContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 24,
    },
    packageButton: {
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    packageTitle: {
        ...Typography.h3,
        marginBottom: 4,
    },
    packagePrice: {
        ...Typography.h4,
    },
    restoreButton: {
        padding: 12,
    },
    restoreText: {
        ...Typography.body,
        textDecorationLine: 'underline',
    },
});
