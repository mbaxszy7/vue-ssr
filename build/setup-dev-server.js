const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const webpack = require("webpack");
const webpackMiddleware = require("webpack-dev-middleware");
const resolve = (file) => path.resolve(__dirname, file);

module.exports = (server, callback) => {
  let ready;
  const onReady = new Promise((r) => (ready = r));
  // 构建
  let serverBundle, template, clientManifest;
  const update = () => {
    if (serverBundle && template && clientManifest) {
      callback(serverBundle, template, clientManifest);
      ready();
    }
  };

  // 监视构建template -> 调用update
  const templatePath = resolve("../index.template.html");
  template = fs.readFileSync(templatePath, "utf-8");
  update();
  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8");
    update();
  });

  // 监视构建serverBundle -> 调用update
  const serverConfig = require("./webpack.server.config.js");
  const serverCompiler = webpack(serverConfig);
  webpackMiddleware(serverCompiler, {
    publicPath: serverConfig.output.publicPathoutput,
  });
  // serverCompiler.watch({}, (err, stats) => {
  //   if (err) throw err;
  //   if (stats.hasErrors()) return;
  //   serverBundle = JSON.parse(
  //     fs.readFileSync(resolve("../dist/vue-ssr-server-bundle.json"), "utf-8")
  //   );
  //   update();
  // });

  // 监视构建clientManifest -> 调用update

  return onReady;
};
