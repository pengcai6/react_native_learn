import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ListRenderItem
} from 'react-native';
import { useChatStore, Message } from '../store/chatStore';
import { Menu, ArrowUp, Bot, User } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';

export default function ChatScreen({ navigation }: any) {
  const { messages, inputText, setInputText, addMessage, updateLastMessage, setLoading, isLoading } = useChatStore();
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (inputText.trim().length === 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
    };
    addMessage(userMsg);
    setInputText('');
    setLoading(true);

    // Simulate AI Response (Streaming effect)
    const aiMsgId = (Date.now() + 1).toString();
    addMessage({ id: aiMsgId, text: '', sender: 'other', isStreaming: true });

    const fullResponse = `Here is a sample response with **Markdown** support!

\`\`\`javascript
console.log("Hello from ChatGPT!");
\`\`\`

- Item 1
- Item 2

Enjoy building your app!`;

    let currentText = '';
    const words = fullResponse.split(' '); // Simple word-by-word streaming simulation

    for (let i = 0; i < words.length; i++) {
      await new Promise<void>(resolve => setTimeout(resolve, 50)); // Delay for effect
      currentText += (i > 0 ? ' ' : '') + words[i];
      updateLastMessage(currentText);
    }
    
    setLoading(false);
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View className={`flex-row p-4 ${item.sender === 'other' ? 'bg-transparent' : 'bg-transparent'} `}>
      {/* Avatar */}
      <View className={`w-8 h-8 rounded-sm items-center justify-center mr-3 ${item.sender === 'me' ? 'bg-transparent' : 'bg-green-500 rounded-full'}`}>
        {item.sender === 'me' ? (
           // User usually doesn't show avatar in ChatGPT mobile, but let's keep a placeholder or nothing
           <View className="bg-gray-500 w-8 h-8 rounded-full items-center justify-center">
             <User color="white" size={16} />
           </View>
        ) : (
          <Bot color="white" size={18} />
        )}
      </View>
      
      {/* Content */}
      <View className="flex-1 pt-1">
        <Text className="font-bold text-gray-800 mb-1 text-sm">
            {item.sender === 'me' ? 'You' : 'ChatGPT'}
        </Text>
        {item.sender === 'other' ? (
          <Markdown
            style={{
              body: { color: '#374151', fontSize: 16, lineHeight: 24 },
              code_inline: { backgroundColor: '#f3f4f6', padding: 2, borderRadius: 4, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
              fence: { backgroundColor: '#f3f4f6', padding: 10, borderRadius: 8, marginVertical: 8 },
            }}
          >
            {item.text + (item.isStreaming && isLoading && item.id === messages[messages.length-1].id ? ' ▍' : '')}
          </Markdown>
        ) : (
          <Text className="text-base text-gray-800 leading-6">
            {item.text}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100 bg-white z-10">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Menu color="black" size={24} />
        </TouchableOpacity>
        <View className="flex-row items-center">
            <Text className="text-base font-semibold text-gray-700">ChatGPT 4o</Text>
        </View>
        <View className="w-6" /> 
      </View>

      {/* Chat List */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
        />

        {/* Input Area */}
        <View className="p-4 bg-white border-t border-gray-100">
          <View className="flex-row items-end bg-gray-100 rounded-3xl p-2">
             <TextInput
                className="flex-1 max-h-32 min-h-[40px] text-base text-black px-3 py-2"
                placeholder="Message ChatGPT..."
                placeholderTextColor="#6b7280"
                value={inputText}
                onChangeText={setInputText}
                multiline
                textAlignVertical="center"
              />
              <TouchableOpacity
                onPress={sendMessage}
                className={`p-2 rounded-full mb-1 mr-1 ${inputText.trim().length > 0 ? 'bg-black' : 'bg-gray-300'}`}
                disabled={inputText.trim().length === 0}
              >
                 <ArrowUp color="white" size={20} />
              </TouchableOpacity>
          </View>
          <Text className="text-center text-xs text-gray-400 mt-2">
            ChatGPT can make mistakes. Check important info.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
