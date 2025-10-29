import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';

export const MainScreen: React.FC = () => {
  const version = Constants.expoConfig?.version || '1.0.0';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.greeting}>YumPick</Text>
            <Text style={styles.subtitle}>YumPick에 오신 것을 환영합니다</Text>
          </View>

          {/* 메인 콘텐츠 */}
          <View style={styles.mainContent}>
            <TouchableOpacity
              style={styles.welcomeCard}
              onPress={() => router.push('/carousel')}
              activeOpacity={0.8}
            >
              <Text style={styles.welcomeTitle}>🍽️ 뭐 먹지?</Text>
              <Text style={styles.welcomeText}>
                다양한 음식을 탐색하고{'\n'}
                새로운 맛을 발견해보세요!
              </Text>
            </TouchableOpacity>
          </View>

          {/* 버전 정보 */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>v{version}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 200,
    paddingBottom: 5,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
    textAlign: 'center',
  },
  mainContent: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e8f4f8',
    transform: [{ scale: 1 }],
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#95a5a6',
    fontWeight: '500',
  },
});

