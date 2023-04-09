const webpack = require('webpack');
module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        // "net": false,
        // "tls": false,
        // "fs": false,
        // "bufferutil": false,
        // "utf-8-validate": false,
        // "crypto": false,
        // // "crypto": require.resolve("crypto-browserify"),
        // "stream": require.resolve("stream-browserify"),
        // "zlib": require.resolve("browserify-zlib"),
        // "http": require.resolve("stream-http"),
        // "https": require.resolve("https-browserify"),
        // "os": require.resolve("os-browserify"),
        // "path": require.resolve("path-browserify"),
        // "assert": require.resolve("assert/"),
        // "url": require.resolve("url/"),
        // "constants": require.resolve("constants-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "assert": require.resolve("assert/"),
            "stream": require.resolve("stream-browserify"),
            "process": require.resolve("process/browser"),
            "util": require.resolve("util"),
            "events": require.resolve("events/"),
            "buffer": require.resolve('buffer/'),
            "zlib": require.resolve("browserify-zlib"),
            "os": require.resolve("os-browserify/browser"),
            "path": require.resolve("path-browserify")
    })
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ]);
    config.resolve.alias = {
        process: "process/browser",
        crypto: "crypto-browserify",
        stream: "stream-browserify",
    };
    return config;
}