import { dirname, resolve, parse } from 'path';
import { readdirSync, lstatSync } from 'fs';
export const mapPaths = (paths, mapper) => {
    const dest = {};
    Object.keys(paths).forEach((key) => {
        dest[key] = paths[key].map(mapper);
    });
    return dest;
};
export const loadConfig = (file) => {
    const { extends: ext, compilerOptions: { baseUrl, outDir, rootDir, paths } = {
        baseUrl: undefined,
        outDir: undefined,
        rootDir: undefined,
        paths: undefined,
    }, } = require(file);
    const configDir = dirname(file);
    const basePath = resolve(configDir, baseUrl);
    const files = readdirSync(basePath);
    const aliases = files.reduce((r, f) => {
        const _file = parse(f);
        const name = _file.name;
        const stats = lstatSync(resolve(basePath, f));
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
        const parentConfig = loadConfig(resolve(dirname(file), ext));
        return Object.assign(Object.assign({}, parentConfig), config);
    }
    return config;
};
//# sourceMappingURL=util.js.map