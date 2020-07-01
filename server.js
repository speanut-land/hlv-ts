const http = require("http");
const express = require("express");
const app = express();

app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
app.get("/", (req, res) => res.send("1"));

app.listen(3001, () => {
  console.log("http server is success ");
});

// const http = require("http");

// const requestListener = function (req, res) {
//   res.writeHead(502);
//   res.end("Hello, World!");
// };

// const server = http.createServer(requestListener);
// server.listen(3001);
