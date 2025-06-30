// ✅ app/settings/edit-profile.tsx
import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, TextInput, Button, useTheme, Avatar } from 'react-native-paper';
import { getToken } from '../../../hooks/useToken';
import { API_URL } from '../../../constants/api';

export default function EditProfileScreen() {
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setEmail(data.email || '');
          if (data.imageUrl) setImageUri(data.imageUrl);
        }
      } catch (err) {
        Alert.alert('Erreur', 'Impossible de charger les infos du profil');
      }
    };

    fetchProfile();
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const token = await getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Erreur', data.message || 'Échec de la mise à jour');
      } else {
        Alert.alert('Succès', 'Profil mis à jour');
      }
    } catch (err) {
      Alert.alert('Erreur', 'Serveur injoignable');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier le profil</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={handlePickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <Avatar.Icon icon="account" size={80} />
        )}
        <Text style={styles.imageText}>Appuyez pour changer la photo</Text>
      </TouchableOpacity>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Enregistrer
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    marginTop: 8,
    color: '#666',
  },
});


