"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => ViteReactBackendHmrPlugin
});
module.exports = __toCommonJS(src_exports);
var import_path = __toESM(require("path"));
var import_node_os = __toESM(require("os"));
var isWindows = import_node_os.default.platform() === "win32";
function slash(p) {
  return p.replace(/\\/g, "/");
}
function normalizePath(id) {
  return import_path.default.posix.normalize(isWindows ? slash(id) : id);
}
function ViteReactBackendHmrPlugin(props) {
  const fetchUpdate = (file) => {
    const type = file.type === "js" ? "js-update" : "css-update";
    const parentPath = file.file ? import_path.default.relative((props == null ? void 0 : props.hmrDir) ?? __dirname, file.file) : "";
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
          if (imports.length && ii.file && !(deps == null ? void 0 : deps[ii.file])) {
            deps[ii.file] = ii;
            return recursiveUpdate(imports, server, deps);
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
      if (props == null ? void 0 : props.hmrFile) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
