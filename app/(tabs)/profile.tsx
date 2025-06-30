// ✅ app/(tabs)/profile.tsx
import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Avatar, List, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { getToken } from '../../hooks/useToken';
import { API_URL } from '../../constants/api';
import { SafeAreaView } from 'react-native-safe-area-context';

function parseJwt(token: string): DecodedToken {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

type DecodedToken = {
  id: string;
  email: string;
  exp: number;
};

type UserStats = {
  finds: number;
  hides: number;
  distance: number;
  score: number;
};

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [stats, setStats] = useState<UserStats | null>(null);
  const router = useRouter();
  const theme = useTheme();
  

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await getToken();
      if (!token) return;

      const decoded = parseJwt(token);
      setEmail(decoded.email);

      try {
        const res = await fetch(`${API_URL}/api/users/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          Alert.alert('Erreur', data.message || 'Erreur stats');
        } else {
          setStats(data);
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Erreur', 'Impossible de charger les statistiques');
      }
    };

    fetchUserInfo();
  }, []);

  return (
  
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.header}>
        <Avatar.Icon size={72} icon="account" style={styles.avatar} />
        <Text style={styles.username}>{email}</Text>
      </View>

      <List.Item
        title="Finds"
        description="Caches trouvées"
        left={() => <List.Icon icon="emoticon-outline" />}
        right={() => <Text style={styles.count}>{stats?.finds ?? 0}</Text>}
        onPress={() => router.push('/profile/finds')}
      />
      <List.Item
        title="Hides"
        description="Caches créées"
        left={() => <List.Icon icon="star-outline" />}
        right={() => <Text style={styles.count}>{stats?.hides ?? 0}</Text>}
        onPress={() => router.push('/profile/hides')}
      />
      <List.Item
        title="Statistics"
        description="Voir en détail votre activité"
        left={() => <List.Icon icon="chart-bar" />}
        onPress={() => router.push('/profile/stats')}
      />
      <List.Item
        title="Souvenirs"
        description="Récompenses et badges"
        left={() => <List.Icon icon="map-marker-check" />}
        onPress={() => {}}
      />
      <List.Item
        title="Drafts"
        left={() => <List.Icon icon="file-document-outline" />}
        onPress={() => {}}
      />
      <List.Item
        title="Trackable Inventory"
        left={() => <List.Icon icon="bug-outline" />}
        onPress={() => {}}
      />
    </ScrollView>
    </SafeAreaView>
      
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: '#8e24aa',
  },
  username: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '600',
  },
  count: {
    alignSelf: 'center',
    fontSize: 16,
    marginRight: 12,
    fontWeight: '600',
  },
  scrollView: {
    padding: 10
  },
});