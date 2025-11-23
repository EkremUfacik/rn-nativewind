import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { freepikService } from '@/services/freepik.service';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native';

export default function GenerateScreen() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setGeneratedImage(null);
    setStatusMessage('Görüntü oluşturuluyor...');

    try {
      // 1. Initiate generation
      const initResponse = await freepikService.generateImage(prompt);
      
      if (initResponse.data.task_id) {
        const taskId = initResponse.data.task_id;
        
        // 2. Poll for status
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await freepikService.checkStatus(taskId);
            console.log('Status:', statusResponse.data.status);

            if (statusResponse.data.status === 'COMPLETED') {
              clearInterval(pollInterval);
              if (statusResponse.data.generated && statusResponse.data.generated.length > 0) {
                setGeneratedImage(statusResponse.data.generated[0]);
                setStatusMessage('Tamamlandı!');
              } else {
                setStatusMessage('Görüntü oluşturulamadı.');
              }
              setIsLoading(false);
            } else if (statusResponse.data.status === 'FAILED') {
              clearInterval(pollInterval);
              setStatusMessage('Oluşturma başarısız oldu.');
              setIsLoading(false);
            }
            // If CREATED or PENDING, continue polling
          } catch (err) {
            clearInterval(pollInterval);
            setStatusMessage('Durum kontrolünde hata oluştu.');
            setIsLoading(false);
          }
        }, 2000); // Check every 2 seconds
      } else {
        setStatusMessage('Başlatma hatası.');
        setIsLoading(false);
      }
    } catch (error) {
      setStatusMessage('Bir hata oluştu.');
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Görüntüyü kaydetmek için galeri erişim izni vermelisiniz.');
        return;
      }

      const fileUri = FileSystem.cacheDirectory + 'generated-image.png';
      const { uri } = await FileSystem.downloadAsync(generatedImage, fileUri);
      
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Başarılı', 'Görüntü galeriye kaydedildi!');
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Görüntü kaydedilirken bir sorun oluştu.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View className="flex-1 p-4 pt-8 pb-24">
          <ThemedText type="title" className="mb-8 dark:text-white">Görüntü Oluştur</ThemedText>

          <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8 overflow-hidden border border-gray-200 dark:border-gray-800">
            {isLoading ? (
              <View className="items-center gap-4">
                <ActivityIndicator size="large" color="#3B82F6" />
                <ThemedText className="text-gray-500 dark:text-gray-400">{statusMessage}</ThemedText>
              </View>
            ) : generatedImage ? (
              <View className="w-full h-full relative">
                <Image 
                  source={{ uri: generatedImage }} 
                  className="w-full h-full" 
                  resizeMode="contain"
                />
                <TouchableOpacity 
                  onPress={handleDownload}
                  className="absolute bottom-4 right-4 bg-black/50 p-3 rounded-full"
                >
                  <IconSymbol name="arrow.down.to.line" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center gap-4 p-8">
                <IconSymbol name="photo" size={64} color="#9CA3AF" />
                <ThemedText className="text-gray-500 dark:text-gray-400 text-center">
                  Hayalinizdeki görüntüyü oluşturmak için bir prompt girin.
                </ThemedText>
              </View>
            )}
          </View>

          <View className="flex-row gap-3 items-end">
            <TextInput
              className="flex-1 bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-4 rounded-xl border border-gray-200 dark:border-gray-800 min-h-[100px] text-base"
              placeholder="Örn: Gün batımında fütüristik bir şehir..."
              placeholderTextColor="#9CA3AF"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity 
              onPress={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className={`p-4 rounded-xl h-[100px] items-center justify-center w-[80px] ${
                isLoading || !prompt.trim() 
                  ? 'bg-gray-300 dark:bg-gray-700' 
                  : 'bg-blue-500'
              }`}
            >
              <IconSymbol name="sparkles" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
