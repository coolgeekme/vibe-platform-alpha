import { ScrollView, View, Text, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DOCS = [
  {
    title: 'Expo Router Docs',
    description: 'File-based routing for React Native & web',
    url: 'https://docs.expo.dev/router/introduction/',
    badge: 'expo',
    badgeColor: 'bg-vibe-purple',
  },
  {
    title: 'NativeWind Docs',
    description: 'Tailwind CSS utility classes in React Native',
    url: 'https://www.nativewind.dev/',
    badge: 'styling',
    badgeColor: 'bg-vibe-cyan',
  },
  {
    title: 'Vibe Platform Web',
    description: 'The main Next.js web app (port 3000)',
    url: 'http://localhost:3000',
    badge: 'web',
    badgeColor: 'bg-vibe-accent',
  },
  {
    title: 'Vibe API Backend',
    description: 'Express + Socket.io server (port 4000)',
    url: 'http://localhost:4000',
    badge: 'api',
    badgeColor: 'bg-vibe-muted',
  },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-vibe-bg" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="mb-6">
          <Text className="text-vibe-text font-semibold text-base mb-1 uppercase tracking-wider">
            Resources & Links
          </Text>
          <Text className="text-vibe-muted text-xs mb-4">
            Docs, local services, and references for vibe coding mobile.
          </Text>

          <View className="gap-3">
            {DOCS.map((item) => (
              <TouchableOpacity
                key={item.title}
                className="bg-vibe-surface border border-vibe-border rounded-xl px-4 py-4"
                activeOpacity={0.8}
                onPress={() => Linking.openURL(item.url)}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-vibe-text font-semibold text-sm flex-1 mr-2">
                    {item.title}
                  </Text>
                  <View className={`${item.badgeColor} rounded-full px-2 py-0.5`}>
                    <Text className="text-vibe-bg text-xs font-bold">{item.badge}</Text>
                  </View>
                </View>
                <Text className="text-vibe-muted text-xs">{item.description}</Text>
                <Text className="text-vibe-border text-xs font-mono mt-1" numberOfLines={1}>
                  {item.url}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stack Info */}
        <View className="mb-8 bg-vibe-surface border border-vibe-border rounded-xl px-4 py-4">
          <Text className="text-vibe-accent font-mono text-xs mb-2 uppercase tracking-widest">
            Mobile Stack
          </Text>
          {['Expo ~51', 'Expo Router ~3.5', 'NativeWind ^4', 'React Native 0.74', 'TypeScript ~5.3'].map((item) => (
            <Text key={item} className="text-vibe-muted text-xs font-mono py-0.5">
              • {item}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
