const http = require("http");
const url = require("url");
const httpProxy = require("http-proxy");
const port = process.env.PORT || 3000;

const proxy = httpProxy.createProxyServer({
  ws: true,
  secure: true,
  xfwd: true,
  toProxy: true,
  followRedirects: true,
  changeOrigin: true
});

http
  .createServer(function(req, res) {
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === "/favicon.ico") {
      res.writeHead(404);
      res.end();
      return;
    }

    const target = query.url;

    if (!target) {
      res.writeHead(400);
      res.end("url query require");
      return;
    }

    proxy.web(req, res, { target });
  })
  .listen(port, () => {
    console.log("listen on port " + port);
  });
