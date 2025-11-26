import { MatchCard } from '@/components/MatchCard';
import { Paywall } from '@/components/Paywall';
import { getThemedColors, Typography } from '@/constants/theme';
import { useSubscription } from '@/context/SubscriptionContext';
import { useTheme } from '@/context/ThemeContext';
import { useMatchHistory } from '@/hooks/useMatchHistory';
import { Crown } from 'phosphor-react-native';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const { actualTheme } = useTheme();
  const colors = getThemedColors(actualTheme);
  const { matches, loading, refetch } = useMatchHistory();
  const { isPro } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const displayedMatches = isPro ? matches : matches.slice(0, 5);
  const isLimited = !isPro && matches.length > 5;

  const renderFooter = () => {
    if (!isLimited) return null;

    return (
      <TouchableOpacity
        onPress={() => setShowPaywall(true)}
        style={styles.upgradeCard}
        activeOpacity={0.8}
      >
        <View style={styles.upgradeContent}>
          <View style={styles.upgradeIconContainer}>
            <Crown size={24} color={colors.accentDark} weight="duotone" />
          </View>
          <View style={styles.upgradeTextContainer}>
            <Text style={[styles.upgradeTitle, { color: colors.accentDark }]}>Unlock Full History</Text>
            <Text style={[styles.upgradeSubtitle, { color: colors.accentDark }]}>
              Upgrade to Pro to see all your past matches and stats.
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Match History</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {matches.length} {matches.length === 1 ? 'match' : 'matches'} played
        </Text>
      </View>

      <FlatList
        data={displayedMatches}
        renderItem={({ item }) => <MatchCard match={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No matches yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>Start a new match to track your games!</Text>
            </View>
          ) : null
        }
        ListFooterComponent={renderFooter}
        refreshing={loading}
        onRefresh={refetch}
      />

      <Paywall visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    ...Typography.h1,
  },
  subtitle: {
    ...Typography.body,
    marginTop: 4,
  },
  listContent: {
    padding: 24,
    gap: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.h4,
    marginBottom: 8,
  },
  emptySubtext: {
    ...Typography.body,
    textAlign: 'center',
  },
  upgradeCard: {
    backgroundColor: '#f0fdfa', // teal-50
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ccfbf1', // teal-100
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccfbf1', // teal-100
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  upgradeIcon: {
    fontSize: 24,
  },
  upgradeTextContainer: {
    flex: 1,
  },
  upgradeTitle: {
    ...Typography.h4,
    marginBottom: 4,
  },
  upgradeSubtitle: {
    ...Typography.caption,
  },
});
