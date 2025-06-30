import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getToken } from '../../hooks/useToken';
import { API_URL } from '../../constants/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddCacheScreen() {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    const token = await getToken();

    if (!token) {
      Alert.alert('Erreur', 'Vous devez être connecté');
      return;
    }

    // validation simple
    if (!lat || !lng || !difficulty) {
      Alert.alert('Champs obligatoires', 'Latitude, longitude et difficulté sont requis');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/caches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          difficulty: parseInt(difficulty),
          description,
        }),
      });

      const data = await response.json();
      console.log('Caches reçues :', data);

      if (!response.ok) {
        Alert.alert('Erreur', data.message || 'Erreur lors de l’ajout');
        return;
      }

      Alert.alert('Succès', 'Cache ajoutée !');
      router.replace('/(tabs)/explore'); // redirection vers carte
    } catch (err) {
      console.error('Erreur réseau :', err);
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    }
  };

  return (
    <SafeAreaView style={styles.container}>  
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajouter une nouvelle géocache</Text>

      <TextInput
        style={styles.input}
        placeholder="Latitude (ex : 48.8584)"
        keyboardType="numeric"
        value={lat}
        onChangeText={setLat}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude (ex : 2.2945)"
        keyboardType="numeric"
        value={lng}
        onChangeText={setLng}
      />
      <TextInput
        style={styles.input}
        placeholder="Difficulté (1 à 5)"
        keyboardType="numeric"
        value={difficulty}
        onChangeText={setDifficulty}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (facultative)"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Ajouter la cache" onPress={handleSubmit} />
    </ScrollView>
  </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
});
