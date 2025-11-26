import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface MatchTimerProps {
    startTime: Date;
    isActive: boolean;
    size?: 'small' | 'medium' | 'large';
}

/**
 * Real-time match duration display
 * Shows elapsed time in MM:SS format
 */
export function MatchTimer({ startTime, isActive, size = 'medium' }: MatchTimerProps) {
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
            setDuration(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, isActive]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const sizeClasses = {
        small: 'text-sm',
        medium: 'text-xl',
        large: 'text-3xl',
    };

    return (
        <View className="items-center">
            <Text className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Duration
            </Text>
            <Text
                className={`${sizeClasses[size]} font-bold dark:text-white`}
                style={{ fontFamily: 'JetBrainsMono-Bold' }}
            >
                {formatTime(duration)}
            </Text>
        </View>
    );
}
