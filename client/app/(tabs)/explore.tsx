import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getToken } from '../../hooks/useToken';
import { FAB } from 'react-native-paper'; 
import { useRouter } from 'expo-router';

import { API_URL } from '../../constants/api';
import { SafeAreaView } from 'react-native-safe-area-context';



type Geocache = {
  _id: string;
  description?: string;
  difficulty: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  creator: string;
};

export default function ExploreScreen() {
  const [caches, setCaches] = useState<Geocache[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCaches = async () => {
      const token = await getToken();
      if (!token) {
        Alert.alert('Erreur', 'Token JWT manquant. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/caches`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          console.error('Réponse non JSON :', text);
          Alert.alert('Erreur', 'Réponse serveur invalide');
          return;
        }

        if (!response.ok) {
          const msg = data.message || data || 'Erreur inconnue';
          console.error('Erreur backend :', msg);
          Alert.alert('Erreur', msg);
          return;
        }

        setCaches(data);
      } catch (err) {
        console.error('Erreur réseau :', err);
        Alert.alert('Erreur', 'Impossible de contacter le serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchCaches();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: caches[0]?.coordinates.lat || 48.8584,
          longitude: caches[0]?.coordinates.lng || 2.2945,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {caches.map((cache) => (
          <Marker
            key={cache._id}
            coordinate={{
              latitude: cache.coordinates.lat,
              longitude: cache.coordinates.lng,
            }}
            title={cache.description || 'Géocache'}
            description={`Difficulté : ${cache.difficulty}`}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },

});

