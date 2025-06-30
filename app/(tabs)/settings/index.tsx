// app/(tabs)/settings/index.tsx
import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function SettingsHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Item
          title="Modifier le profil"
          left={() => <List.Icon icon="account-edit" />}
          onPress={() => router.push('/(tabs)/settings/edit-profile')}
        />
        <List.Item
          title="Changer le mot de passe"
          left={() => <List.Icon icon="lock" />}
          onPress={() => router.push('/(tabs)/settings/change-password')}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
