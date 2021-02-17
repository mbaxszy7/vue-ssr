/* eslint-disable global-require */
const express = require("express")
const fs = require("fs")
const { createBundleRenderer } = require("vue-server-renderer")
const setupDevServer = require("./build/setup-dev-server")

const server = express()
server.use("/dist", express.static("./dist"))

const isProd = process.env.NODE_ENV === "production"
let renderer
let onReady
if (isProd) {
  // eslint-disable-next-line global-require
  // eslint-disable-next-line import/no-unresolved
  const serverBundle = require("./dist/vue-ssr-server-bundle.json")
  const template = fs.readFileSync("./index.template.html", "utf-8")
  // eslint-disable-next-line global-require
  // eslint-disable-next-line import/no-unresolved
  const clientManifest = require("./dist/vue-ssr-client-manifest.json")

  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  })
} else {
  // dev -> 打包构建 -》 重新生成renderer
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest,
    })
  })
}

const render = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      url: req.url,
    })
    res.setHeader("Content-Type", "text/html; charset=utf8")
    return res.end(html)
  } catch (err) {
    console.log(err)
    return res.status(500).end("Internal Server Error.")
  }
}

server.get(
  "*",
  isProd
    ? render
    : async (req, res) => {
        // 等待有了renderer以后，调用render进行渲染
        await onReady
        render(req, res)
      },
)

server.listen(3000, () => {
  console.log("server running at port 3000.")
})
