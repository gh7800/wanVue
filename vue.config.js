const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const path = require('path');

module.exports = {
    publicPath: '/', // 默认'/'，部署应用包时的基本 URL
    // outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
    assetsDir: "static", // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: false,
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: !IS_PROD, // 生产环境的 source map
    parallel: require("os").cpus().length > 1,
    pwa: {},

    // SCSS 全局变量配置
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "./src/scss/variables.scss";`
            }
        }
    },

    // 路径别名
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        }
    },

    devServer: {
        overlay: { // 让浏览器 overlay 同时显示警告和错误
          warnings: true,
          errors: true
        },
        open: true, // 是否打开浏览器
        // host: "localhost",
        port: 8080, // 开发服务器端口，避免与后端8000端口冲突
        https: false,
        hotOnly: false, // 热更新
        proxy: {
            // 所有API请求代理
            "/": {
                target: "http://127.0.0.1:8000/",
                secure: false,
                changeOrigin: true,
                ws: true,
                pathRewrite: { '^/': '' }
            }
        }
    }
};
