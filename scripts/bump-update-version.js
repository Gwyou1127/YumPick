#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(__dirname, '..', 'app.json');

// app.json 읽기
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// 현재 version 확인
const currentVersion = appJson.expo.version || '1.0.0.0';
const versionParts = currentVersion.split('.');

// 4자리가 아닌 경우 4자리로 만들기
while (versionParts.length < 4) {
  versionParts.push('0');
}

// 마지막 자리 (update 버전) 증가
versionParts[3] = (parseInt(versionParts[3]) || 0) + 1;
const newVersion = versionParts.join('.');

// version 업데이트 (runtimeVersion은 유지)
const oldVersion = appJson.expo.version;
appJson.expo.version = newVersion;

// app.json 저장
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

console.log(`✅ Update version bumped:`);
console.log(`   App version: ${oldVersion} -> ${newVersion}`);
console.log(`   Runtime version: ${appJson.expo.runtimeVersion} (unchanged)`);
