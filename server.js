const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || "127.0.0.1";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": filePath.includes(`${path.sep}vendor${path.sep}`)
        ? "public, max-age=31536000"
        : "no-store",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  let safePath = path.normalize(decodeURIComponent(requestUrl.pathname)).replace(/^(\.\.[/\\])+/, "");
  if (safePath === "/" || safePath === "/dm" || safePath === "/display") {
    safePath = "/index.html";
  }

  const filePath = path.join(root, safePath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stat) => {
    if (!error && stat.isFile()) {
      sendFile(res, filePath);
      return;
    }
    sendFile(res, path.join(root, "index.html"));
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the other app or run with a different port, for example:`);
    console.error(`PORT=${port + 1} npm run dev`);
  } else {
    console.error("Unable to start Roundkeeper:", error.message);
  }
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Initiative tracker running at http://${host}:${port}/dm`);
  console.log(`Player display running at http://${host}:${port}/display`);
});
