import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AGENTS = [
  {
    id: 'claude',
    name: 'Claude Code',
    description: 'Anthropic Claude — best for complex refactors and architecture',
    color: 'border-vibe-purple',
    accentText: 'text-vibe-purple',
  },
  {
    id: 'codex',
    name: 'OpenAI Codex',
    description: 'OpenAI Codex — optimized for code generation and completion',
    color: 'border-vibe-cyan',
    accentText: 'text-vibe-cyan',
  },
];

export default function AgentsScreen() {
  const [selectedAgent, setSelectedAgent] = useState<string>('claude');
  const [prompt, setPrompt] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-vibe-bg" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Agent Selector */}
        <View className="mb-6">
          <Text className="text-vibe-text font-semibold text-base mb-3 uppercase tracking-wider">
            Select Agent
          </Text>
          <View className="gap-3">
            {AGENTS.map((agent) => (
              <TouchableOpacity
                key={agent.id}
                onPress={() => setSelectedAgent(agent.id)}
                activeOpacity={0.8}
                className={`bg-vibe-surface rounded-xl border-2 px-4 py-4 ${
                  selectedAgent === agent.id ? agent.color : 'border-vibe-border'
                }`}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className={`font-bold text-sm ${agent.accentText}`}>
                    {agent.name}
                  </Text>
                  {selectedAgent === agent.id && (
                    <View className="bg-vibe-accent rounded-full w-4 h-4 items-center justify-center">
                      <Text className="text-vibe-bg text-xs font-bold">✓</Text>
                    </View>
                  )}
                </View>
                <Text className="text-vibe-muted text-xs">{agent.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prompt Input */}
        <View className="mb-6">
          <Text className="text-vibe-text font-semibold text-base mb-3 uppercase tracking-wider">
            Prompt
          </Text>
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Describe what you want to build or change..."
            placeholderTextColor="#71717a"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="bg-vibe-surface border border-vibe-border rounded-xl px-4 py-3 text-vibe-text text-sm font-mono min-h-[120px]"
          />
        </View>

        {/* Run Button */}
        <TouchableOpacity
          className="bg-vibe-accent rounded-xl px-4 py-4 items-center mb-8"
          activeOpacity={0.8}
          disabled={!prompt.trim()}
        >
          <Text className="text-vibe-bg font-bold text-sm tracking-widest uppercase">
            ▶ Run Agent
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
