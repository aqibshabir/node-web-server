import http from 'node:http';

const host = 'localhost';
const port = 8000;

const handleRequest = function (req, res) {
  // content-type set to html
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.end('<html><body><h1>This is HTML</h1></body></html>');
};

const server = http.createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`server is running on http://${host}:${port}`);
});
