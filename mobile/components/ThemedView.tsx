import { View } from 'react-native';
import type { ViewProps } from 'react-native';

type ThemedViewProps = ViewProps & {
  variant?: 'default' | 'surface' | 'card';
};

export function ThemedView({ variant = 'default', className = '', ...props }: ThemedViewProps) {
  const base =
    variant === 'surface'
      ? 'bg-vibe-surface border border-vibe-border rounded-xl'
      : variant === 'card'
      ? 'bg-vibe-surface border border-vibe-border rounded-xl px-4 py-4'
      : 'bg-vibe-bg';

  return <View className={`${base} ${className}`} {...props} />;
}
