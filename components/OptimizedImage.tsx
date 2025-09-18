import React, { useState, useEffect } from 'react';
import { Image, View, ActivityIndicator, StyleSheet, ImageStyle, Text, Platform } from 'react-native';
import { imageCache } from '../utils/imageCache';

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
  
  // iOS에서 네트워크 상태 확인을 위한 추가 로직
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

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
    setRetryCount(0); // 새로운 이미지일 때 재시도 카운트 리셋
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
    // console.warn('이미지 로드 실패:', currentUri, error);
    
    // iOS에서 특정 에러 타입 확인
    const errorMessage = error?.nativeEvent?.error || error?.error || 'Unknown error';
    // console.log('에러 세부사항:', errorMessage);
    
    // 재시도 로직 (네트워크 문제일 수 있음)
    if (retryCount < maxRetries && (currentUri === source.uri || currentUri.includes('?retry='))) {
      // console.log(`이미지 로드 재시도 (${retryCount + 1}/${maxRetries}):`, currentUri);
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
      // 잠시 후 재시도
      setTimeout(() => {
        setCurrentUri(source.uri + `?retry=${retryCount + 1}`);
      }, 1000);
      return;
    }
    
    // 재시도 후에도 실패한 경우 에러 표시
    // console.log('이미지 로드 최종 실패:', currentUri);
    setIsLoading(false);
    setHasError(true);
    setImageLoaded(false);
    setRetryCount(0);
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
        // iOS에서 로딩 상태 개선
        onLoad={() => {
          setIsLoading(false);
          setImageLoaded(true);
          // 캐시에 성공적으로 로드된 이미지 저장
          imageCache.preloadImage(optimizedUri);
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
            <Text style={styles.errorText}>⚠️</Text>
          </View>
          <Text style={styles.errorTitle}>이미지 로드 실패</Text>
          <Text style={styles.errorMessage}>네트워크 연결을 확인하거나{'\n'}잠시 후 다시 시도해주세요</Text>
          <View style={styles.errorDetails}>
            <Text style={styles.errorUrl}>URL: {source.uri.length > 50 ? source.uri.substring(0, 50) + '...' : source.uri}</Text>
          </View>
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
    borderWidth: 2,
    borderColor: '#ff6b6b',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  errorIcon: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 36,
    opacity: 0.8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
  },
  errorDetails: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 8,
    borderRadius: 4,
    maxWidth: '100%',
  },
  errorUrl: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
