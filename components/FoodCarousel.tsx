import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import foodData from '../data.json';

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = screenWidth * 0.9;

interface FoodItem {
  id: string;
  name: string;
  url: string;
}

export const FoodCarousel: React.FC = () => {
  const [entries, setEntries] = useState<FoodItem[]>([]);

  // 배열 함수만을 사용한 랜덤 셔플 함수
  const shuffleArray = (array: FoodItem[]): FoodItem[] => {
    const shuffled = [...array];
    const now = new Date();
    const seed = now.getTime() % shuffled.length;
    
    // 시간 기반으로 배열을 여러 번 회전시켜 랜덤 효과 생성
    for (let i = 0; i < shuffled.length; i++) {
      const swapIndex = (i + seed + (i * 7)) % shuffled.length;
      const temp = shuffled[i];
      shuffled[i] = shuffled[swapIndex];
      shuffled[swapIndex] = temp;
    }
    
    // 추가로 배열을 reverse하여 더 다양한 순서 생성
    if (seed % 2 === 0) {
      shuffled.reverse();
    }
    
    return shuffled;
  };

  useEffect(() => {
    // 앱이 실행될 때마다 랜덤으로 섞기
    const shuffledFoods = shuffleArray(foodData.foods);
    setEntries(shuffledFoods);
  }, []); // 빈 의존성 배열로 앱 실행 시에만 실행

  // 슬라이드할 때마다 새로운 랜덤 이미지 추가
  const handleSnapToItem = (index: number) => {
    // 현재 마지막 아이템에 가까워지면 새로운 랜덤 이미지들을 추가
    if (index >= entries.length - 2) {
      const newRandomFoods = shuffleArray(foodData.foods).slice(0, 10);
      
      setEntries(prev => [...prev, ...newRandomFoods]);
    }
  };

  const renderItem = ({ item, index }: { item: FoodItem; index: number }) => {
    return (
      <View style={styles.slide}>
        <Image 
          source={{ uri: item.url }} 
          style={styles.foodImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        width={itemWidth}
        height={520}
        data={entries}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        autoPlay={false}
        loop={false}
        onSnapToItem={handleSnapToItem}
        style={styles.carouselContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    height: '100%',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
