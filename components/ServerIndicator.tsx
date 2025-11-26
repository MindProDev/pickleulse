import type { Server } from '@/types/match';
import { Text, View } from 'react-native';

interface ServerIndicatorProps {
    server: Server;
    teamAName?: string;
    teamBName?: string;
    size?: 'small' | 'medium' | 'large';
}

/**
 * Visual indicator showing which team is currently serving
 * Uses a ball icon and team name/label
 */
export function ServerIndicator({ server, teamAName, teamBName, size = 'medium' }: ServerIndicatorProps) {
    const teamName = server === 'team_a'
        ? (teamAName || 'Team A')
        : (teamBName || 'Team B');

    const sizeClasses = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
    };

    const iconSizes = {
        small: 16,
        medium: 20,
        large: 24,
    };

    return (
        <View className="flex-row items-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded-full">
            {/* Ball icon */}
            <View
                className="bg-yellow-500 rounded-full"
                style={{ width: iconSizes[size], height: iconSizes[size] }}
            />

            <Text className={`${sizeClasses[size]} font-semibold text-yellow-900 dark:text-yellow-100`}>
                {teamName} Serving
            </Text>
        </View>
    );
}
