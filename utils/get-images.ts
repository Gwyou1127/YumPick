interface ImageData {
  id: string;
  name: string;
  url: string;
}

// data.json에서 데이터를 가져오는 함수
export const getImages = (): ImageData[] => {
  try {
    // React Native에서는 require를 사용하여 JSON 파일을 가져올 수 있습니다
    const data = require('../data.json');
    
    // 데이터 유효성 검사
    if (!Array.isArray(data)) {
      throw new Error('데이터가 배열이 아닙니다');
    }
    
    // 각 항목의 유효성 검사
    const validData = data.filter((item: any) => 
      item && 
      typeof item.id === 'string' && 
      typeof item.name === 'string' && 
      typeof item.url === 'string'
    );
    
    if (validData.length === 0) {
      throw new Error('유효한 데이터가 없습니다');
    }
    
    return validData;
  } catch (error) {
    console.error('data.json 파일을 읽을 수 없습니다:', error);
    // 에러 발생 시 기본 데이터 반환
    return [
      {
        id: '1',
        name: '맛있는 파스타',
        url: 'https://images.unsplash.com/photo-1504674900242-4197e29bdab7?w=400&h=600&fit=crop',
      },
      {
        id: '2',
        name: '신선한 샐러드',
        url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=600&fit=crop',
      },
      {
        id: '3',
        name: '구운 치킨',
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop',
      },
    ];
  }
};
