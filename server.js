import http from 'node:http';

const host = 'localhost';
const port = 8000;

const animes = [
  { id: 1, title: 'One Piece', author: 'Eiichiro Oda', release: 1997 },
  { id: 2, title: 'Naruto', author: 'Masashi Kishimoto', release: 1999 },
];

const handleRESTAPI = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let body = '';
  const urlPath = req.url.split('/');
  const isAnimeRoute = urlPath[1] === 'animes';
  const id = Number(urlPath[2]);

  if (isAnimeRoute) {
    switch (req.method) {
      // GET REQUEST:
      case 'GET':
        try {
          // GET ONE:
          if (id) {
            const findAnime = animes.find((el) => el.id === id);
            if (!findAnime) {
              res.writeHead(404);
              res.end(
                JSON.stringify({
                  request: req.method,
                  code: 404,
                  message: `Could not find anime at path: http://localhost:8000${req.url}`,
                })
              );
              return;
            }
            res.writeHead(200);
            res.end(JSON.stringify(findAnime));
          } else {
            // GET ALL:
            if (animes.length === 0) {
              res.writeHead(404);
              res.end(
                JSON.stringify({
                  request: req.method,
                  code: 404,
                  message: 'No animes to show: Please POST a new anime',
                })
              );
            } else {
              res.writeHead(200);
              res.end(JSON.stringify(animes));
            }
          }
        } catch (error) {
          res.writeHead(500);
          res.end(
            JSON.stringify({
              request: req.method,
              code: 500,
              message: `Internal server error: ${error.message}`,
            })
          );
        }
        break;

      // POST REQUEST:
      case 'POST':
        // parse body > validate body > push body onto animes array
        req.on('data', (d) => {
          body += d;
        });
        req.on('end', () => {
          try {
            const newAnimeObj = JSON.parse(body);
            const isValidated =
              newAnimeObj.id && newAnimeObj.title && newAnimeObj.author && newAnimeObj.release;
            if (!isValidated) {
              res.writeHead(400);
              res.end(
                JSON.stringify({
                  request: req.method,
                  code: 400,
                  message: `Missing at least ONE of the following field: id/title/author/release`,
                })
              );
              return;
            } else {
              animes.push(newAnimeObj);
              res.writeHead(201);
              res.end(JSON.stringify(animes));
            }
          } catch (error) {
            res.writeHead(500);
            res.end(
              JSON.stringify({
                request: req.method,
                code: 500,
                message: `Internal server error: ${error.message}`,
              })
            );
          }
        });
        break;

      // PUT REQUEST:
      case 'PUT':
        // parse body > validate > change value of indexed item in array
        req.on('data', (d) => {
          body += d;
        });
        req.on('end', () => {
          try {
            if (!id) {
              res.writeHead(400);
              res.end(
                JSON.stringify({
                  request: req.method,
                  code: 400,
                  message: `No ID given for the anime you wish to change`,
                })
              );
              return;
            }
            const updatedAnime = JSON.parse(body);
            if (updatedAnime.id !== id) {
              res.writeHead(400);
              res.end(
                JSON.stringify({
                  request: req.method,
                  code: 400,
                  message: `Do not change ID value - tried to change value to: ${updatedAnime.id}`,
                })
              );
              return;
            }
            const isValidated =
              updatedAnime.id && updatedAnime.title && updatedAnime.author && updatedAnime.release;
            if (!isValidated) {
              res.writeHead(400);
              res.end(
                JSON.stringify({
                  request: req.method,
                  code: 400,
                  message: `Missing at least ONE of the following field: id/title/author/release`,
                })
              );
              return;
            }
            const animeIndex = animes.findIndex((el) => el.id === id);
            if (animeIndex !== -1) {
              animes[animeIndex] = { ...updatedAnime };
              res.writeHead(200);
              res.end(JSON.stringify(animes));
            } else {
              res.writeHead(404);
              res.end(
                JSON.stringify({
                  request: req.method,
                  code: 404,
                  message: 'Error: Anime does not exist',
                })
              );
            }
          } catch (error) {
            res.writeHead(500);
            res.end(
              JSON.stringify({
                request: req.method,
                code: 500,
                message: `Internal server error: ${error.message}`,
              })
            );
          }
        });
        break;
      // DELETE REQUEST:
      case 'DELETE':
        try {
          if (!id) {
            res.writeHead(400);
            res.end(
              JSON.stringify({
                request: req.method,
                code: 400,
                message: `No ID given for the anime you wish to delete`,
              })
            );
            return;
          }

          const animeIndex = animes.findIndex((el) => el.id === id);
          if (animeIndex !== -1) {
            animes.splice(animeIndex, 1);
            res.writeHead(200);
            res.end(JSON.stringify(animes));
          } else {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                request: req.method,
                code: 404,
                message: 'Error: Anime does not exist',
              })
            );
          }
        } catch (error) {
          res.writeHead(500);
          res.end(
            JSON.stringify({
              request: req.method,
              code: 500,
              message: `Internal server error: ${error.message}`,
            })
          );
        }
      default:
        res.writeHead(405);
        res.end(
          JSON.stringify({
            request: req.method,
            code: 405,
            error: 'Method not allowed',
          })
        );
        break;
    }
  } else {
    res.writeHead(404);
    res.end(
      JSON.stringify({
        code: 404,
        message: `incorrect path: http://localhost:8000${req.url}`,
        'path-needed': 'http://localhost:8000/animes',
      })
    );
  }
};

const server = http.createServer(handleRESTAPI);

server.listen(port, host, () => {
  console.log(`server is running on http://${host}:${port}`);
});
