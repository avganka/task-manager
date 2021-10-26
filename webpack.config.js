const path = require(`path`);

module.exports = {
    mode: `development`,
    entry: `./src/main.js`,
    devtool: `source-map`,
    devServer: {
        static: {
            directory: path.join(__dirname, `public`),
            watch: true,
        },
    },
    output: {
        filename: `main-bundle.js`,
        path: path.join(__dirname, `public`)
    },
    module: {
        rules:[
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    },
};