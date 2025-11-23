import { create } from 'zustand';

export type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
  isStreaming?: boolean;
};

type ChatStore = {
  messages: Message[];
  inputText: string;
  isLoading: boolean;
  setInputText: (text: string) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (text: string) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    { id: '1', text: '你好！我是 ChatGPT。', sender: 'other' },
  ],
  inputText: '',
  isLoading: false,
  setInputText: (text) => set({ inputText: text }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (text) => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0) {
      newMessages[newMessages.length - 1] = {
        ...newMessages[newMessages.length - 1],
        text: text,
      };
    }
    return { messages: newMessages };
  }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),
}));
