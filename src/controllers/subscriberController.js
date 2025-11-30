/**
 * Contrôleur pour la gestion des inscriptions à la newsletter
 */

const Subscriber = require('../models/Subscriber');
const { validateSubscriptionData, sanitizeData } = require('../utils/validation');

/**
 * Crée une nouvelle inscription à la newsletter
 * @param {Object} data - Les données du formulaire
 * @returns {Promise<Object>} - { success: boolean, errors: string[], message?: string, subscriber?: Object }
 */
async function createSubscription(data) {
  try {
    // Nettoyer les données
    const cleanData = sanitizeData(data);

    // Valider les données
    const validation = validateSubscriptionData(cleanData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Vérifier si l'email existe déjà
    const existingSubscriber = await Subscriber.findOne({ 
      email: cleanData.email 
    });

    if (existingSubscriber) {
      return {
        success: false,
        errors: ['Cet email est déjà inscrit']
      };
    }

    // Créer le nouvel abonné
    const newSubscriber = new Subscriber({
      email: cleanData.email,
      prenom: cleanData.prenom,
      nom: cleanData.nom
    });

    // Sauvegarder dans MongoDB
    await newSubscriber.save();

    return {
      success: true,
      errors: [],
      message: `Bienvenue ${cleanData.prenom} ${cleanData.nom}! Merci de votre inscription.`,
      subscriber: {
        id: newSubscriber._id,
        email: newSubscriber.email,
        prenom: newSubscriber.prenom,
        nom: newSubscriber.nom
      }
    };

  } catch (error) {
    console.error('Erreur lors de la création de l\'inscription:', error);

    // Gérer les erreurs de validation MongoDB
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors)
        .map(err => err.message);
      return {
        success: false,
        errors: validationErrors
      };
    }

    // Erreur générique
    return {
      success: false,
      errors: ['Une erreur est survenue lors de l\'inscription. Veuillez réessayer.']
    };
  }
}

/**
 * Récupère tous les abonnés
 * @returns {Promise<Array>} - Liste des abonnés
 */
async function getAllSubscribers() {
  try {
    const subscribers = await Subscriber.find()
      .select('-__v')
      .sort({ subscriptionDate: -1 });
    return subscribers;
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés:', error);
    throw error;
  }
}

/**
 * Récupère un abonné par ID
 * @param {string} subscriberId - L'ID de l'abonné
 * @returns {Promise<Object>} - Les données de l'abonné
 */
async function getSubscriberById(subscriberId) {
  try {
    const subscriber = await Subscriber.findById(subscriberId);
    return subscriber;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonné:', error);
    throw error;
  }
}

/**
 * Supprime un abonné
 * @param {string} subscriberId - L'ID de l'abonné
 * @returns {Promise<Object>} - Résultat de la suppression
 */
async function deleteSubscriber(subscriberId) {
  try {
    const result = await Subscriber.findByIdAndDelete(subscriberId);
    return result ? { success: true, message: 'Abonné supprimé' } : { success: false, message: 'Abonné non trouvé' };
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
}

/**
 * Compte le nombre total d'abonnés
 * @returns {Promise<number>} - Nombre d'abonnés
 */
async function countSubscribers() {
  try {
    const count = await Subscriber.countDocuments();
    return count;
  } catch (error) {
    console.error('Erreur lors du comptage des abonnés:', error);
    throw error;
  }
}

module.exports = {
  createSubscription,
  getAllSubscribers,
  getSubscriberById,
  deleteSubscriber,
  countSubscribers
};
