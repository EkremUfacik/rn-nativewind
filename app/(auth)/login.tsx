import { useAuth } from '@/contexts/auth-context';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Lütfen email ve şifre giriniz');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);

    const { error: googleError } = await signInWithGoogle();

    if (googleError) {
      setError(googleError.message);
      setIsGoogleLoading(false);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-950"
    >
      <View className="flex-1 justify-center px-8">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-4xl font-bold text-white text-center mb-2">
            Hoş Geldiniz
          </Text>
          <Text className="text-gray-400 text-center text-lg">
            Hesabınıza giriş yapın
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
            <Text className="text-red-400 text-center">{error}</Text>
          </View>
        )}

        {/* Form */}
        <View className="gap-4">
          <View>
            <Text className="text-gray-400 text-sm mb-2 ml-1">Email</Text>
            <TextInput
              className="bg-gray-900 text-white px-4 py-4 rounded-xl border border-gray-800 text-base"
              placeholder="ornek@email.com"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="text-gray-400 text-sm mb-2 ml-1">Şifre</Text>
            <TextInput
              className="bg-gray-900 text-white px-4 py-4 rounded-xl border border-gray-800 text-base"
              placeholder="••••••••"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            className={`mt-4 py-4 rounded-xl ${
              isLoading ? 'bg-indigo-700' : 'bg-indigo-600'
            }`}
            onPress={handleLogin}
            disabled={isLoading || isGoogleLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Giriş Yap
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-gray-800" />
            <Text className="text-gray-500 px-4">VEYA</Text>
            <View className="flex-1 h-[1px] bg-gray-800" />
          </View>

          <TouchableOpacity
            className="bg-white py-4 rounded-xl flex-row justify-center items-center"
            onPress={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            activeOpacity={0.8}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-gray-900 text-center font-semibold text-lg">
                Google ile Giriş Yap
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View className="mt-8 flex-row justify-center items-center">
          <Text className="text-gray-400">Hesabınız yok mu? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-indigo-400 font-semibold">Kayıt Olun</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
