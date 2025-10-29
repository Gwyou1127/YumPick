#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Publishing EAS Update...${NC}"
echo -e "${YELLOW}⚠️  Note: Runtime version will NOT be changed (OTA update only)${NC}"

# 1. Update 버전 증가
echo -e "${BLUE}📝 Bumping update version...${NC}"
node ./scripts/bump-update-version.js

if [ $? -ne 0 ]; then
  echo "❌ Failed to bump update version"
  exit 1
fi

# 2. 변경사항을 git에 커밋 (선택사항)
if git diff --quiet app.json; then
  echo "No changes to app.json"
else
  echo -e "${BLUE}💾 Committing version update...${NC}"
  git add app.json
  git commit -m "chore: bump update version for OTA"
fi

# 3. EAS Update 배포
echo -e "${GREEN}🚀 Publishing update...${NC}"
eas update --auto

echo -e "${GREEN}✅ Update published successfully!${NC}"
