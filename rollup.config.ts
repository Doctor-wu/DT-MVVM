import path from "path";
// import { RollupOptions } from "rollup";
import rollupTypescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import {eslint} from "rollup-plugin-eslint";
import {DEFAULT_EXTENSIONS} from "@babel/core";
import pkg from "./package.json";

const paths = {
    input: path.join(__dirname, "/src/index.ts"),
    output: path.join(__dirname, "/lib"),
};

// rollup 配置项
const rollupConfig = {
    input: 'src/index.ts',
    output: [
        // 输出 commonjs 规范的代码
        {
            file: path.join(paths.output, "index.js"),
            format: "cjs",
            name: pkg.name.replace(/^([a-zA-Z])/, c => c.toUpperCase()),
            sourcemap: true // es5 -> es6源码
        },
        // 输出 es 规范的代码
        {
            file: path.join(paths.output, "index.umd.js"),
            format: "umd",
            name: pkg.name.replace(/^([a-zA-Z])/, c => c.toUpperCase()),
            sourcemap: true // es5 -> es6源码
        },
    ],
    external: [], // 指出应将哪些模块视为外部模块，如 Peer dependencies 中的依赖
    // plugins 需要注意引用顺序
    plugins: [
        // 验证导入的文件
        eslint({
            throwOnError: true, // lint 结果有错误将会抛出异常
            throwOnWarning: true,
            include: ["src/**/*.ts"],
            exclude: ["node_modules/**", "lib/**", "*.js"],
        }),

        // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
        commonjs(),

        // 配合 commonjs 解析第三方模块
        resolve({
            // 将自定义选项传递给解析插件
            customResolveOptions: {
                moduleDirectory: "node_modules",
            },
        }),
        rollupTypescript(),
        babel({
            runtimeHelpers: true,
            // 只转换源代码，不运行外部依赖
            exclude: "node_modules/**",
            // babel 默认不支持 ts 需要手动添加
            extensions: [...DEFAULT_EXTENSIONS, ".ts"],
        }),
    ],
    watch: {
        include: 'src/**'
    }
};

export default rollupConfig;
