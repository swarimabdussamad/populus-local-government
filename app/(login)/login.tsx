import React, { useState } from 'react';
import { API_URL } from '@/constants/constants'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DropdownComponent from '@/components/DropdownComponent';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [errors, setErrors] = useState({ username: '', password: '', role: '' });
  const [isLoading, setIsLoading] = useState(false); // Initialize loading state
  const router = useRouter();

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: '', password: '', role: '' };

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
      isValid = false;
    }

    if (!password.trim()) {
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

  // Login handler
  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true); // Start loading

    try {
      const loginData = {
        username,
        password,
        role,
      };

      // Determine endpoint based on role
      const endpoint =
        role === 'local_government'
          ? `${API_URL}/government/login`
          : `${API_URL}/department/login`;

      console.log('Sending login request:', loginData);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        console.log(data)
        throw new Error(data.message || 'Authentication faile.');
      }


      
      if (data.success && data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('currentUsername', username);
        


        // Modified navigation logic based on role
        if (role === 'local_government') {
          router.replace('/home');
        } else {
          router.replace('/homed');
        }
      } else {
        throw new Error('Invalid response format.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        (error as Error).message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false); // Stop loading
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
        onChangeText={setUsername}
      />
      {errors.username ? (
        <Text style={styles.errorText}>{errors.username}</Text>
      ) : null}

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
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Log In</Text>
        )}
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
