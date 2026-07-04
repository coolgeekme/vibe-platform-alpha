import { Text } from 'react-native';
import type { TextProps } from 'react-native';

type ThemedTextProps = TextProps & {
  variant?: 'default' | 'title' | 'subtitle' | 'muted' | 'accent' | 'mono';
};

const variantClasses: Record<NonNullable<ThemedTextProps['variant']>, string> = {
  default: 'text-vibe-text text-sm',
  title: 'text-vibe-text font-bold text-xl tracking-wide',
  subtitle: 'text-vibe-text font-semibold text-base',
  muted: 'text-vibe-muted text-xs',
  accent: 'text-vibe-accent font-bold',
  mono: 'text-vibe-text font-mono text-xs',
};

export function ThemedText({ variant = 'default', className = '', ...props }: ThemedTextProps) {
  return <Text className={`${variantClasses[variant]} ${className}`} {...props} />;
}
