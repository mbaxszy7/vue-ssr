const fs = require("fs")
const path = require("path")
const chokidar = require("chokidar")
const webpack = require("webpack")
const webpackMiddleware = require("webpack-dev-middleware")
const hotModuleReplace = require("webpack-hot-middleware")

const webpackServerConfig = require("./webpack.server.config.js")
const webpackClientConfig = require("./webpack.client.config.js")

const resolve = (file) => path.resolve(__dirname, file)

module.exports = (server, callback) => {
  let ready
  const onReady = new Promise((r) => {
    ready = r
  })
  // 构建
  let serverBundle
  let template
  let clientManifest
  const update = () => {
    if (serverBundle && template && clientManifest) {
      callback(serverBundle, template, clientManifest)
      ready()
    }
  }

  // 监视构建template -> 调用update
  const templatePath = resolve("../index.template.html")
  template = fs.readFileSync(templatePath, "utf-8")
  update()
  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8")
    update()
  })

  // 监视构建serverBundle -> 调用update
  const serverCompiler = webpack(webpackServerConfig)
  const serverDevMiddle = webpackMiddleware(serverCompiler, {
    logLevel: "silent",
  })
  serverCompiler.hooks.done.tap("server", () => {
    serverBundle = JSON.parse(
      serverDevMiddle.fileSystem.readFileSync(
        resolve("../dist/vue-ssr-server-bundle.json"),
        "utf-8",
      ),
    )
    update()
  })

  // 监视构建clientManifest -> 调用update
  webpackClientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  webpackClientConfig.entry.app = [
    `webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&quiet=true&reload=true`,
    webpackClientConfig.entry.app,
  ]
  webpackClientConfig.output.filename = "[name].js"
  const clientCompiler = webpack(webpackClientConfig)
  const clientDevMiddle = webpackMiddleware(clientCompiler, {
    publicPath: webpackClientConfig.output.publicPath,
    logLevel: "silent",
  })
  clientCompiler.hooks.done.tap("server", () => {
    clientManifest = JSON.parse(
      clientDevMiddle.fileSystem.readFileSync(
        resolve("../dist/vue-ssr-client-manifest.json"),
        "utf-8",
      ),
    )
    update()
  })

  server.use(
    hotModuleReplace(clientCompiler, {
      log: false,
    }),
  )
  // 将clientDevMiddle挂载到express服务中，提供对其内部内存中数据的访问
  server.use(clientDevMiddle)

  return onReady
}
