#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting EAS build process...${NC}"

# 1. runtimeVersion 업데이트
echo -e "${BLUE}📝 Updating runtime version...${NC}"
node ./scripts/bump-runtime-version.js

if [ $? -ne 0 ]; then
  echo "❌ Failed to update runtime version"
  exit 1
fi

# 2. 변경사항을 git에 커밋 (선택사항)
if git diff --quiet app.json; then
  echo "No changes to app.json"
else
  echo -e "${BLUE}💾 Committing runtime version update...${NC}"
  git add app.json
  git commit -m "chore: bump runtime version for build"
fi

# 3. EAS 빌드 실행
echo -e "${GREEN}🔨 Starting EAS build...${NC}"
eas build --platform all --profile production --non-interactive

echo -e "${GREEN}✅ Build process completed!${NC}"
