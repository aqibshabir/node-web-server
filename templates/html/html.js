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
// can add other paths like JS file, images, etc...

// caching results before starting server
let preLoadedHTML, preLoadedCSS;
const preLoadedContent = async () => {
  try {
    preLoadedHTML = {
      filePath: await fs.readFile(htmlPath),
      contentType: 'text/html',
    };
    preLoadedCSS = {
      filePath: await fs.readFile(cssPath),
      contentType: 'text/css',
    };
  } catch (error) {
    console.error(`Could not read file: ${error}`);
    process.exit(1);
  }
};

const handleRequest = (req, res) => {
  try {
    let file;

    if (req.url === '/') {
      // on initial load - needs html content - so do this...
      file = preLoadedHTML;
    } else if (req.url === '/styles.css') {
      // can see the link tag in html - browser automatically sends second request - so do this...
      file = preLoadedCSS;
    } else {
      // if can't find either - do this...
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Content not found');
      return;
    }

    const contents = file.filePath; // filePath changes dependent on html/css
    res.setHeader('Content-Type', file.contentType); // contentType changes dependent on html/css
    res.writeHead(200);
    res.end(contents);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
};

// loading content before starting server
preLoadedContent().then(() => {
  const server = http.createServer(handleRequest);

  server.listen(port, host, () => {
    console.log(`server is running on http://${host}:${port}`);
  });
});
