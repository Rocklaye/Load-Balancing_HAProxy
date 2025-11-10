const http = require('http');
const PORT = 3001;

http.createServer((req, res) => {
  res.end('Reponse du serveur 1');
}).listen(PORT, () => {
  console.log(`Serveur 1 en écoute sur le port ${PORT}`);
});
