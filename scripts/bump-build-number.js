#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 플래그 확인
const skipBump = process.argv.includes('--skip-bump') || process.argv.includes('--no-bump');

if (skipBump) {
  console.log('⏭️  Skipping version bump (--skip-bump flag detected)');
  process.exit(0);
}

const versionFilePath = path.join(__dirname, '..', 'constants', 'version.ts');

// version.ts 읽기
const versionFileContent = fs.readFileSync(versionFilePath, 'utf8');

// 현재 BUILD_NUMBER 추출
const buildNumberMatch = versionFileContent.match(/export const BUILD_NUMBER = (\d+);/);
const currentBuildNumber = buildNumberMatch ? parseInt(buildNumberMatch[1]) : 0;
const newBuildNumber = currentBuildNumber + 1;

// version.ts 업데이트
const newContent = versionFileContent.replace(
  /export const BUILD_NUMBER = \d+;/,
  `export const BUILD_NUMBER = ${newBuildNumber};`
);

fs.writeFileSync(versionFilePath, newContent);

console.log(`✅ Build number updated: ${currentBuildNumber} -> ${newBuildNumber}`);
