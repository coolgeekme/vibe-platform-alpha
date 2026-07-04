import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-vibe-bg px-6">
        <Text className="text-vibe-accent font-mono text-4xl mb-2">404</Text>
        <Text className="text-vibe-text font-semibold text-lg mb-2">Screen not found</Text>
        <Text className="text-vibe-muted text-sm text-center mb-8">
          This route doesn't exist in the Vibe Platform mobile app.
        </Text>
        <Link href="/" asChild>
          <Text className="text-vibe-accent font-mono text-sm underline">
            ← Back to Dashboard
          </Text>
        </Link>
      </View>
    </>
  );
}
