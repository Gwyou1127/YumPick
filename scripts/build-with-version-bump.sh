#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting EAS build process...${NC}"

# 플래그 확인
SKIP_BUMP=false
for arg in "$@"; do
  if [ "$arg" == "--skip-bump" ] || [ "$arg" == "--no-bump" ]; then
    SKIP_BUMP=true
    break
  fi
done

# 1. BUILD_NUMBER 업데이트
if [ "$SKIP_BUMP" == "false" ]; then
  echo -e "${BLUE}📝 Updating build number...${NC}"
  node ./scripts/bump-runtime-version.js

  if [ $? -ne 0 ]; then
    echo "❌ Failed to update build number"
    exit 1
  fi

  # 2. 변경사항을 git에 커밋
  if git diff --quiet constants/version.ts; then
    echo "No changes to constants/version.ts"
  else
    echo -e "${BLUE}💾 Committing build number update...${NC}"
    git add constants/version.ts
    git commit -m "chore: bump build number for build"
  fi
else
  echo -e "${BLUE}⏭️  Skipping build number bump${NC}"
fi

# 3. EAS 빌드 실행
echo -e "${GREEN}🔨 Starting EAS build...${NC}"
eas build --platform all --profile production --non-interactive

echo -e "${GREEN}✅ Build process completed!${NC}"
