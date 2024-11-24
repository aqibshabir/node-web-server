import http from 'node:http';

const host = 'localhost';
const port = 8000;

const animes = [
  { id: 1, title: 'One Piece', author: 'Eiichiro Oda', release: 1997 },
  { id: 2, title: 'Naruto', author: 'Masashi Kishimoto', release: 1999 },
];

const handleRequest = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const urlPath = req.url.split('/');
  const animeRoute = urlPath[1] === 'animes';
  const id = Number(urlPath[2]);
  let body = '';

  if (animeRoute) {
    switch (req.method) {
      case 'GET':
        try {
          if (id) {
            const getOneAnime = animes.find((el) => el.id === id);
            if (!getOneAnime) {
              res.writeHead(404);
              res.end(JSON.stringify({ error: 'Could not find that anime' }));
              return;
            }
            res.writeHead(200);
            res.end(JSON.stringify(getOneAnime));
          } else {
            res.writeHead(200);
            res.end(JSON.stringify(animes));
          }
        } catch (error) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
        break;
      case 'POST':
        req.on('data', (d) => {
          body += d;
        });
        req.on('end', () => {
          try {
            const newAnime = JSON.parse(body);
            animes.push(newAnime);
            res.writeHead(201);
            res.end(JSON.stringify(animes));
          } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Something went wrong' }));
          }
        });
        break;
      case 'PUT':
        req.on('data', (d) => {
          body += d;
        });
        req.on('end', () => {
          try {
            if (!id) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: 'ID is required for this operation' }));
              return;
            }
            if (id) {
              const updatedAnime = JSON.parse(body);
              const animeIndex = animes.findIndex((el) => el.id === id);
              if (animeIndex !== -1) {
                animes[animeIndex] = { ...animes[animeIndex], ...updatedAnime };
                res.writeHead(200);
                res.end(JSON.stringify(animes));
              } else {
                res.writeHead(404);
                res.end(
                  JSON.stringify({ error: 'Could not update that anime - it may not exist' })
                );
              }
            }
          } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Something went wrong' }));
          }
        });
        break;
      case 'DELETE':
        try {
          if (!id) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'ID is required for this operation' }));
            return;
          }
          if (id) {
            const animeIndex = animes.findIndex((el) => el.id === id);
            if (animeIndex !== -1) {
              animes.splice(animeIndex, 1);
              res.writeHead(200);
              res.end(JSON.stringify(animes));
            } else {
              res.writeHead(404);
              res.end(JSON.stringify({ error: 'Could not delete that anime - it may not exist!' }));
            }
          }
        } catch (error) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
      default:
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        break;
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Resource not found' }));
  }
};

const server = http.createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`server is running on http://${host}:${port}`);
});
