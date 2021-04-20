const http = require('http');
const app = require('./app');

const normalizePort = val => {// analyser le port
  let port = parseInt(val, 10);

  if (!isNaN(port) && port >= 0) { // si le port est un number(!:not + NAN:not a number) et il est positif
    return port;
  }
  return false;
};

const server = http.createServer(app);// créer le serveur node.js et délègue la partie gestion de toutes les requettes reçu a EXPRESS via la variable app

const port = normalizePort(process.env.PORT) || 3000; //si normalizePort n'est pas false on prend sa valeur si nonn on prend le port 3000 par défaut
app.set('port', port);


const errorHandler = error => { // gère toute erreur du serveur
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
server.on('error', errorHandler); // en cas d'erreur j'appelle la fonction errorHandler()

const listenningHandler = () => { //  listenning                                                                  
  const address = server.address();
  const bind = typeof (address) === 'string' ? 'pipe ' + address : 'port ' + port; // une autre écriture de (if / else)
  console.log('Listening on ' + bind);
}
server.on('listening', listenningHandler);// en cas de listenning (le serveur est up and runing) j'appelle la fonction listenningHandler


server.listen(port);

