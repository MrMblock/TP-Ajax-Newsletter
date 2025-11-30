/**
 * Configuration de la connexion à MongoDB
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newsletter';

/**
 * Connecte à MongoDB
 * @returns {Promise} - Promesse de connexion
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✓ MongoDB connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Erreur connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Déconnecte de MongoDB
 */
async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB déconnecté');
  } catch (error) {
    console.error(`✗ Erreur déconnexion MongoDB: ${error.message}`);
  }
}

module.exports = { connectDB, disconnectDB };
