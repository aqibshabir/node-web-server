import http from 'node:http';

const host = 'localhost';
const port = 8000;

const handleRequest = function (req, res) {
  // sets content-type to be csv:
  res.setHeader('Content-Type', 'text/csv');
  // csv file is an attachment and has a file name of 'data.csv'
  res.setHeader('Content-Disposition', 'attachment;filename=data.csv');
  res.writeHead(200);
  res.end(`id,name,age\n1,Aqib,31`);
};

const server = http.createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`server is running on http://${host}:${port}`);
});
