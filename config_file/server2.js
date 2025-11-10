const http = require('http');
const PORT = 3002;

http.createServer((req, res) => {
  res.end('Reponse du serveur 2');
}).listen(PORT, () => {
  console.log(`Serveur 2 en écoute sur le port ${PORT}`);
});
