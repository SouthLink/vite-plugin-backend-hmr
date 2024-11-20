// src/index.ts
import path from "path";
import os from "node:os";
var isWindows = os.platform() === "win32";
function slash(p) {
  return p.replace(/\\/g, "/");
}
function normalizePath(id) {
  return path.posix.normalize(isWindows ? slash(id) : id);
}
var defaultHmrDir = process.cwd();
function ViteBackendHmrPlugin(props) {
  const fetchUpdate = (file) => {
    const type = file.type === "js" ? "js-update" : "css-update";
    const parentPath = file.file ? path.relative(props?.hmrDir ?? defaultHmrDir, file.file) : "";
    const filePath = normalizePath(`/${normalizePath(parentPath)}`);
    return {
      type,
      path: filePath,
      acceptedPath: filePath,
      timestamp: Date.now()
    };
  };
  const recursiveUpdate = (modules, server, deps) => {
    const myModules = Array.from(modules);
    myModules.forEach((item) => {
      const moduleImporters = Array.from(item.importers);
      if (item.file) {
        deps[item.file] = item;
      }
      if (moduleImporters.length) {
        const filterImporters = moduleImporters.filter(
          (ii) => ii.file && ii.file.indexOf("node_modules/.vite") === -1
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
    name: "vite-plugin-backend-hmr",
    enforce: "pre",
    apply: "serve",
    handleHotUpdate(hmrContext) {
      const { file, server, modules } = hmrContext;
      const deps = recursiveUpdate(modules, server, {});
      const updates = Object.values(deps).map((item) => fetchUpdate(item));
      server.ws.send({
        type: "update",
        updates
      });
      if (props?.hmrFile) {
        const { hmrFile } = props;
        const hmrWatchFile = !hmrFile ? [] : typeof hmrFile === "string" ? [hmrFile] : [...hmrFile];
        if (hmrWatchFile.length && hmrWatchFile.some((i) => file.endsWith(i))) {
          server.ws.send({
            type: "full-reload",
            path: "*"
          });
        }
      }
    }
  };
}
export {
  ViteBackendHmrPlugin as default
};
