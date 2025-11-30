/**
 * Tests d'intégration pour les routes API
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('../../src/routes/api');
const subscriberController = require('../../src/controllers/subscriberController');

describe('API Routes Integration Tests', () => {
  let app;

  beforeEach(() => {
    // Créer une app Express pour tester
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/api', apiRouter);
  });

  describe('POST /api/subscribe', () => {
    let createSubscriptionStub;

    beforeEach(() => {
      createSubscriptionStub = sinon.stub(subscriberController, 'createSubscription');
    });

    afterEach(() => {
      createSubscriptionStub.restore();
    });

    it('devrait retourner 200 et un message de succès', async () => {
      createSubscriptionStub.resolves({
        success: true,
        errors: [],
        message: 'Bienvenue Jean Dupont! Merci de votre inscription.',
        subscriber: {
          id: '123',
          email: 'test@example.com',
          prenom: 'Jean',
          nom: 'Dupont'
        }
      });

      const response = await request(app)
        .post('/api/subscribe')
        .send({
          email: 'test@example.com',
          prenom: 'Jean',
          nom: 'Dupont'
        });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.message).to.include('Bienvenue');
    });

    it('devrait retourner 400 en cas d\'erreur de validation', async () => {
      createSubscriptionStub.resolves({
        success: false,
        errors: ['L\'email n\'est pas valide']
      });

      const response = await request(app)
        .post('/api/subscribe')
        .send({
          email: 'invalid',
          prenom: 'Jean',
          nom: 'Dupont'
        });

      expect(response.status).to.equal(400);
      expect(response.body.success).to.be.false;
      expect(response.body.errors).to.be.an('array');
    });

    it('devrait retourner 400 si email déjà inscrit', async () => {
      createSubscriptionStub.resolves({
        success: false,
        errors: ['Cet email est déjà inscrit']
      });

      const response = await request(app)
        .post('/api/subscribe')
        .send({
          email: 'existing@example.com',
          prenom: 'Jean',
          nom: 'Dupont'
        });

      expect(response.status).to.equal(400);
      expect(response.body.errors).to.include('Cet email est déjà inscrit');
    });
  });

  describe('GET /api/subscribers', () => {
    let getAllSubscribersStub;

    beforeEach(() => {
      getAllSubscribersStub = sinon.stub(subscriberController, 'getAllSubscribers');
    });

    afterEach(() => {
      getAllSubscribersStub.restore();
    });

    it('devrait retourner la liste de tous les abonnés', async () => {
      getAllSubscribersStub.resolves([
        { _id: '1', email: 'test1@example.com', prenom: 'Jean', nom: 'Dupont' },
        { _id: '2', email: 'test2@example.com', prenom: 'Marie', nom: 'Martin' }
      ]);

      const response = await request(app)
        .get('/api/subscribers');

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.equal(2);
    });

    it('devrait retourner un tableau vide si pas d\'abonnés', async () => {
      getAllSubscribersStub.resolves([]);

      const response = await request(app)
        .get('/api/subscribers');

      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an('array').that.is.empty;
    });

    it('devrait gérer les erreurs serveur', async () => {
      getAllSubscribersStub.rejects(new Error('Database error'));

      const response = await request(app)
        .get('/api/subscribers');

      expect(response.status).to.equal(500);
      expect(response.body.success).to.be.false;
    });
  });

  describe('GET /api/subscribers/:id', () => {
    let getSubscriberByIdStub;

    beforeEach(() => {
      getSubscriberByIdStub = sinon.stub(subscriberController, 'getSubscriberById');
    });

    afterEach(() => {
      getSubscriberByIdStub.restore();
    });

    it('devrait retourner un abonné par ID', async () => {
      getSubscriberByIdStub.resolves({
        _id: '123',
        email: 'test@example.com',
        prenom: 'Jean',
        nom: 'Dupont'
      });

      const response = await request(app)
        .get('/api/subscribers/123');

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.email).to.equal('test@example.com');
    });

    it('devrait retourner 404 si l\'abonné n\'existe pas', async () => {
      getSubscriberByIdStub.resolves(null);

      const response = await request(app)
        .get('/api/subscribers/invalid-id');

      expect(response.status).to.equal(404);
      expect(response.body.success).to.be.false;
    });
  });

  describe('DELETE /api/subscribers/:id', () => {
    let deleteSubscriberStub;

    beforeEach(() => {
      deleteSubscriberStub = sinon.stub(subscriberController, 'deleteSubscriber');
    });

    afterEach(() => {
      deleteSubscriberStub.restore();
    });

    it('devrait supprimer un abonné', async () => {
      deleteSubscriberStub.resolves({
        success: true,
        message: 'Abonné supprimé'
      });

      const response = await request(app)
        .delete('/api/subscribers/123');

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
    });

    it('devrait retourner un message d\'erreur si l\'abonné n\'existe pas', async () => {
      deleteSubscriberStub.resolves({
        success: false,
        message: 'Abonné non trouvé'
      });

      const response = await request(app)
        .delete('/api/subscribers/invalid-id');

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.false;
    });
  });

  describe('GET /api/stats', () => {
    let countSubscribersStub;

    beforeEach(() => {
      countSubscribersStub = sinon.stub(subscriberController, 'countSubscribers');
    });

    afterEach(() => {
      countSubscribersStub.restore();
    });

    it('devrait retourner les statistiques', async () => {
      countSubscribersStub.resolves(42);

      const response = await request(app)
        .get('/api/stats');

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.totalSubscribers).to.equal(42);
    });

    it('devrait retourner 0 si pas d\'abonnés', async () => {
      countSubscribersStub.resolves(0);

      const response = await request(app)
        .get('/api/stats');

      expect(response.status).to.equal(200);
      expect(response.body.data.totalSubscribers).to.equal(0);
    });
  });
});
