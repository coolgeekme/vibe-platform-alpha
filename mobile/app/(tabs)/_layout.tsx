import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View className="items-center justify-center">
      <Text
        className={focused ? 'text-vibe-accent text-xs font-bold' : 'text-vibe-muted text-xs'}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#12121a',
          borderTopColor: '#1e1e2e',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#71717a',
        headerStyle: { backgroundColor: '#0a0a0f' },
        headerTintColor: '#e4e4e7',
        headerTitleStyle: { fontFamily: 'SpaceMono' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon label="⬛" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="agents"
        options={{
          title: 'Agents',
          tabBarIcon: ({ focused }) => <TabIcon label="🤖" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => <TabIcon label="🔍" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
