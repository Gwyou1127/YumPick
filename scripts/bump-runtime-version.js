#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(__dirname, '..', 'app.json');

// app.json 읽기
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// 현재 runtimeVersion 확인
let currentRuntimeVersion;
if (typeof appJson.expo.runtimeVersion === 'object') {
  // policy 방식인 경우 1.0.0으로 시작
  currentRuntimeVersion = '1.0.0';
} else {
  currentRuntimeVersion = appJson.expo.runtimeVersion || '1.0.0';
}

// runtimeVersion 증가 (patch 버전 증가)
const runtimeParts = currentRuntimeVersion.split('.').map(Number);
runtimeParts[2] = (runtimeParts[2] || 0) + 1;
const newRuntimeVersion = runtimeParts.join('.');

// version을 runtimeVersion에 맞춰 .0으로 초기화
const newAppVersion = `${newRuntimeVersion}.0`;

// 업데이트
appJson.expo.runtimeVersion = newRuntimeVersion;
appJson.expo.version = newAppVersion;

// app.json 저장
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

console.log(`✅ Build version updated:`);
console.log(`   Runtime version: ${currentRuntimeVersion} -> ${newRuntimeVersion}`);
console.log(`   App version: ${appJson.expo.version || 'N/A'} -> ${newAppVersion}`);
