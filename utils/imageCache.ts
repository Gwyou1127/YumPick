import { Image } from 'react-native';

interface CacheItem {
  uri: string;
  loaded: boolean;
  timestamp: number;
}

class ImageCache {
  private cache: Map<string, CacheItem> = new Map();
  private preloadQueue: string[] = [];
  private readonly CACHE_SIZE = 50; // 최대 캐시 크기
  private readonly CACHE_EXPIRY = 30 * 60 * 1000; // 30분

  // 이미지 프리로드
  preloadImage(uri: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!uri || typeof uri !== 'string') {
        console.warn('잘못된 URI:', uri);
        resolve(false);
        return;
      }

      if (this.cache.has(uri)) {
        resolve(true);
        return;
      }

      Image.prefetch(uri)
        .then(() => {
          this.cache.set(uri, {
            uri,
            loaded: true,
            timestamp: Date.now()
          });
          this.cleanupCache();
          resolve(true);
        })
        .catch((error) => {
          console.warn('이미지 프리로드 실패:', uri, error);
          resolve(false);
        });
    });
  }

  // 여러 이미지 프리로드
  async preloadImages(uris: string[]): Promise<void> {
    if (!Array.isArray(uris) || uris.length === 0) {
      console.warn('잘못된 URI 배열:', uris);
      return;
    }

    const validUris = uris.filter(uri => uri && typeof uri === 'string');
    if (validUris.length === 0) {
      console.warn('유효한 URI가 없습니다:', uris);
      return;
    }

    const batchSize = 5; // 한 번에 5개씩 처리
    for (let i = 0; i < validUris.length; i += batchSize) {
      const batch = validUris.slice(i, i + batchSize);
      await Promise.all(batch.map(uri => this.preloadImage(uri)));
    }
  }

  // 캐시에서 이미지 확인
  isCached(uri: string): boolean {
    const item = this.cache.get(uri);
    if (!item) return false;
    
    // 만료된 캐시 제거
    if (Date.now() - item.timestamp > this.CACHE_EXPIRY) {
      this.cache.delete(uri);
      return false;
    }
    
    return item.loaded;
  }

  // 캐시 정리
  private cleanupCache(): void {
    if (this.cache.size <= this.CACHE_SIZE) return;

    // 오래된 항목부터 제거
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = entries.slice(0, entries.length - this.CACHE_SIZE);
    toRemove.forEach(([uri]) => this.cache.delete(uri));
  }

  // 캐시 크기 반환
  getCacheSize(): number {
    return this.cache.size;
  }

  // 캐시 초기화
  clearCache(): void {
    this.cache.clear();
  }
}

export const imageCache = new ImageCache();
