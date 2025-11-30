/**
 * Serveur Express pour le formulaire d'inscription à la newsletter
 * Architecture modulaire avec routes, controllers et utils
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectDB, disconnectDB } = require('./config/db');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// === MIDDLEWARE ===

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// === ROUTES ===

// Routes API
app.use('/api', apiRouter);

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    errors: ['Route non trouvée']
  });
});

// === GESTION DES ERREURS ===

app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    errors: ['Une erreur interne est survenue']
  });
});

// === DÉMARRAGE DU SERVEUR ===

/**
 * Démarre le serveur avec la connexion MongoDB
 */
async function startServer() {
  try {
    // Connecter à MongoDB
    await connectDB();

    // Démarrer le serveur Express
    const server = app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });

    // Gestion de l'arrêt du serveur (SIGINT = Ctrl+C)
    process.on('SIGINT', async () => {
      console.log('\nArrêt du serveur...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Erreur au démarrage:', error.message);
    process.exit(1);
  }
}

// Démarrer le serveur
if (require.main === module) {
  startServer();
}

module.exports = app;

