import { ActiveMatchAlert } from '@/components/ActiveMatchAlert';
import { getThemedColors, Typography } from '@/constants/theme';
import { useMatchContext } from '@/context/MatchContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useTheme } from '@/context/ThemeContext';
import { useActiveMatches } from '@/hooks/useActiveMatches';
import type { Match } from '@/types/match';
import { router } from 'expo-router';
import { ArrowCounterClockwise, ChartBar, Clock, Lightning, ShareNetwork, TennisBall } from 'phosphor-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Clean Minimalist Home Screen
 */
export default function HomeScreen() {
  const { actualTheme } = useTheme();
  const colors = getThemedColors(actualTheme);
  const { isPro } = useSubscription();
  const { startMatch } = useMatchContext();
  const { getFirstActiveMatch } = useActiveMatches();
  const [showActiveMatchAlert, setShowActiveMatchAlert] = useState(false);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [pendingMatchAction, setPendingMatchAction] = useState<'setup' | 'quick' | null>(null);

  const handleStartMatch = async () => {
    // Pro users can start unlimited matches
    if (isPro) {
      router.push('/match-setup');
      return;
    }

    // Check for active matches for free users
    const active = await getFirstActiveMatch();
    if (active) {
      setActiveMatch(active);
      setPendingMatchAction('setup');
      setShowActiveMatchAlert(true);
    } else {
      router.push('/match-setup');
    }
  };

  const handleQuickMatch = async () => {
    // Pro users can start unlimited matches
    if (isPro) {
      router.push({
        pathname: '/live-match',
        params: {
          matchType: 'singles',
          scoringRule: 11,
          firstServer: 'team_a',
        },
      });
      return;
    }

    // Check for active matches for free users
    const active = await getFirstActiveMatch();
    if (active) {
      setActiveMatch(active);
      setPendingMatchAction('quick');
      setShowActiveMatchAlert(true);
    } else {
      router.push({
        pathname: '/live-match',
        params: {
          matchType: 'singles',
          scoringRule: 11,
          firstServer: 'team_a',
        },
      });
    }
  };

  const handleProceedAfterEnding = () => {
    setShowActiveMatchAlert(false);
    if (pendingMatchAction === 'setup') {
      router.push('/match-setup');
    } else if (pendingMatchAction === 'quick') {
      router.push({
        pathname: '/live-match',
        params: {
          matchType: 'singles',
          scoringRule: 11,
          firstServer: 'team_a',
        },
      });
    }
    setPendingMatchAction(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={[styles.header, { color: colors.accent }]}>PicklePulse</Text>

        {/* Main Actions */}
        <View style={styles.mainActions}>
          {/* Start Match */}
          <TouchableOpacity
            onPress={handleStartMatch}
            style={styles.startMatchButton}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.startMatchTitle}>Start Match</Text>
                <Text style={styles.startMatchSubtitle}>Configure your game</Text>
              </View>
              <View style={styles.iconContainer}>
                <TennisBall size={36} color="#fff" weight="duotone" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Quick Match */}
          <TouchableOpacity
            onPress={handleQuickMatch}
            style={styles.quickMatchButton}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonTextContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Lightning size={20} color="#fff" weight="fill" />
                  <Text style={styles.quickMatchTitle}>Quick Match</Text>
                </View>
                <Text style={styles.quickMatchSubtitle}>Singles to 11 • Skip setup</Text>
              </View>
              <View style={styles.quickMatchBadge}>
                <Text style={styles.quickMatchBadgeText}>GO</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View>
          <Text style={[styles.featuresHeader, { color: colors.textPrimary }]}>Features</Text>

          <View style={styles.featuresList}>
            <View style={styles.featureCard}>
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: colors.accentLight }]}>
                  <ChartBar size={24} color={colors.accentDark} weight="duotone" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Live Scoring</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>Real-time score tracking</Text>
                </View>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: '#f3e8ff' }]}>
                  <Clock size={24} color="#7e22ce" weight="duotone" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Match Timer</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>Automatic duration tracking</Text>
                </View>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: '#fef3c7' }]}>
                  <ArrowCounterClockwise size={24} color="#b45309" weight="duotone" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Undo Support</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>Correct mistakes instantly</Text>
                </View>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: '#d1fae5' }]}>
                  <ShareNetwork size={24} color="#15803d" weight="duotone" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Share Results</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>Export match summaries</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <ActiveMatchAlert
        visible={showActiveMatchAlert}
        onClose={() => setShowActiveMatchAlert(false)}
        onProceed={handleProceedAfterEnding}
        activeMatch={activeMatch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    ...Typography.hero,
    textAlign: 'center',
    marginBottom: 48,
  },
  mainActions: {
    marginBottom: 32,
  },
  startMatchButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonTextContainer: {
    flex: 1,
  },
  startMatchTitle: {
    ...Typography.h2,
    color: '#ffffff',
    marginBottom: 4,
  },
  startMatchSubtitle: {
    ...Typography.body,
    color: '#99f6e4',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 36,
  },
  quickMatchButton: {
    backgroundColor: '#fb923c',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickMatchTitle: {
    ...Typography.h3,
    color: '#ffffff',
  },
  quickMatchSubtitle: {
    ...Typography.caption,
    color: '#fed7aa',
  },
  quickMatchBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  quickMatchBadgeText: {
    ...Typography.label,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  featuresHeader: {
    ...Typography.h3,
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureIconTeal: {
    backgroundColor: '#ccfbf1',
  },
  featureIconPurple: {
    backgroundColor: '#f3e8ff',
  },
  featureIconYellow: {
    backgroundColor: '#fef3c7',
  },
  featureIconGreen: {
    backgroundColor: '#d1fae5',
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.h4,
    marginBottom: 4,
  },
  featureSubtitle: {
    ...Typography.caption,
  },
});

