"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
exports.mapPaths = (paths, mapper) => {
    const dest = {};
    Object.keys(paths).forEach((key) => {
        dest[key] = paths[key].map(mapper);
    });
    return dest;
};
exports.loadConfig = (file) => {
    const { extends: ext, compilerOptions: { baseUrl, outDir, rootDir, paths } = {
        baseUrl: undefined,
        outDir: undefined,
        rootDir: undefined,
        paths: undefined,
    }, } = require(file);
    const configDir = path_1.dirname(file);
    const basePath = path_1.resolve(configDir, baseUrl);
    const files = fs_1.readdirSync(basePath);
    const aliases = files.reduce((r, f) => {
        const _file = path_1.parse(f);
        const name = _file.name;
        const stats = fs_1.lstatSync(path_1.resolve(basePath, f));
        return Object.assign(Object.assign({}, r), { [`${name}${stats.isDirectory() ? '/*' : ''}`]: [`./${name}${stats.isDirectory() ? '/*' : ''}`] });
    }, {});
    const config = {};
    if (baseUrl) {
        config.baseUrl = baseUrl;
    }
    if (outDir) {
        config.outDir = outDir;
    }
    if (rootDir) {
        config.rootDir = rootDir;
    }
    config.paths = Object.assign(Object.assign({}, paths || {}), aliases);
    if (ext) {
        const parentConfig = exports.loadConfig(path_1.resolve(path_1.dirname(file), ext));
        return Object.assign(Object.assign({}, parentConfig), config);
    }
    return config;
};
//# sourceMappingURL=util.js.map