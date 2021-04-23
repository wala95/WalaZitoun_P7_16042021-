const express = require('express');
const { Sequelize } = require('sequelize');;// driver(api) qui permet de communiquer avec la base de données mongooDB
const profilRoutes = require('./routes/profil');
const userRoutes = require('./routes/user');
const path = require('path');
require('dotenv').config();
const helmet = require('helmet');

// ouvrir une connection sur la bdd
const sequelize = new Sequelize('mysql://root:asta8firoallah@localhost:3306/socialmedia') 

try {
   sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
};

const app = express();
// mettre le serveur a l'écoute de touts types de requettes qui vient du navigateur
app.use((req, res, next) => { // intercepter la communicationentre le serveur et le navigateur pour ajouter des headers à toutes réponses pour n'importe qu'elle type de requettes (middlewear)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next(); // poursuivre la réponse au navigateur
});

app.use(express.json()); // body json
app.use(express.urlencoded({ extended: true })) //raw data

app.use('/images', express.static(path.join(__dirname, 'images')));// permet d'acceder aux images
app.use('/api/profil', profilRoutes);
app.use('/api/auth', userRoutes);

app.use(helmet()); 

module.exports = app;
