/// <reference types="react" />
/// <reference types="next" />

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

interface Window {
  // 添加任何全局window属性
} 