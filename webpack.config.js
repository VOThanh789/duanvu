const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const glob = require("glob");
const path = require("path");
module.exports = {
    entry: "./src/js/app.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].bundle.js",
    },
    target: "node",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            publicPath: "/fonts/",
                            name: "[name].[ext]",
                            outputPath: "./fonts/",
                        },
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            publicPath: "/images/",
                            outputPath: "./images/",
                        },
                    },
                ],
            },
            // {
            //     test: /\.(jpe?g|png|gif|svg|ico)$/i,
            //     use: [
            //         {
            //             loader: "url-loader",
            //             options: {
            //                 name: "[name].[ext]",
            //                 publicPath: "/images/",
            //                 outputPath: "./images/",
            //             },
            //         },
            //     ],
            // },
            {
                test: /\.(html)$/,
                use: ["html-loader"],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === "development",
                        },
                    },
                    // 'style-loader',
                    "css-loader",
                    "postcss-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html",
        }),
        new MiniCssExtractPlugin({
            filename: "/css/[name].bundle.css",
            chunkFilename: "/css/[id].css",
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, {
                nodir: true,
            }),
        }),
    ],
    watch: false,
    devServer: {
        // https: true,
        port: 3000,
        hot: false,
        compress: true,
        // lazy: true,
        contentBase: [
            path.join(__dirname, "dist"),
            path.join(__dirname, "images"),
            path.join(__dirname, ""),
        ],
        inline: true,
        disableHostCheck: true,
        watchContentBase: false,
        // historyApiFallback: true,
        // http2: true,
        liveReload: false,
        // https: {
        //     key: fs.readFileSync(path.resolve(__dirname, "ssl/localhost.key")),
        //     cert: fs.readFileSync(path.resolve(__dirname, "ssl/localhost.crt")),
        //     ca: fs.readFileSync(path.resolve(__dirname, "ssl/RootCA.pem")),
        // },
        index: "./dist/index.html",
        openPage: ["/index.html"],
        open: true,
        publicPath: "./dist/",
    },
};
