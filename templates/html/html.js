import http from 'node:http';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url'; // need for es6
import { dirname, join } from 'node:path'; // need for es6

const host = 'localhost';
const port = 8000;

// __dirname isn't avaliable in es6 (like in commonJS) - so need to manually define it:
const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, 'index.html'); // path for html
const cssPath = join(__dirname, 'styles.css'); // path for css
// can add other paths like JS file, Images, etc...

const handleRequest = async (req, res) => {
  let filePath, contentType;
  if (req.url === '/') {
    // on initial load - needs html content - so do this...
    filePath = htmlPath;
    contentType = 'text/html';
  } else if (req.url === '/styles.css') {
    // can see the link tag in html - browser automatically sends second request - so do this...
    filePath = cssPath;
    contentType = 'text/css';
  } else {
    // if can't find either - do this...
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Content not found');
    return;
  }
  try {
    const contents = await fs.readFile(filePath); // filePath changes dependent on html/css
    res.setHeader('Content-Type', contentType); // contentType changes dependent on html/css
    res.writeHead(200);
    res.end(contents);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`${error}`);
  }
};

const server = http.createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`server is running on http://${host}:${port}`);
});
