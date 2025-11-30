/**
 * Utilitaires de validation pour le formulaire d'inscription
 */

/**
 * Valide une adresse email avec une regex stricte
 * @param {string} email - L'email à valider
 * @returns {boolean} - True si l'email est valide
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valide un prénom ou nom (minimum 2 caractères)
 * @param {string} name - Le nom à valider
 * @returns {boolean} - True si valide
 */
function isValidName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  return name.trim().length >= 2;
}

/**
 * Valide tous les champs d'inscription
 * @param {Object} data - Les données à valider
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
function validateSubscriptionData(data) {
  const errors = [];

  // Validation email
  if (!data.email || data.email.trim() === '') {
    errors.push('L\'email est requis');
  } else if (!isValidEmail(data.email)) {
    errors.push('L\'email n\'est pas valide');
  }

  // Validation prénom
  if (!data.prenom || data.prenom.trim() === '') {
    errors.push('Le prénom est requis');
  } else if (!isValidName(data.prenom)) {
    errors.push('Le prénom doit contenir au moins 2 caractères');
  }

  // Validation nom
  if (!data.nom || data.nom.trim() === '') {
    errors.push('Le nom est requis');
  } else if (!isValidName(data.nom)) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Nettoie et formate les données d'entrée
 * @param {Object} data - Les données brutes
 * @returns {Object} - Les données nettoyées
 */
function sanitizeData(data) {
  return {
    email: data.email ? data.email.toLowerCase().trim() : '',
    prenom: data.prenom ? data.prenom.trim() : '',
    nom: data.nom ? data.nom.trim() : ''
  };
}

module.exports = {
  isValidEmail,
  isValidName,
  validateSubscriptionData,
  sanitizeData
};
