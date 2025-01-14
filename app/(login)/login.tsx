import React, { useState } from 'react';
import { API_URL } from '@/constants/constants';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import DropdownComponent from '@/components/DropdownComponent';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [errors, setErrors] = useState({ username: '', password: '', role: '' });
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    let newErrors = { username: '', password: '', role: '' };

    if (!username) {
      newErrors.username = 'Username is required.';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    if (!role) {
      newErrors.role = 'Please select a role.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const loginData = {
        username: username,
        password: password,
        role: role
      };

      console.log('Sending login request with:', loginData); // Debug log

      const response = await fetch(`${API_URL}/government/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      

      await AsyncStorage.setItem('userToken', data.token);
      console.log('Token stored:', data.token); // Debug log

      // Show alert first and navigate after user acknowledges
      Alert.alert(
        'Success',
        'Logged in successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Navigating to tabs...'); // Debug log
              router.replace('/(tabs)/home');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Login error:', error); // Debug log
      Alert.alert(
        'Login Failed', 
        'Unable to log in. Please check your credentials and try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />

      {/* Role Dropdown */}
      <View style={styles.input}>
        <DropdownComponent
          value={role}
          setValue={setRole}
          error={errors.role}
        />
      </View>
      {errors.role ? <Text style={styles.errorText}>{errors.role}</Text> : null}

      {/* Username Input */}
      <TextInput
        style={[styles.input, errors.username ? styles.inputError : null]}
        placeholder="Username"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            { flex: 1 },
            errors.password ? styles.inputError : null,
          ]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: '#4CAF50' }]} // Test button styling
        onPress={() => {
        console.log('Navigating directly to tabs...');
        router.replace('/(tabs)/home'); // Replace this with your desired tab path
        }}
      >
  <Text style={styles.loginText}>Test Navigate to Tabs</Text>
</TouchableOpacity>

      

      {/* Create New Account */}
      <Link href="/signup" style={styles.createAccountButton}>
        Create new account
      </Link>

      <Text style={styles.footerText}>POPULUS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1b1b7e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 15,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createAccountButton: {
    borderWidth: 1,
    borderColor: '#1b1b7e',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  footerText: {
    marginTop: 30,
    color: '#1b1b7e',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});

export default LoginPage;
