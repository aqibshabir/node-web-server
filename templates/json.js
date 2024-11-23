import http from 'node:http';

const host = 'localhost';
const port = 8000;

const handleRequest = function (req, res) {
  // setHeader() takes 2 args - headers name and its value:
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(`"message":"This is a JSON response"`);
};

const server = http.createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`server is running on http://${host}:${port}`);
});
