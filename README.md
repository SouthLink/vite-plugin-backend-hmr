# vite-plugin-backend-hmr
Plugins that support normal hot updates in back-end projects

## feature

#### 1. Enhance hmr 
You can add any suffix of the file name, and support to monitor the hot update of the file, such as :
```ts
// vite.config.ts
import ViteBackendHmrPlugin from 'vite-plugin-backend-hmr';

export default {
  plugins: [
    ViteBackendHmrPlugin({
      hmrFile: ['.php']
    })
  ]
}
```
the plug-in will monitor the change of the file, and trigger the update on the page through vite

#### 2. Fixed some problems in backend integration mode
In vite backend integration mode, HMR of sub-components may fail in some cases. This plug-in solves this problem and supports update watch of back-end files

[![NPM version](https://img.shields.io/npm/v/vite-plugin-backend-hmr.svg)](https://www.npmjs.com/package/vite-plugin-backend-hmr)
[![NPM Downloads](https://badgen.net/npm/dt/vite-plugin-backend-hmr)](https://www.npmjs.com/package/vite-plugin-backend-hmr)

## 📦 Install
```
npm i vite-plugin-backend-hmr -D 

# yarn 
yarn add vite-plugin-backend-hmr -D

# pnpm 
pnpm i vite-plugin-backend-hmr -D
```

## Usage
```ts
// vite.config.ts
import ViteBackendHmrPlugin from 'vite-plugin-backend-hmr';

export default {
  plugins: [
    ViteBackendHmrPlugin()
  ]
}
```

## Options
- `hmrFile` dispensable, file end suffix, monitor back-end file changes to refresh the page (for example, xxX. PHP file)
- `hmrDir` dispensable but it's important, The root directory of the project components, used in the D://workspace/my-project/src/component. The TSX replacement for /src/component.tsx, used for vite update key.

## Configure options example
```ts
// vite.config.ts
import ViteBackendHmrPlugin from 'vite-plugin-backend-hmr';

export default {
  plugins: [
    ViteBackendHmrPlugin({
      hmrFile: ['.tpl.php', '.blade.php']
      hmrDir: __dirname
    })
  ]
}
```

## License

[MIT](./LICENSE)