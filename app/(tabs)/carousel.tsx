import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  Platform 
} from 'react-native';
import { router } from 'expo-router';
import { TinderCarousel } from "@/components/TinderCarousel";
import { FoodCarousel } from "@/components/FoodCarousel";
import { RandomFoodModal } from "@/components/RandomFoodModal";

const { width: screenWidth } = Dimensions.get('window');

export default function Carousel() {
  const [isRandomModalVisible, setIsRandomModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* 뒤로가기 버튼 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* 상단 공백 */}
          <View style={styles.topSpacing} />

          {/* 메인 추천 섹션 */}
          <View style={styles.section}>
            <View style={styles.tinderContainer}>
              <TinderCarousel />
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 0,
    zIndex: 10,
  },
  backButton: {
    width: 80,
    height: 80,
    fontWeight: 'bold',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
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
  section: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tinderContainer: {
    flex: 1,
    minHeight: 400,
  },
  topSpacing: {
    height: 100,
  },
  bottomSpacing: {
    height: 50,
  },
});
