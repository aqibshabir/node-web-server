import http from 'node:http';

const host = 'localhost';
const port = 8000;

const animes = JSON.stringify([
  { title: 'One Piece', author: 'Eiichiro Oda', release: 1997 },
  { title: 'Naruto', author: 'Masashi Kishimoto', release: 1999 },
]);

const characters = JSON.stringify([
  { name: 'Monkey D. Luffy', anime: 'One Piece', age: 19 },
  { name: 'Naruto Uzamaki', anime: 'Naruro', age: 17 },
]);

const handleRequest = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  switch (req.url) {
    case '/animes':
      res.writeHead(200);
      res.end(animes);
      break;
    case '/characters':
      res.writeHead(200);
      res.end(characters);
      break;
    default:
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Resource not found' }));
  }
};

const server = http.createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`server is running on http://${host}:${port}`);
});
