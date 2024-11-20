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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => ViteBackendHmrPlugin
});
module.exports = __toCommonJS(src_exports);
var import_path = __toESM(require("path"), 1);
var import_node_os = __toESM(require("os"), 1);
var import_url = require("url");
var import_meta = {};
var isWindows = import_node_os.default.platform() === "win32";
function slash(p) {
  return p.replace(/\\/g, "/");
}
function normalizePath(id) {
  return import_path.default.posix.normalize(isWindows ? slash(id) : id);
}
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
function ViteBackendHmrPlugin(props) {
  const fetchUpdate = (file) => {
    const type = file.type === "js" ? "js-update" : "css-update";
    const parentPath = file.file ? import_path.default.relative(props?.hmrDir ?? __dirname, file.file) : "";
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
