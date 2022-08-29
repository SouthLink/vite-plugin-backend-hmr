import path from 'path';
import os from 'node:os';
import type {
  PluginOption,
  HmrContext,
  ModuleNode,
  Update,
  ViteDevServer,
} from 'vite';

interface IPluginProps {
  /* File end suffix, watch backend file HMR (For example xxx.php file) */
  hmrFile?: string | string[];
  /* The root directory of the project components, used in the D:// workspace/my-project/src/component. The TSX replacement for /src/component.tsx */
  hmrDir?: string;
}

const isWindows = os.platform() === 'win32'

function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}

export default function ViteBackendHmrPlugin(
  props?: IPluginProps,
): PluginOption {
  /**
   * @description create vite hmr update object
   * @param {ModuleNode} file
   */
  const fetchUpdate = (file: ModuleNode): Update => {
    const type = file.type === 'js' ? 'js-update' : 'css-update';
    const parentPath = file.file ? path.relative(props?.hmrDir ?? __dirname, file.file) : '';
    const filePath = normalizePath(`/${normalizePath(parentPath)}`);

    return {
      type,
      path: filePath,
      acceptedPath: filePath,
      timestamp: Date.now(),
    };
  };

  /**
   * @description Iterate over the component's fabricium recursively to find the upper-level component and update
   * @param {ModuleNode[]} modules
   * @param {ViteDevServer} server
   * @param {string[]} deps
   */

  const recursiveUpdate = (
    modules: ModuleNode[],
    server: ViteDevServer,
    deps: Record<string, ModuleNode>,
  ): Record<string, ModuleNode> => {
    const myModules: ModuleNode[] = Array.from(modules);

    myModules.forEach((item) => {
      const moduleImporters = Array.from(item.importers);

      if (item.file) {
        deps[item.file] = item;
      }

      if (moduleImporters.length) {
        const filterImporters = moduleImporters.filter(
          (ii) => ii.file && ii.file.indexOf('node_modules/.vite') === -1,
        );

        filterImporters.forEach((ii) => {
          const imports = Array.from(ii.importers);

          if (ii.file && !deps?.[ii.file]) {
            deps[ii.file] = ii;

            if (imports.length) {
              return recursiveUpdate(imports, server, deps);
            }
          }
        });
      }
    });

    return deps;
  };

  return {
    name: 'vite-plugin-backend-hmr',
    enforce: 'pre',
    apply: 'serve',

    handleHotUpdate(hmrContext: HmrContext) {
      const { file, server, modules } = hmrContext;

      // front-end component hmr in the back-end page
      const deps = recursiveUpdate(modules, server, {});
      const updates = Object.values(deps).map((item) => fetchUpdate(item));

      server.ws.send({
        type: 'update',
        updates: updates,
      });

      // backend file hmr
      if (props?.hmrFile) {
        const { hmrFile } = props;
        const hmrWatchFile = !hmrFile
          ? []
          : typeof hmrFile === 'string'
          ? [hmrFile]
          : [...hmrFile];

        if (hmrWatchFile.length && hmrWatchFile.some((i) => file.endsWith(i))) {
          server.ws.send({
            type: 'full-reload',
            path: '*',
          });
        }
      }
    },
  };
}