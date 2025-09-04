import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import foodData from '../data.json';
import { OptimizedImage } from './OptimizedImage';

const { width: screenWidth } = Dimensions.get('window');

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  category: string;
  categoryEmoji: string;
}

const categoryKeywords: { [key: string]: string[] } = {
  '한식': ['비빔밥', '불고기', '김치', '된장', '찌개', '국', '밥', '전', '조림', '볶음', '탕', '냉면', '떡볶이'],
  '일식': ['라멘', '우동', '소바', '초밥', '덮밥', '규동', '오야코동', '카츠동', '사케동', '텐동', '스키야키', '샤브샤브'],
  '양식': ['파스타', '피자', '스테이크', '샐러드', '햄버거', '샌드위치', '스프', '스튜', '리조또', '라자냐'],
  '중식': ['짜장면', '짬뽕', '탕수육', '마파두부', '깐풍기', '깐쇼새우', '팔보채', '유산슬', '꿔바로우', '멘보샤'],
  '멕시칸': ['타코', '부리또', '케밥', '퀘사디야', '엔칠라다', '나초', '칠리', '파히타', '카르니타스'],
  '인도': ['커리', '비리야니', '탄두리', '팔락', '달마', '사모사', '난', '로티', '차트', '도사', '우타팜'],
};

export const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  category,
  categoryEmoji,
}) => {
  const [selectedFood, setSelectedFood] = useState<any>(null);

  const getCategoryFoods = () => {
    const keywords = categoryKeywords[category] || [];
    return foodData.foods.filter(food => 
      keywords.some(keyword => food.name.includes(keyword))
    );
  };

  const categoryFoods = getCategoryFoods();

  const renderFoodItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.foodItem}
      onPress={() => setSelectedFood(item)}
    >
      <View style={styles.foodImageContainer}>
        <OptimizedImage
          source={{ uri: item.url }}
          style={styles.foodImage}
          resizeMode="cover"
          showLoadingIndicator={true}
          placeholderColor="#f8f8f8"
        />
      </View>
      <Text style={styles.foodName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {categoryEmoji} {category}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {categoryFoods.length}개의 {category} 메뉴를 찾았어요
          </Text>
          
          <FlatList
            data={categoryFoods}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.foodList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* 선택된 음식 모달 */}
        {selectedFood && (
          <View style={styles.foodDetailOverlay}>
            <View style={styles.foodDetailModal}>
              <View style={styles.foodDetailHeader}>
                <Text style={styles.foodDetailTitle}>{selectedFood.name}</Text>
                <TouchableOpacity 
                  onPress={() => setSelectedFood(null)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.foodDetailImageContainer}>
                <OptimizedImage
                  source={{ uri: selectedFood.url }}
                  style={styles.foodDetailImage}
                  resizeMode="cover"
                  showLoadingIndicator={true}
                  placeholderColor="#f8f8f8"
                />
              </View>
              
              <View style={styles.foodDetailContent}>
                <Text style={styles.foodDetailDescription}>
                  맛있는 {selectedFood.name} 어떠세요? 🍽️
                </Text>
                <TouchableOpacity style={styles.selectButton}>
                  <Text style={styles.selectButtonText}>이 음식 선택하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8f4f8',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  foodList: {
    paddingBottom: 20,
  },
  foodItem: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  foodImageContainer: {
    width: '100%',
    height: 120,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    padding: 12,
    textAlign: 'center',
  },
  foodDetailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodDetailModal: {
    width: screenWidth * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  foodDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8f4f8',
  },
  foodDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
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
  foodDetailImageContainer: {
    width: '100%',
    height: 200,
  },
  foodDetailImage: {
    width: '100%',
    height: '100%',
  },
  foodDetailContent: {
    padding: 20,
  },
  foodDetailDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  selectButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
