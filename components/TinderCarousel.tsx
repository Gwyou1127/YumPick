import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import foodData from '../data.json';
import { OptimizedImage } from './OptimizedImage';
import { imageCache } from '../utils/imageCache';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.85;
const CARD_HEIGHT = screenHeight * 0.6;
const SWIPE_THRESHOLD = 120;
const VERTICAL_SWIPE_THRESHOLD = 80;

interface FoodItem {
  id: string;
  name: string;
  url: string;
}

interface CardProps {
  item: FoodItem;
  index: number;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

const Card: React.FC<CardProps> = ({ item, index, isTop, onSwipe }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current; // 모든 카드 크기 동일

  // 각 카드마다 다른 기본 위치 설정 (카드가 위쪽으로 겹쳐있는 효과)
  const baseTranslateY = useRef(new Animated.Value(index * -12)).current; // y값을 줄여서 더 자연스럽게

  useEffect(() => {
    if (isTop) {
      // 첫 번째 카드는 즉시 표시
      Animated.spring(baseTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    } else {
      // 겹쳐진 카드들의 위치도 부드럽게 조정
      Animated.spring(baseTranslateY, {
        toValue: index * -12,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    }
  }, [isTop, baseTranslateY, index]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onMoveShouldSetPanResponder: () => isTop,
      onPanResponderGrant: () => {
        // 제스처 시작
      },
      onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const { dx, dy } = gestureState;
        
        translateX.setValue(dx);
        translateY.setValue(dy);
        
        // 좌우 슬라이드 시에만 회전 (이미지 넘기기)
        if (Math.abs(dx) > Math.abs(dy)) {
          rotate.setValue(dx / 120);
          
          // 스와이프 진행도에 따라 겹쳐진 카드들이 천천히 첫번째 카드 위치로 이동
          const swipeProgress = Math.abs(dx) / SWIPE_THRESHOLD;
          if (index === 1) { // 두 번째 카드
            // 스와이프가 진행될수록 첫번째 카드 위치로 이동
            const newY = -12 + (swipeProgress * 12); // -12 -> 0 (첫번째 카드 위치)
            baseTranslateY.setValue(newY);
          } else if (index === 2) { // 세 번째 카드
            // 세 번째 카드도 스와이프 진행에 따라 두 번째 카드 위치로 이동
            const newY = -24 + (swipeProgress * 12); // -24 -> -12 (두 번째 카드 위치)
            baseTranslateY.setValue(newY);
          }
        }
      },
      onPanResponderRelease: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const { dx, dy } = gestureState;
        const horizontalSwipe = Math.abs(dx) > Math.abs(dy);
        
        if (horizontalSwipe && Math.abs(dx) > SWIPE_THRESHOLD) {
          // 좌우 슬라이드: 이미지 넘기기
          const direction = dx > 0 ? 'right' : 'left';
          const targetX = direction === 'right' ? screenWidth * 1.5 : -screenWidth * 1.5;
          
          // 겹쳐진 카드들을 천천히 첫번째 카드 위치로 이동시키는 애니메이션
          if (index === 1) {
            // 두 번째 카드를 첫번째 카드 위치로 천천히 이동
            Animated.timing(baseTranslateY, {
              toValue: 0,
              duration: 600, // 천천히 이동
              useNativeDriver: true,
            }).start();
          } else if (index === 2) {
            // 세 번째 카드를 두 번째 카드 위치로 천천히 이동
            Animated.timing(baseTranslateY, {
              toValue: -12,
              duration: 600, // 천천히 이동
              useNativeDriver: true,
            }).start();
          }
          
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: targetX,
              duration: 400, // 애니메이션 시간 증가
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: dy * 2,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(rotate, {
              toValue: direction === 'right' ? 1 : -1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onSwipe(direction);
          });
        } else if (!horizontalSwipe && Math.abs(dy) > VERTICAL_SWIPE_THRESHOLD) {
          // 위아래 슬라이드: 좋아요/싫어요
          const direction = dy > 0 ? 'down' : 'up';
          const targetY = direction === 'down' ? screenHeight * 1.5 : -screenHeight * 1.5;
          
          // 겹쳐진 카드들을 천천히 첫번째 카드 위치로 이동시키는 애니메이션
          if (index === 1) {
            Animated.timing(baseTranslateY, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }).start();
          } else if (index === 2) {
            Animated.timing(baseTranslateY, {
              toValue: -12,
              duration: 600,
              useNativeDriver: true,
            }).start();
          }
          
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: dx * 2,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: targetY,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onSwipe(direction);
          });
        } else {
          // 원래 위치로 돌아가기 (더 부드럽게)
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7
            }),
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7
            }),
            Animated.spring(rotate, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7
            }),
            // 겹쳐진 카드들도 원래 위치로 복원
            Animated.spring(baseTranslateY, {
              toValue: index * -12,
              useNativeDriver: true,
              tension: 50,
              friction: 7
            }),
          ]).start();
        }
      },
    })
  ).current;

  const cardStyle = {
    transform: [
      { translateX },
      { translateY: Animated.add(baseTranslateY, translateY) },
      { rotate: rotate.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-15deg', '0deg', '15deg'],
      })},
      { scale },
    ],
  };

  return (
    <Animated.View 
      style={[styles.card, cardStyle, { zIndex: 100 - index }]}
      {...panResponder.panHandlers}
    >
      <OptimizedImage 
        source={{ uri: item.url }} 
        style={styles.cardImage}
        resizeMode="cover"
        showLoadingIndicator={true}
        placeholderColor="#f8f8f8"
      />
    </Animated.View>
  );
};

export const TinderCarousel: React.FC = () => {
  const [cards, setCards] = useState<FoodItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCards, setLikedCards] = useState<FoodItem[]>([]);
  const [dislikedCards, setDislikedCards] = useState<FoodItem[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // 초기 카드 데이터 설정
    const shuffledFoods = shuffleArray(foodData.foods);
    setCards(shuffledFoods);
    
    // 첫 5개 이미지 프리로드
    const firstBatch = shuffledFoods.slice(0, 5).map(item => item.url);
    imageCache.preloadImages(firstBatch);
  }, []);

  const shuffleArray = (array: FoodItem[]): FoodItem[] => {
    const shuffled = [...array];
    const now = new Date();
    const seed = now.getTime() % shuffled.length;
    
    for (let i = 0; i < shuffled.length; i++) {
      const swapIndex = (i + seed + (i * 7)) % shuffled.length;
      const temp = shuffled[i];
      shuffled[i] = shuffled[swapIndex];
      shuffled[swapIndex] = temp;
    }
    
    if (seed % 2 === 0) {
      shuffled.reverse();
    }
    
    return shuffled;
  };

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    const currentCard = cards[currentIndex];
    
    if (direction === 'up') {
      setLikedCards(prev => [...prev, currentCard]);
      console.log(`좋아요: ${currentCard.name}`);
    } else if (direction === 'down') {
      setDislikedCards(prev => [...prev, currentCard]);
      console.log(`싫어요: ${currentCard.name}`);
    } else {
      console.log(`${direction === 'right' ? '오른쪽' : '왼쪽'}으로 이미지 넘기기: ${currentCard.name}`);
    }
    
    // 전환 시작
    setIsTransitioning(true);
    
    // 현재 인덱스 업데이트
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      
      // 카드가 부족해지면 새로운 카드 추가
      if (newIndex >= cards.length - 3) {
        const newCards = shuffleArray(foodData.foods).slice(0, 5);
        setCards(prevCards => [...prevCards, ...newCards]);
        
        // 새로 추가된 카드들의 이미지 프리로드
        const newUrls = newCards.map(item => item.url);
        imageCache.preloadImages(newUrls);
      }
      
      // 다음 3개 이미지 미리 프리로드
      if (newIndex < cards.length - 3) {
        const nextBatch = cards.slice(newIndex + 1, newIndex + 4).map(item => item.url);
        imageCache.preloadImages(nextBatch);
      }
      
      return newIndex;
    });
    
    // 전환 완료 후 상태 리셋 (더 긴 시간으로 설정)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  }, [currentIndex, cards]);

  const handleLike = useCallback(() => {
    if (currentIndex < cards.length) {
      handleSwipe('up');
    }
  }, [currentIndex, cards.length, handleSwipe]);

  const handleDislike = useCallback(() => {
    if (currentIndex < cards.length) {
      handleSwipe('down');
    }
  }, [currentIndex, cards.length, handleSwipe]);

  const resetCards = useCallback(() => {
    const shuffledFoods = shuffleArray(foodData.foods);
    setCards(shuffledFoods);
    setCurrentIndex(0);
    setLikedCards([]);
    setDislikedCards([]);
    setIsTransitioning(false);
  }, []);

  // 현재 표시할 카드들 (최대 3개)
  const visibleCards = cards.slice(currentIndex, currentIndex + 3);

  if (currentIndex >= cards.length) {
    return (
      <View style={styles.container}>
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>더 이상 카드가 없습니다!</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetCards}>
            <Text style={styles.resetButtonText}>다시 시작</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        {visibleCards.map((card, index) => (
          <Card
            key={`${card.id}-${currentIndex}-${index}`}
            item={card}
            index={index}
            isTop={index === 0}
            onSwipe={handleSwipe}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.85)',
    padding: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  cardTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  likeIndicator: {
    position: 'absolute',
    padding: 15,
    borderRadius: 15,
    borderWidth: 3,
    transform: [{ rotate: '-15deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  likeUp: {
    top: 40,
    right: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
    borderColor: '#4CAF50',
  },
  likeDown: {
    top: 40,
    left: 30,
    backgroundColor: 'rgba(244, 67, 54, 0.95)',
    borderColor: '#F44336',
  },
  likeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dislikeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  swipeHint: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: CARD_WIDTH,
    marginTop: 30,
  },
  actionButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  dislikeButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  cardInfo: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardInfoText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: CARD_WIDTH,
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  noMoreCardsText: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 35,
    paddingVertical: 18,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
