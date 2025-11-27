import { Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogo } from 'phosphor-react-native';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GoogleSignInButton() {
    const { signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);

    const handlePress = async () => {
        try {
            setLoading(true);
            const result = await signInWithGoogle();
            if (!result.success && result.error) {
                console.error(result.error);
                // Alert.alert('Error', result.error); // Optional: show error
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#000" />
            ) : (
                <View style={styles.content}>
                    <GoogleLogo size={20} weight="bold" color="#000" />
                    <Text style={styles.text}>Continue with Google</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        ...Typography.button,
        color: '#0f172a',
    },
});
