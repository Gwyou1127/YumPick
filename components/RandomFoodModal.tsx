import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import foodData from '../data.json';
import { OptimizedImage } from './OptimizedImage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface RandomFoodModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RandomFoodModal: React.FC<RandomFoodModalProps> = ({
  visible,
  onClose,
}) => {
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  const getRandomFood = () => {
    const randomIndex = Math.floor(Math.random() * foodData.foods.length);
    return foodData.foods[randomIndex];
  };

  const handleRandomSelect = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSelectedFood(null);

    // 애니메이션 시작
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const randomFood = getRandomFood();
      setSelectedFood(randomFood);
      setIsAnimating(false);
    });
  };

  const handleClose = () => {
    setSelectedFood(null);
    onClose();
  };

  const spin = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>🎯 랜덤 추천</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {!selectedFood && !isAnimating && (
              <View style={styles.initialState}>
                <Text style={styles.initialText}>🎲</Text>
                <Text style={styles.initialSubtext}>
                  버튼을 눌러서{'\n'}랜덤 음식을 추천받으세요!
                </Text>
              </View>
            )}

            {isAnimating && (
              <View style={styles.animatingState}>
                <Animated.View style={[styles.spinningWheel, { transform: [{ rotate: spin }] }]}>
                  <Text style={styles.spinningText}>🎲</Text>
                </Animated.View>
                <Text style={styles.animatingText}>음식을 선택하고 있어요...</Text>
              </View>
            )}

            {selectedFood && !isAnimating && (
              <View style={styles.resultState}>
                <View style={styles.foodImageContainer}>
                  <OptimizedImage
                    source={{ uri: selectedFood.url }}
                    style={styles.foodImage}
                    resizeMode="cover"
                    showLoadingIndicator={true}
                    placeholderColor="#f8f8f8"
                  />
                </View>
                <Text style={styles.foodName}>{selectedFood.name}</Text>
                <Text style={styles.foodDescription}>
                  오늘은 이 음식 어떠세요? 🍽️
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.randomButton, isAnimating && styles.disabledButton]}
              onPress={handleRandomSelect}
              disabled={isAnimating}
            >
              <Text style={styles.randomButtonText}>
                {isAnimating ? '선택 중...' : selectedFood ? '다시 선택' : '랜덤 선택'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8f4f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialState: {
    alignItems: 'center',
  },
  initialText: {
    fontSize: 64,
    marginBottom: 20,
  },
  initialSubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  animatingState: {
    alignItems: 'center',
  },
  spinningWheel: {
    marginBottom: 20,
  },
  spinningText: {
    fontSize: 64,
  },
  animatingText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  resultState: {
    alignItems: 'center',
    width: '100%',
  },
  foodImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  foodDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8f4f8',
  },
  randomButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  randomButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
