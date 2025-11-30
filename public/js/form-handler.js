/**
 * Gestionnaire du formulaire d'inscription à la newsletter
 * Validation côté client, soumission AJAX et gestion des réponses
 */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('newsletterForm');
  const successAlert = document.getElementById('successAlert');
  const errorAlert = document.getElementById('errorAlert');
  const errorList = document.getElementById('errorList');
  const submitBtn = form.querySelector('button[type="submit"]');
  const loadingSpan = submitBtn.querySelector('.loading');
  const submitText = submitBtn.querySelector('.submit-text');

  /**
   * Déclenche l'animation de secousse sur la carte
   */
  function triggerShake() {
    const card = document.querySelector('.newsletter-card');
    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth; // Force reflow
      card.classList.add('shake');
    }
  }

  /**
   * Valide l'adresse email
   * @param {string} email - Email à valider
   * @returns {boolean} - True si valide
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide les champs du formulaire
   * @returns {Object} - Objet contenant les erreurs par champ
   */
  function validateForm() {
    const errors = {};
    const email = document.getElementById('email').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();

    // Validation email
    if (!email) {
      errors.email = 'L\'email est requis';
    } else if (!isValidEmail(email)) {
      errors.email = 'L\'email n\'est pas valide';
    }

    // Validation prénom
    if (!prenom) {
      errors.prenom = 'Le prénom est requis';
    } else if (prenom.length < 2) {
      errors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }

    // Validation nom
    if (!nom) {
      errors.nom = 'Le nom est requis';
    } else if (nom.length < 2) {
      errors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    return errors;
  }

  /**
   * Affiche les erreurs de validation sur le formulaire
   * @param {Object} errors - Erreurs par champ
   */
  function displayValidationErrors(errors) {
    // Réinitialiser tous les champs
    document.getElementById('email').classList.remove('is-invalid');
    document.getElementById('prenom').classList.remove('is-invalid');
    document.getElementById('nom').classList.remove('is-invalid');

    // Ajouter la classe invalid aux champs en erreur
    Object.keys(errors).forEach(field => {
      const input = document.getElementById(field);
      input.classList.add('is-invalid');
      document.getElementById(`${field}Error`).textContent = errors[field];
    });
    triggerShake();
  }

  /**
   * Réinitialise l'affichage des erreurs de validation
   */
  function clearValidationErrors() {
    ['email', 'prenom', 'nom'].forEach(field => {
      document.getElementById(field).classList.remove('is-invalid');
      document.getElementById(`${field}Error`).textContent = '';
    });
  }

  /**
   * Affiche une alerte de succès
   * @param {string} message - Message à afficher
   */
  function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    successAlert.classList.add('show');
    errorAlert.classList.remove('show');

    // Masquer le message de succès après 5 secondes
    setTimeout(() => {
      successAlert.classList.remove('show');
    }, 5000);
  }

  /**
   * Affiche une alerte d'erreur
   * @param {Array} errors - Tableau des erreurs
   */
  function showErrors(errors) {
    errorList.innerHTML = '';
    errors.forEach(error => {
      const li = document.createElement('li');
      li.textContent = error;
      errorList.appendChild(li);
    });
    errorAlert.classList.add('show');
    successAlert.classList.remove('show');
    triggerShake();
  }

  /**
   * Active/désactive l'état de chargement du bouton
   * @param {boolean} isLoading - True pour activer, false pour désactiver
   */
  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      loadingSpan.style.display = 'inline';
      submitText.style.display = 'none';
    } else {
      submitBtn.disabled = false;
      loadingSpan.style.display = 'none';
      submitText.style.display = 'inline';
    }
  }

  /**
   * Soumet le formulaire en AJAX
   * @param {Event} e - Événement de soumission
   */
  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prévient le rechargement de la page

    // Valider les champs côté client
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      displayValidationErrors(validationErrors);
      return;
    }

    clearValidationErrors();

    // Récupérer les données du formulaire
    const formData = new FormData(form);
    const data = {
      email: formData.get('email'),
      prenom: formData.get('prenom'),
      nom: formData.get('nom')
    };

    setLoading(true);

    try {
      // Envoyer les données en AJAX
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        // Succès
        showSuccess(result.message);
        form.reset(); // Réinitialiser le formulaire
        clearValidationErrors();
      } else {
        // Erreurs serveur
        showErrors(result.errors);
      }
    } catch (error) {
      // Erreur réseau ou serveur
      console.error('Erreur:', error);
      showErrors(['Une erreur est survenue lors de la soumission. Veuillez réessayer.']);
    } finally {
      setLoading(false);
    }
  });

  /**
   * Valider en temps réel à chaque modification
   */
  ['email', 'prenom', 'nom'].forEach(field => {
    document.getElementById(field).addEventListener('blur', function () {
      const errors = validateForm();
      if (errors[field]) {
        document.getElementById(field).classList.add('is-invalid');
        document.getElementById(`${field}Error`).textContent = errors[field];
      } else {
        document.getElementById(field).classList.remove('is-invalid');
        document.getElementById(`${field}Error`).textContent = '';
      }
    });
  });
});
