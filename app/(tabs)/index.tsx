import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { chatService } from '@/services/chat.service';
import { MessageParam } from '@anthropic-ai/sdk/resources/messages';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ id: string; text: string; isUser: boolean }[]>([
    { id: '1', text: 'Merhaba! Size nasıl yardımcı olabilirim?', isUser: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessageText = message;
    const newMessage = { id: Date.now().toString(), text: userMessageText, isUser: true };
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Prepare messages for API
      const apiMessages: MessageParam[] = messages
        .filter(m => m.id !== '1') // Skip initial greeting if needed, or include it
        .map(m => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.text
        }));
      
      // Add current user message
      apiMessages.push({ role: 'user', content: userMessageText });

      const response = await chatService.sendMessage({ messages: apiMessages });

      if (response.success && response.message) {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          text: response.message!, 
          isUser: false 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          text: `Hata: ${response.error || 'Bir sorun oluştu.'}`, 
          isUser: false 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: 'Beklenmeyen bir hata oluştu.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View className="flex-1 px-4 pt-4">
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className={`mb-4 max-w-[80%] p-3 rounded-2xl ${
                item.isUser 
                  ? 'self-end bg-blue-500 rounded-br-none' 
                  : 'self-start bg-gray-200 dark:bg-gray-800 rounded-bl-none border border-gray-200 dark:border-gray-700'
              }`}>
                <Text className={`text-base ${item.isUser ? 'text-white' : 'text-black dark:text-white'}`}>
                  {item.text}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View className="p-4 pb-24 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex-row items-center gap-3">
          <TextInput
            className="flex-1 bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-4 rounded-full border border-gray-200 dark:border-gray-800 placeholder:text-gray-500"
            placeholder="Mesajınızı yazın..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity 
            onPress={sendMessage}
            disabled={isLoading}
            className={`p-4 rounded-full ${message.trim() ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            <IconSymbol name="paperplane.fill" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
