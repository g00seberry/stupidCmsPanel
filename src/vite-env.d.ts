/// <reference types="vite/client" />

declare module '*.css';
declare module '*.less';
declare module '*.module.less' {
  const classes: Record<string, string>;
  export default classes;
}
