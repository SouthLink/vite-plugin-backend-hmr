# vite-plugin-backend-hmr
Plugins that support normal hot updates in back-end projects

In vite backend integration mode, HMR of sub-components may fail in some cases. This plug-in solves this problem and supports update watch of back-end files

[![NPM version](https://badgen.net/npm/v/vite-plugin-backend-hmr)](https://www.npmjs.com/package/vite-plugin-backend-hmr)
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