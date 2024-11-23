import http from 'node:http';

const host = 'localhost';
const port = 8000;

const handleRequest = function (req, res) {
  res.writeHead(200);
  res.end('My first server');
};

const server = http.createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`server is running on http://${host}:${port}`);
});
