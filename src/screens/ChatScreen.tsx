import React, { useRef } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ListRenderItem
} from 'react-native';
import { useChatStore, Message } from '../store/chatStore';
import { Menu, Bot, User, Send } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import {
  Surface,
  Text,
  TextInput,
  IconButton,
  useTheme,
  Avatar,
  ActivityIndicator
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen({ navigation }: any) {
  const { sessions, currentSessionId, inputText, setInputText, addMessage, updateLastMessage, setLoading, isLoading } = useChatStore();
  const flatListRef = useRef<FlatList>(null);
  const theme = useTheme();

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession ? currentSession.messages : [];

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
    <View style={[styles.messageContainer, { backgroundColor: item.sender === 'other' ? 'transparent' : 'transparent' }]}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {item.sender === 'me' ? (
           <Avatar.Icon size={32} icon={() => <User color="white" size={20} />} style={{ backgroundColor: theme.colors.secondary }} />
        ) : (
          <Avatar.Icon size={32} icon={() => <Bot color="white" size={20} />} style={{ backgroundColor: theme.colors.primary }} />
        )}
      </View>
      
      {/* Content */}
      <View style={styles.messageContent}>
        <Text style={[styles.senderName, { color: theme.colors.onSurfaceVariant }]}>
            {item.sender === 'me' ? 'You' : 'ChatGPT'}
        </Text>
        {item.sender === 'other' ? (
          <Markdown
            style={{
              body: { color: theme.colors.onSurface, fontSize: 16, lineHeight: 24 },
              code_inline: { backgroundColor: theme.colors.surfaceVariant, padding: 2, borderRadius: 4, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
              fence: { backgroundColor: theme.colors.surfaceVariant, padding: 10, borderRadius: 8, marginVertical: 8 },
            }}
          >
            {item.text + (item.isStreaming && isLoading && item.id === messages[messages.length-1].id ? ' ▍' : '')}
          </Markdown>
        ) : (
          <Text style={{ fontSize: 16, lineHeight: 24, color: theme.colors.onSurface }}>
            {item.text}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <Surface style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
          <IconButton
            icon={() => <Menu color={theme.colors.onSurface} size={24} />}
            onPress={() => navigation.openDrawer()}
          />
          <Text variant="titleMedium" style={{ flex: 1, textAlign: 'center' }}>ChatGPT 4o</Text>
          <View style={{ width: 48 }} /> 
        </View>

        {/* Chat Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          style={{ flex: 1 }}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
          />

          {/* Input Area */}
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surfaceVariant }]}>
              <TextInput
                mode="flat"
                placeholder="Message ChatGPT..."
                value={inputText}
                onChangeText={setInputText}
                style={[styles.input, { backgroundColor: 'transparent' }]}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                textColor={theme.colors.onSurface}
                placeholderTextColor={theme.colors.onSurfaceDisabled}
                multiline
              />
              <IconButton
                icon={() => isLoading ? <ActivityIndicator size={20} /> : <Send color={inputText.length > 0 ? theme.colors.primary : theme.colors.onSurfaceDisabled} size={20} />}
                onPress={sendMessage}
                disabled={isLoading || inputText.length === 0}
                style={styles.sendButton}
              />
            </View>
            <Text style={[styles.footerText, { color: theme.colors.onSurfaceDisabled }]}>
              ChatGPT can make mistakes. Check important info.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  chatList: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatarContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    margin: 0,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
});
