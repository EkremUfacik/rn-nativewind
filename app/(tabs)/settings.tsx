import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from 'nativewind';
import { Alert, SafeAreaView, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 p-4 pt-12">
        <ThemedText type="title" className="mb-8 dark:text-white">Ayarlar</ThemedText>
        
        {/* User Info */}
        {user && (
          <View className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 mb-4">
            <ThemedText className="text-gray-500 dark:text-gray-400 text-sm mb-1">Giriş Yapılan Hesap</ThemedText>
            <ThemedText className="dark:text-white font-medium">{user.email}</ThemedText>
          </View>
        )}
        
        <View className="bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden">
          <View className="p-4 flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <ThemedText className="dark:text-white">Tema</ThemedText>
            <View className="flex-row gap-2">
              <TouchableOpacity 
                onPress={() => setColorScheme('light')}
                className={`px-3 py-1 rounded-full ${colorScheme === 'light' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <ThemedText className={colorScheme === 'light' ? 'text-white' : 'dark:text-white'}>Açık</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setColorScheme('dark')}
                className={`px-3 py-1 rounded-full ${colorScheme === 'dark' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <ThemedText className={colorScheme === 'dark' ? 'text-white' : 'dark:text-white'}>Koyu</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setColorScheme('system')}
                className={`px-3 py-1 rounded-full ${colorScheme === 'system' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <ThemedText className={colorScheme === 'system' ? 'text-white' : 'dark:text-white'}>Sistem</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-6 bg-red-500 py-4 rounded-xl"
          activeOpacity={0.8}
        >
          <ThemedText className="text-white text-center font-semibold text-lg">Çıkış Yap</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
