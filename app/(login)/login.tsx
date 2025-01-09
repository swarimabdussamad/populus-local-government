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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [errors, setErrors] = useState({ email: '', password: '', role: '' });
  const router = useRouter();
  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: '', password: '', role: '' };

    if (!email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
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
    try {
      const response = await fetch(`${API_URL}/government/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify()
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await response.json();
      Alert.alert('Success', 'Form submitted successfully!');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to submit form. Please try again.');
      console.error('Submission error:', error);
    }
  };



  return (
    <View style={styles.container}>
  

      {/* Logo */}
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
    <View style={styles.input}>
    <DropdownComponent
        value={role}
        setValue={setRole}
        error={errors.role}
      />
    </View>
      

      {/* Email Input */}
      <TextInput
        style={[styles.input, errors.email ? styles.inputError : null]}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

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

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
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
  languageText: {
    marginTop: 20,
    color: '#5c5c5c',
    fontSize: 16,
    fontWeight: '500',
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
  showText: {
    marginLeft: 8,
    color: '#007bff',
    fontWeight: '600',
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
  forgotPasswordText: {
    color: '#007bff',
    marginBottom: 20,
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
