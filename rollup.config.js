import vue from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import terser from "@rollup/plugin-terser"

import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json' with { type: 'json' }; // 确保你的package.json中有name和version字段
 
export default {
  input: './src/plugins/MyPlugin.ts', // 你的插件入口文件位置
  output: [ // 可以输出多种格式，例如UMD, ESM等
    { file: 'dist/vue-sound-wave.js', format: 'es' }, // ES模块格式，输出到dist目录
    { file: 'dist/vue-sound-wave.umd.js', format: 'umd', name: 'VueSoundWave' } // UMD格式，适合浏览器直接使用
  ],
  plugins: [
    vue(), 
    resolve(), 
    commonjs(), 
    terser(), 
    typescript({
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src'
    })
  ] // 使用vue, resolve, commonjs和terser插件来处理你的代码和依赖
};