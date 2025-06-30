
// ✅ app/register.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../constants/api';

export default function RegisterScreen() {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const router = useRouter();

  const handleRegister = async () => {


    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide.');
      return;
    }
    
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    if (!strongRegex.test(password)) {
      Alert.alert('Mot de passe faible', 'Utilise au moins 12 caractères avec majuscules, chiffres et symboles.');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }    
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword }),

      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Réponse invalide :', text);
        Alert.alert('Erreur', 'Réponse invalide du serveur');
        return;
      }

      if (!response.ok) {
        Alert.alert('Erreur', data.message || 'Inscription échouée');
        return;
      }

      setWelcomeMessage(`Welcome ${username} ! `);
      router.push('/login');
    } catch (err) {
      console.error('Erreur réseau :', err);
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        keyboardType="default"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />


    <View style={styles.passwordContainer}>
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={styles.passwordInput}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Ionicons
          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color="#999"
        />
      </TouchableOpacity>
    </View>

    <View style={styles.passwordContainer}>
      <TextInput
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showConfirm}
        style={styles.passwordInput}
      />
      <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
        <Ionicons
          name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color="#999"
        />
      </TouchableOpacity>
    </View>


      <Button title="S'inscrire" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20,
  },
  title: {
    fontSize: 24, marginBottom: 20, textAlign: 'center',
  },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 10, marginBottom: 15,
  },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { fontSize: 16, color: '#8e24aa' },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  }, 
});
