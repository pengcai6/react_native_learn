import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useChatStore } from '../store/chatStore';
import { Plus, MessageSquare, Settings, User } from 'lucide-react-native';

export default function Sidebar({ navigation }: any) {
  const clearMessages = useChatStore((state) => state.clearMessages);

  const handleNewChat = () => {
    clearMessages();
    navigation.closeDrawer();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 p-4">
        {/* New Chat Button */}
        <TouchableOpacity
          onPress={handleNewChat}
          className="flex-row items-center p-3 border border-gray-700 rounded-md mb-4 bg-gray-800"
        >
          <Plus color="white" size={20} className="mr-2" />
          <Text className="text-white font-medium">New chat</Text>
        </TouchableOpacity>

        {/* History Section (Mock) */}
        <View className="flex-1">
          <Text className="text-gray-500 text-xs font-bold mb-2 px-2">Today</Text>
          <TouchableOpacity className="flex-row items-center p-3 rounded-md hover:bg-gray-800">
            <MessageSquare color="gray" size={18} className="mr-2" />
            <Text className="text-gray-300 text-sm truncate">React Native Chat App</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-3 rounded-md hover:bg-gray-800">
            <MessageSquare color="gray" size={18} className="mr-2" />
            <Text className="text-gray-300 text-sm truncate">Tailwind CSS Tips</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Menu */}
        <View className="border-t border-gray-700 pt-2">
          <TouchableOpacity className="flex-row items-center p-3 rounded-md">
            <User color="white" size={20} className="mr-2" />
            <Text className="text-white text-sm">Upgrade to Plus</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-3 rounded-md">
            <Settings color="white" size={20} className="mr-2" />
            <Text className="text-white text-sm">Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
