import { Paywall } from '@/components/Paywall';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getThemedColors, Typography } from '@/constants/theme';
import { useSubscription } from '@/context/SubscriptionContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import type { Team } from '@/types/team';
import { showAlert } from '@/utils/alert';
import { TennisBall, Users } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TeamsScreen() {
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);
    const { isPro } = useSubscription();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [partnerEmail, setPartnerEmail] = useState('');

    useEffect(() => {
        if (isPro) {
            fetchTeams();
        } else {
            setLoading(false);
        }
    }, [isPro]);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('teams')
                .select('*')
                .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTeams(data || []);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeamName.trim()) {
            showAlert('Error', 'Please enter a team name');
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // For now, create team with just the current user
            // In a full implementation, you'd search for partner by email
            const { error } = await supabase.from('teams').insert({
                name: newTeamName.trim(),
                player1_id: user.id,
                player2_id: user.id, // Placeholder - would be partner's ID
            });

            if (error) throw error;

            setNewTeamName('');
            setPartnerEmail('');
            setShowCreateModal(false);
            fetchTeams();
            showAlert('Success', 'Team created successfully!');
        } catch (error: any) {
            console.error('Error creating team:', error);
            showAlert('Error', error.message || 'Failed to create team');
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        showAlert(
            'Delete Team',
            'Are you sure you want to delete this team?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('teams')
                                .delete()
                                .eq('id', teamId);

                            if (error) throw error;
                            fetchTeams();
                        } catch (error: any) {
                            showAlert('Error', error.message || 'Failed to delete team');
                        }
                    },
                },
            ]
        );
    };

    if (!isPro) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
                <View style={styles.header}>
                    <Text style={[styles.headerText, { color: colors.textPrimary }]}>Teams</Text>
                </View>

                <View style={styles.lockContainer}>
                    <IconSymbol name="lock.fill" size={64} color={colors.accent} />
                    <Text style={[styles.lockTitle, { color: colors.textPrimary }]}>Pro Feature</Text>
                    <Text style={[styles.lockDescription, { color: colors.textSecondary }]}>
                        Upgrade to Pro to create doubles teams, track team statistics, and manage partnerships.
                    </Text>
                    <TouchableOpacity
                        style={styles.upgradeButton}
                        onPress={() => setShowPaywall(true)}
                    >
                        <Text style={styles.upgradeButtonText}>Unlock Teams</Text>
                    </TouchableOpacity>
                </View>

                <Paywall visible={showPaywall} onClose={() => setShowPaywall(false)} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={[styles.headerText, { color: colors.textPrimary }]}>Teams</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowCreateModal(true)}
                    >
                        <Text style={styles.addButtonText}>+ New Team</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading teams...</Text>
                ) : teams.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Users size={64} color={colors.accent} weight="duotone" />
                        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Teams Yet</Text>
                        <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                            Create your first doubles team to start tracking partnership stats!
                        </Text>
                    </View>
                ) : (
                    <View style={styles.teamsList}>
                        {teams.map((team) => (
                            <View key={team.id} style={[styles.teamCard, { backgroundColor: colors.card }]}>
                                <View style={styles.teamInfo}>
                                    <TennisBall size={32} color={colors.accent} weight="duotone" />
                                    <View style={styles.teamDetails}>
                                        <Text style={[styles.teamName, { color: colors.textPrimary }]}>{team.name}</Text>
                                        <Text style={[styles.teamDate, { color: colors.textSecondary }]}>
                                            Created {new Date(team.created_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.deleteButton, { backgroundColor: colors.errorLight }]}
                                    onPress={() => handleDeleteTeam(team.id)}
                                >
                                    <Text style={[styles.deleteButtonText, { color: colors.error }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Create Team Modal */}
            {showCreateModal && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modal, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Create New Team</Text>

                        <TextInput
                            style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }]}
                            placeholder="Team Name"
                            value={newTeamName}
                            onChangeText={setNewTeamName}
                            placeholderTextColor={colors.textTertiary}
                        />

                        <Text style={[styles.note, { color: colors.textSecondary }]}>
                            Note: Partner invitations coming soon! For now, teams are created with you as both players.
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.backgroundSecondary }]}
                                onPress={() => {
                                    setShowCreateModal(false);
                                    setNewTeamName('');
                                    setPartnerEmail('');
                                }}
                            >
                                <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.createButton]}
                                onPress={handleCreateTeam}
                            >
                                <Text style={styles.createButtonText}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    headerText: {
        ...Typography.h1,
    },
    addButton: {
        backgroundColor: '#14b8a6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 100,
    },
    addButtonText: {
        ...Typography.buttonSmall,
        color: '#fff',
    },
    loadingText: {
        ...Typography.body,
        textAlign: 'center',
        marginTop: 32,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 64,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        ...Typography.h3,
        marginBottom: 16,
        marginTop: 16,
    },
    emptyDescription: {
        ...Typography.body,
        textAlign: 'center',
    },
    teamsList: {
        gap: 16,
    },
    teamCard: {
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    teamInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    teamIconContainer: {
        marginRight: 16,
    },
    teamDetails: {
        flex: 1,
    },
    teamName: {
        ...Typography.h4,
        marginBottom: 4,
    },
    teamDate: {
        ...Typography.caption,
    },
    deleteButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    deleteButtonText: {
        ...Typography.buttonSmall,
    },
    lockContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    lockTitle: {
        ...Typography.h2,
        marginTop: 24,
        marginBottom: 12,
    },
    lockDescription: {
        ...Typography.body,
        textAlign: 'center',
        marginBottom: 32,
    },
    upgradeButton: {
        backgroundColor: '#14b8a6',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 100,
    },
    upgradeButtonText: {
        ...Typography.h4,
        color: '#fff',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modal: {
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        ...Typography.h2,
        marginBottom: 24,
    },
    input: {
        ...Typography.body,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    note: {
        ...Typography.caption,
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
    },
    cancelButtonText: {
        ...Typography.button,
    },
    createButton: {
        backgroundColor: '#14b8a6',
    },
    createButtonText: {
        ...Typography.button,
        color: '#fff',
    },
});
