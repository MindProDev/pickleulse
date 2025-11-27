import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

export default function FuturisticCourt() {
    const pulse = useSharedValue(0.3);
    const lineGlow = useSharedValue(0.5);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        lineGlow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedBackgroundStyle = useAnimatedStyle(() => ({
        opacity: pulse.value,
    }));

    const animatedLineStyle = useAnimatedStyle(() => ({
        opacity: lineGlow.value,
        shadowOpacity: lineGlow.value,
    }));

    return (
        <View style={styles.container}>
            {/* Dark Base */}
            <View style={styles.base} />

            {/* Pulsing Grid/Gradient Effect */}
            <Animated.View style={[styles.glowLayer, animatedBackgroundStyle]} />

            {/* Court Lines */}
            <View style={styles.courtLines}>
                {/* Outer Boundary */}
                <Animated.View style={[styles.boundary, animatedLineStyle]} />

                {/* Kitchen Lines */}
                <Animated.View style={[styles.kitchenLine, animatedLineStyle]} />

                {/* Center Line */}
                <Animated.View style={[styles.centerLine, animatedLineStyle]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#1e293b', // Lighter slate for better web visibility
        zIndex: -1,
    },
    base: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0f172a', // Dark slate base
    },
    glowLayer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#312e81', // Brighter indigo for better visibility
    },
    courtLines: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        padding: 20,
    },
    boundary: {
        ...StyleSheet.absoluteFillObject,
        margin: 20,
        borderWidth: 2,
        borderColor: '#22d3ee', // Cyan
        shadowColor: '#22d3ee',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        borderRadius: 4,
    },
    kitchenLine: {
        position: 'absolute',
        top: '35%',
        left: 20,
        right: 20,
        height: 2,
        backgroundColor: '#22d3ee',
        shadowColor: '#22d3ee',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
    },
    centerLine: {
        position: 'absolute',
        top: 20,
        bottom: 20,
        left: '50%',
        width: 2,
        backgroundColor: 'rgba(34, 211, 238, 0.5)', // Fainter Cyan
    },
});
