// 이미지 로드 실패 시 사용할 fallback 이미지들
export const fallbackImages = [
  'https://images.unsplash.com/photo-1504674900242-4197e29bdab7?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=600&fit=crop&q=80',
];

/**
 * 실패한 이미지 URL에 대한 fallback 이미지 반환
 * @param originalUrl 원본 URL
 * @returns fallback 이미지 URL
 */
export const getFallbackImage = (originalUrl: string): string => {
  // URL의 해시값을 기반으로 일관된 fallback 이미지 선택
  let hash = 0;
  for (let i = 0; i < originalUrl.length; i++) {
    const char = originalUrl.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  
  const index = Math.abs(hash) % fallbackImages.length;
  return fallbackImages[index];
};
