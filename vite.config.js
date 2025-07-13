// vite.config.js
import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest.json';

export default defineConfig({
  // 1. 소스 코드의 루트 디렉토리를 'src'로 지정합니다.
  root: 'src',

  plugins: [
    crx({ manifest }),
  ],
  build: {
    // 2. 빌드 결과물 폴더를 프로젝트 루트의 'dist'로 지정합니다.
    //    (root가 'src'이므로, '../'를 통해 한 단계 위로 올라가야 합니다.)
    outDir: '../dist', 
    emptyOutDir: true,
  },
});