import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TouchableRipple, useTheme, Avatar, IconButton } from 'react-native-paper';
import { useChatStore } from '../store/chatStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, MessageSquare, Settings, User, Trash2 } from 'lucide-react-native';

export default function Sidebar({ navigation }: any) {
  const { sessions, currentSessionId, createNewSession, selectSession, deleteSession } = useChatStore();
  const theme = useTheme();

  const handleNewChat = () => {
    createNewSession();
    navigation.closeDrawer();
  };

  const handleSelectSession = (id: string) => {
    selectSession(id);
    navigation.closeDrawer();
  };

  // ChatGPT-like dark sidebar colors
  const sidebarBackgroundColor = '#202123';
  const sidebarTextColor = '#ECECF1';
  const sidebarHoverColor = '#2A2B32';

  return (
    <View style={[styles.container, { backgroundColor: sidebarBackgroundColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* New Chat Button */}
          <TouchableRipple
            onPress={handleNewChat}
            style={[styles.newChatButton, { borderColor: 'rgba(255,255,255,0.2)' }]}
            rippleColor="rgba(255, 255, 255, .1)"
          >
            <View style={styles.newChatContent}>
              <Plus color={sidebarTextColor} size={16} style={styles.icon} />
              <Text variant="bodyMedium" style={{ color: sidebarTextColor }}>New chat</Text>
            </View>
          </TouchableRipple>

          {/* History Section */}
          <View style={styles.historySection}>
            <Text variant="labelSmall" style={[styles.sectionTitle, { color: '#8E8EA0' }]}>History</Text>
            <ScrollView style={styles.historyList}>
              {sessions.map((session) => (
                <TouchableRipple
                  key={session.id}
                  onPress={() => handleSelectSession(session.id)}
                  style={[
                    styles.historyItem,
                    session.id === currentSessionId && { backgroundColor: '#343541' }
                  ]}
                  rippleColor="rgba(255, 255, 255, .1)"
                >
                  <View style={styles.historyItemContent}>
                    <MessageSquare size={16} color={sidebarTextColor} style={styles.historyIcon} />
                    <Text
                      numberOfLines={1}
                      style={[styles.historyText, { color: sidebarTextColor }]}
                    >
                      {session.title || 'New Chat'}
                    </Text>
                    {session.id === currentSessionId && (
                        <Trash2 
                            size={14} 
                            color="#8E8EA0" 
                            onPress={() => deleteSession(session.id)}
                            style={{ marginLeft: 'auto' }}
                        />
                    )}
                  </View>
                </TouchableRipple>
              ))}
            </ScrollView>
          </View>

          {/* Bottom Menu */}
          <View style={[styles.bottomMenu, { borderTopColor: 'rgba(255,255,255,0.2)' }]}>
            <TouchableRipple onPress={() => {}} style={styles.menuItem}>
                <View style={styles.menuItemContent}>
                    <User size={16} color={sidebarTextColor} style={styles.menuIcon} />
                    <Text style={{ color: sidebarTextColor }}>Upgrade to Plus</Text>
                </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => {}} style={styles.menuItem}>
                <View style={styles.menuItemContent}>
                    <Settings size={16} color={sidebarTextColor} style={styles.menuIcon} />
                    <Text style={{ color: sidebarTextColor }}>Settings</Text>
                </View>
            </TouchableRipple>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  newChatButton: {
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  newChatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  historySection: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 8,
    paddingHorizontal: 12,
    fontWeight: '500',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    marginRight: 12,
  },
  historyText: {
    flex: 1,
    fontSize: 14,
  },
  bottomMenu: {
    borderTopWidth: 1,
    paddingTop: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  }
});