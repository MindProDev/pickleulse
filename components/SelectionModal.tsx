import { getThemedColors, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectionModalProps {
    visible: boolean;
    title: string;
    options: Array<{
        label: string;
        value: string;
        onSelect: () => void;
    }>;
    onClose: () => void;
}

export default function SelectionModal({ visible, title, options, onClose }: SelectionModalProps) {
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.backgroundPrimary }]}>
                    <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                        {title}
                    </Text>

                    <View style={styles.optionsContainer}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.option,
                                    { borderBottomColor: colors.border },
                                    index === options.length - 1 && styles.lastOption
                                ]}
                                onPress={() => {
                                    option.onSelect();
                                    onClose();
                                }}
                            >
                                <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.cancelButton, { borderColor: colors.border }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        ...Typography.h3,
        marginBottom: 20,
        textAlign: 'center',
    },
    optionsContainer: {
        marginBottom: 16,
    },
    option: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    lastOption: {
        borderBottomWidth: 0,
    },
    optionText: {
        ...Typography.body,
        textAlign: 'center',
    },
    cancelButton: {
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 12,
        marginTop: 8,
    },
    cancelText: {
        ...Typography.button,
        textAlign: 'center',
    },
});
