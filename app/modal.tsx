import { getThemedColors, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function ModalScreen() {
  const { actualTheme } = useTheme();
  const colors = getThemedColors(actualTheme);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>This is a modal</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text style={[styles.linkText, { color: colors.accent }]}>Go to home screen</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    ...Typography.h2,
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    ...Typography.link,
  },
});
