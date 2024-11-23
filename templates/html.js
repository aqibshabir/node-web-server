import http from 'node:http';

const host = 'localhost';
const port = 8000;

const handleRequest = function (req, res) {
  //
};

const server = http.createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`server is running on http://${host}:${port}`);
});
