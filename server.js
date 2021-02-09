const Vue = require("vue");
const express = require("express");
const fs = require("fs");
const { createBundleRenderer } = require("vue-server-renderer");
const setupDevServer = require("./build/setup-dev-server");

server = express();
server.use("/dist", express.static("./dist"));

const isProd = process.env.NODE_ENV === "production";
let renderer;
let onReady;
if (isProd) {
  const serverBundle = require("./dist/vue-ssr-server-bundle.json");
  const template = fs.readFileSync("./index.template.html", "utf-8");
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");

  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  });
} else {
  // dev -> 打包构建 -》 重新生成renderer
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest,
    });
  });
}

const context = {
  title: "vue ssr",
  metas: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
};

const render = (req, res) => {
  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.log(err);
      return res.status(500).end("Internal Server Error.");
    }
    res.setHeader("Content-Type", "text/html; charset=utf8");
    res.end(html);
  });
};

server.get(
  "/",
  isProd
    ? render
    : async (req, res) => {
        // 等待有了renderer以后，调用render进行渲染
        await onReady;
        render(req, res);
      }
);

server.listen(3000, () => {
  console.log("server running at port 3000.");
});
