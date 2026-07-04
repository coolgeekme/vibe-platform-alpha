import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const STATUS_ITEMS = [
  { label: 'Web Frontend', status: 'online', port: '3000' },
  { label: 'API Backend', status: 'online', port: '4000' },
  { label: 'Mobile', status: 'online', port: 'expo' },
];

const QUICK_ACTIONS = [
  { label: 'Run Agent', color: 'bg-vibe-accent', textColor: 'text-vibe-bg' },
  { label: 'Preview Canvas', color: 'bg-vibe-purple', textColor: 'text-white' },
  { label: 'View Logs', color: 'bg-vibe-surface border border-vibe-border', textColor: 'text-vibe-text' },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-vibe-bg" edges={['bottom']}>
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-vibe-accent font-bold text-2xl tracking-widest uppercase">
            Vibe Platform
          </Text>
          <Text className="text-vibe-muted text-sm mt-1">
            AI Agent Coding Platform
          </Text>
        </View>

        {/* Services Status */}
        <View className="mb-6">
          <Text className="text-vibe-text font-semibold text-base mb-3 uppercase tracking-wider">
            Services
          </Text>
          <View className="bg-vibe-surface rounded-xl border border-vibe-border overflow-hidden">
            {STATUS_ITEMS.map((item, idx) => (
              <View
                key={item.label}
                className={`flex-row items-center justify-between px-4 py-3 ${
                  idx < STATUS_ITEMS.length - 1 ? 'border-b border-vibe-border' : ''
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-2 h-2 rounded-full bg-vibe-accent" />
                  <Text className="text-vibe-text text-sm">{item.label}</Text>
                </View>
                <Text className="text-vibe-muted text-xs font-mono">:{item.port}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-vibe-text font-semibold text-base mb-3 uppercase tracking-wider">
            Quick Actions
          </Text>
          <View className="gap-3">
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                className={`${action.color} rounded-xl px-4 py-4 items-center`}
                activeOpacity={0.8}
              >
                <Text className={`${action.textColor} font-semibold text-sm tracking-wide`}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Banner */}
        <View className="mb-8 bg-vibe-surface border border-vibe-cyan rounded-xl px-4 py-3">
          <Text className="text-vibe-cyan text-xs font-mono">
            💡 Connect to your backend at port 4000 to stream agent output in real time.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
