import React, { useState, useEffect } from 'react';
import { Image, View, ActivityIndicator, StyleSheet, ImageStyle, Text, Platform } from 'react-native';
import { imageCache } from '../utils/imageCache';
import { optimizeImageUrl } from '../utils/optimizeImageUrl';
import { getFallbackImage } from '../utils/fallbackImages';

interface OptimizedImageProps {
  source: { uri: string };
  style?: ImageStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  showLoadingIndicator?: boolean;
  placeholderColor?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  resizeMode = 'cover',
  showLoadingIndicator = true,
  placeholderColor = '#f0f0f0'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [currentUri, setCurrentUri] = useState(source.uri);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // 이미지 URL 최적화 (안전한 방식)
  const optimizedUri = currentUri;

  useEffect(() => {
    const checkCache = async () => {
      const cached = imageCache.isCached(optimizedUri);
      setIsCached(cached);
      
      if (cached) {
        setIsLoading(false);
        setImageLoaded(true);
      }
    };

    checkCache();
  }, [optimizedUri]);

  // URI가 변경될 때 상태 리셋
  useEffect(() => {
    setCurrentUri(source.uri);
    setIsLoading(true);
    setHasError(false);
    setImageLoaded(false);
  }, [source.uri]);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    setImageLoaded(true);
  };

  const handleError = (error: any) => {
    console.warn('이미지 로드 실패:', currentUri, error);
    
    // fallback 이미지가 아직 시도되지 않았다면 fallback으로 전환
    if (currentUri === source.uri) {
      const fallbackUri = getFallbackImage(source.uri);
      console.log('Fallback 이미지로 전환:', fallbackUri);
      setCurrentUri(fallbackUri);
      setIsLoading(true);
      setHasError(false);
      setImageLoaded(false);
    } else {
      // fallback도 실패한 경우
      setIsLoading(false);
      setHasError(true);
      setImageLoaded(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: optimizedUri }}
        style={[styles.image, style]}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        // iOS 특화 이미지 로딩 최적화 옵션들
        fadeDuration={Platform.OS === 'ios' ? 0 : 200}
        progressiveRenderingEnabled={Platform.OS === 'ios' ? false : true}
        removeClippedSubviews={Platform.OS === 'ios' ? false : true}
        // iOS에서 로딩 상태 개선
        onLoad={() => {
          setIsLoading(false);
          setImageLoaded(true);
        }}
      />
      
      {isLoading && showLoadingIndicator && !imageLoaded && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color="#666" 
            style={styles.loadingIndicator}
          />
        </View>
      )}
      
      {hasError && (
        <View style={[styles.errorContainer, { backgroundColor: placeholderColor }]}>
          <View style={styles.errorIcon}>
            <Text style={styles.errorText}>📷</Text>
          </View>
          <Text style={styles.errorMessage}>이미지를 불러올 수 없습니다</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
  },
  loadingIndicator: {
    opacity: 0.7,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 32,
    opacity: 0.6,
  },
  errorMessage: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    opacity: 0.8,
  },
});
