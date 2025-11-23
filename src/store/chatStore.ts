import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
  isStreaming?: boolean;
};

export type Session = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
};

type ChatStore = {
  sessions: Session[];
  currentSessionId: string | null;
  inputText: string;
  isLoading: boolean;
  
  setInputText: (text: string) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (text: string) => void;
  setLoading: (loading: boolean) => void;
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
};

// Mock Data
const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    title: 'React Native Basics',
    createdAt: Date.now() - 10000000,
    messages: [
      { id: '1', text: 'What is React Native?', sender: 'me' },
      { id: '2', text: 'React Native is a framework for building native apps using React.', sender: 'other' },
    ],
  },
  {
    id: '2',
    title: 'Tailwind CSS Tips',
    createdAt: Date.now() - 5000000,
    messages: [
      { id: '1', text: 'How to center a div?', sender: 'me' },
      { id: '2', text: 'You can use `flex justify-center items-center`.', sender: 'other' },
    ],
  },
];

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: MOCK_SESSIONS,
      currentSessionId: '1',
      inputText: '',
      isLoading: false,

      setInputText: (text) => set({ inputText: text }),

      addMessage: (message) => set((state) => {
        const { sessions, currentSessionId } = state;
        if (!currentSessionId) return state;

        const updatedSessions = sessions.map((session) => {
          if (session.id === currentSessionId) {
            return {
              ...session,
              messages: [...session.messages, message],
              // Update title if it's the first message
              title: session.messages.length === 0 ? message.text.slice(0, 30) : session.title,
            };
          }
          return session;
        });

        return { sessions: updatedSessions };
      }),

      updateLastMessage: (text) => set((state) => {
        const { sessions, currentSessionId } = state;
        if (!currentSessionId) return state;

        const updatedSessions = sessions.map((session) => {
          if (session.id === currentSessionId) {
            const newMessages = [...session.messages];
            if (newMessages.length > 0) {
              newMessages[newMessages.length - 1] = {
                ...newMessages[newMessages.length - 1],
                text: text,
              };
            }
            return { ...session, messages: newMessages };
          }
          return session;
        });

        return { sessions: updatedSessions };
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      createNewSession: () => {
        const newSession: Session = {
          id: Date.now().toString(),
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id,
        }));
      },

      selectSession: (sessionId) => set({ currentSessionId: sessionId }),

      deleteSession: (sessionId) => set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== sessionId),
        currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
      })),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
