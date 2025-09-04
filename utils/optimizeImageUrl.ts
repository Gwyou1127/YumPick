// 이미지 URL을 최적화하는 유틸리티 함수들

/**
 * Pinterest 이미지 URL을 최적화된 크기로 변환 (안전한 방식)
 * @param originalUrl 원본 Pinterest URL
 * @param width 원하는 너비 (기본값: 400)
 * @param height 원하는 높이 (기본값: 600)
 * @returns 최적화된 URL
 */
export const optimizePinterestUrl = (
  originalUrl: string, 
  width: number = 400, 
  height: number = 600
): string => {
  try {
    if (!originalUrl.includes('pinimg.com')) {
      return originalUrl;
    }

    // Pinterest URL 패턴: https://i.pinimg.com/1200x/c1/14/28/c114287f20afab0949a1e0ed24e3de19.jpg
    // 최적화된 패턴: https://i.pinimg.com/400x600/c1/14/28/c114287f20afab0949a1e0ed24e3de19.jpg
    
    const urlParts = originalUrl.split('/');
    if (urlParts.length >= 4 && urlParts[3].includes('x')) {
      // 크기 부분을 새로운 크기로 교체
      urlParts[3] = `${width}x${height}`;
      return urlParts.join('/');
    }
    
    return originalUrl;
  } catch (error) {
    console.warn('Pinterest URL 최적화 실패:', error);
    return originalUrl;
  }
};

/**
 * 일반 이미지 URL에 최적화 파라미터 추가 (안전한 방식)
 * @param originalUrl 원본 URL
 * @param width 원하는 너비
 * @param height 원하는 높이
 * @param quality 품질 (1-100)
 * @returns 최적화된 URL
 */
export const optimizeImageUrl = (
  originalUrl: string,
  width: number = 400,
  height: number = 600,
  quality: number = 80
): string => {
  try {
    // Pinterest URL인 경우 특별 처리
    if (originalUrl.includes('pinimg.com')) {
      return optimizePinterestUrl(originalUrl, width, height);
    }

    // 다른 이미지 서비스들에 대한 최적화
    if (originalUrl.includes('unsplash.com')) {
      const url = new URL(originalUrl);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('h', height.toString());
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('q', quality.toString());
      return url.toString();
    }

    if (originalUrl.includes('images.unsplash.com')) {
      const url = new URL(originalUrl);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('h', height.toString());
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('q', quality.toString());
      return url.toString();
    }

    // 기본적으로 원본 URL 반환
    return originalUrl;
  } catch (error) {
    console.warn('이미지 URL 최적화 실패:', error);
    return originalUrl;
  }
};

/**
 * 모든 이미지 URL을 최적화
 * @param urls URL 배열
 * @param width 원하는 너비
 * @param height 원하는 높이
 * @returns 최적화된 URL 배열
 */
export const optimizeImageUrls = (
  urls: string[],
  width: number = 400,
  height: number = 600
): string[] => {
  return urls.map(url => optimizeImageUrl(url, width, height));
};
