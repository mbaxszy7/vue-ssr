const Vue = require("vue");
const express = require("express");
const fs = require("fs");

const serverBundle = require("./dist/vue-ssr-server-bundle.json");
const template = fs.readFileSync("./index.template.html", "utf-8");
const clientManifest = require("./dist/vue-ssr-client-manifest.json");

const renderer = require("vue-server-renderer").createBundleRenderer(
  serverBundle,
  {
    template,
    clientManifest,
  }
);

const context = {
  title: "vue ssr",
  metas: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
};

server = express();

server.use("/dist", express.static("./dist"));
server.get("/", (req, res) => {
  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.log(err);
      return res.status(500).end("Internal Server Error.");
    }
    res.setHeader("Content-Type", "text/html; charset=utf8");
    res.end(html);
  });
});

server.listen(3000, () => {
  console.log("server running at port 3000.");
});
