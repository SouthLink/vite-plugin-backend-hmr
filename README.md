# vite-plugin-backend-hmr
support front-end component hmr in the back-end page. (example PHP file)

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