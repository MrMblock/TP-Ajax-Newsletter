/**
 * Routes pour les endpoints d'inscription à la newsletter
 */

const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');

/**
 * POST /api/subscribe
 * Crée une nouvelle inscription à la newsletter
 */
router.post('/subscribe', async (req, res) => {
  const result = await subscriberController.createSubscription(req.body);
  
  const statusCode = result.success ? 200 : 400;
  res.status(statusCode).json(result);
});

/**
 * GET /api/subscribers
 * Récupère la liste de tous les abonnés (optionnel, admin)
 */
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await subscriberController.getAllSubscribers();
    res.json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, errors: ['Erreur serveur'] });
  }
});

/**
 * GET /api/subscribers/:id
 * Récupère un abonné spécifique
 */
router.get('/subscribers/:id', async (req, res) => {
  try {
    const subscriber = await subscriberController.getSubscriberById(req.params.id);
    if (subscriber) {
      res.json({ success: true, data: subscriber });
    } else {
      res.status(404).json({ success: false, errors: ['Abonné non trouvé'] });
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: ['Erreur serveur'] });
  }
});

/**
 * DELETE /api/subscribers/:id
 * Supprime un abonné
 */
router.delete('/subscribers/:id', async (req, res) => {
  try {
    const result = await subscriberController.deleteSubscriber(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, errors: ['Erreur serveur'] });
  }
});

/**
 * GET /api/stats
 * Retourne les statistiques
 */
router.get('/stats', async (req, res) => {
  try {
    const count = await subscriberController.countSubscribers();
    res.json({ success: true, data: { totalSubscribers: count } });
  } catch (error) {
    res.status(500).json({ success: false, errors: ['Erreur serveur'] });
  }
});

module.exports = router;
