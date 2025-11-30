/**
 * Tests unitaires pour le contrôleur d'inscription
 */

const { expect } = require('chai');
const sinon = require('sinon');
const subscriberController = require('../../src/controllers/subscriberController');
const Subscriber = require('../../src/models/Subscriber');

describe('Subscriber Controller', () => {
  
  describe('createSubscription', () => {
    let findOneStub, saveStub;

    beforeEach(() => {
      // Stub les méthodes de Mongoose
      findOneStub = sinon.stub(Subscriber, 'findOne');
      saveStub = sinon.stub(Subscriber.prototype, 'save');
    });

    afterEach(() => {
      // Restaurer les stubs après chaque test
      findOneStub.restore();
      saveStub.restore();
    });

    it('devrait créer un nouvel abonné avec données valides', async () => {
      // Setup
      findOneStub.resolves(null); // Email n'existe pas
      saveStub.resolves({
        _id: '123',
        email: 'test@example.com',
        prenom: 'Jean',
        nom: 'Dupont'
      });

      // Exécution
      const result = await subscriberController.createSubscription({
        email: 'test@example.com',
        prenom: 'Jean',
        nom: 'Dupont'
      });

      // Assertions
      expect(result.success).to.be.true;
      expect(result.errors).to.be.an('array').that.is.empty;
      expect(result.message).to.include('Bienvenue Jean Dupont');
      expect(result.subscriber).to.exist;
      expect(result.subscriber.email).to.equal('test@example.com');
    });

    it('devrait rejeter les données invalides', async () => {
      const result = await subscriberController.createSubscription({
        email: 'invalid-email',
        prenom: 'A',
        nom: ''
      });

      expect(result.success).to.be.false;
      expect(result.errors).to.be.an('array').that.is.not.empty;
      expect(result.errors.length).to.equal(3);
    });

    it('devrait rejeter un email déjà inscrit', async () => {
      // Setup
      findOneStub.resolves({
        email: 'test@example.com',
        prenom: 'Jean',
        nom: 'Dupont'
      });

      // Exécution
      const result = await subscriberController.createSubscription({
        email: 'test@example.com',
        prenom: 'Jean',
        nom: 'Dupont'
      });

      // Assertions
      expect(result.success).to.be.false;
      expect(result.errors).to.include('Cet email est déjà inscrit');
    });

    it('devrait nettoyer les données (trim et toLowerCase pour email)', async () => {
      findOneStub.resolves(null);
      saveStub.resolves({
        _id: '123',
        email: 'test@example.com',
        prenom: 'Jean',
        nom: 'Dupont'
      });

      const result = await subscriberController.createSubscription({
        email: '  TEST@EXAMPLE.COM  ',
        prenom: '  Jean  ',
        nom: '  Dupont  '
      });

      expect(result.success).to.be.true;
      expect(findOneStub.calledWith({ email: 'test@example.com' })).to.be.true;
    });

    it('devrait gérer les erreurs de validation MongoDB', async () => {
      findOneStub.resolves(null);
      const error = new Error('Validation error');
      error.name = 'ValidationError';
      error.errors = {
        email: { message: 'Email invalide' }
      };
      saveStub.rejects(error);

      const result = await subscriberController.createSubscription({
        email: 'test@example.com',
        prenom: 'Jean',
        nom: 'Dupont'
      });

      expect(result.success).to.be.false;
      expect(result.errors).to.include('Email invalide');
    });
  });

  describe('getAllSubscribers', () => {
    let findStub;

    beforeEach(() => {
      findStub = sinon.stub(Subscriber, 'find');
    });

    afterEach(() => {
      findStub.restore();
    });

    it('devrait retourner la liste de tous les abonnés', async () => {
      const mockSubscribers = [
        { _id: '1', email: 'test1@example.com', prenom: 'Jean', nom: 'Dupont' },
        { _id: '2', email: 'test2@example.com', prenom: 'Marie', nom: 'Martin' }
      ];

      findStub.returns({
        select: sinon.stub().returns({
          sort: sinon.stub().resolves(mockSubscribers)
        })
      });

      const result = await subscriberController.getAllSubscribers();

      expect(result).to.be.an('array');
      expect(result.length).to.equal(2);
    });

    it('devrait retourner un tableau vide s\'il n\'y a pas d\'abonnés', async () => {
      findStub.returns({
        select: sinon.stub().returns({
          sort: sinon.stub().resolves([])
        })
      });

      const result = await subscriberController.getAllSubscribers();

      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('getSubscriberById', () => {
    let findByIdStub;

    beforeEach(() => {
      findByIdStub = sinon.stub(Subscriber, 'findById');
    });

    afterEach(() => {
      findByIdStub.restore();
    });

    it('devrait retourner un abonné par ID', async () => {
      const mockSubscriber = {
        _id: '123',
        email: 'test@example.com',
        prenom: 'Jean',
        nom: 'Dupont'
      };

      findByIdStub.resolves(mockSubscriber);

      const result = await subscriberController.getSubscriberById('123');

      expect(result).to.exist;
      expect(result.email).to.equal('test@example.com');
      expect(findByIdStub.calledWith('123')).to.be.true;
    });

    it('devrait retourner null si l\'abonné n\'existe pas', async () => {
      findByIdStub.resolves(null);

      const result = await subscriberController.getSubscriberById('invalid-id');

      expect(result).to.be.null;
    });
  });

  describe('deleteSubscriber', () => {
    let findByIdAndDeleteStub;

    beforeEach(() => {
      findByIdAndDeleteStub = sinon.stub(Subscriber, 'findByIdAndDelete');
    });

    afterEach(() => {
      findByIdAndDeleteStub.restore();
    });

    it('devrait supprimer un abonné', async () => {
      findByIdAndDeleteStub.resolves({ _id: '123' });

      const result = await subscriberController.deleteSubscriber('123');

      expect(result.success).to.be.true;
      expect(result.message).to.equal('Abonné supprimé');
    });

    it('devrait retourner un message d\'erreur si l\'abonné n\'existe pas', async () => {
      findByIdAndDeleteStub.resolves(null);

      const result = await subscriberController.deleteSubscriber('invalid-id');

      expect(result.success).to.be.false;
      expect(result.message).to.equal('Abonné non trouvé');
    });
  });

  describe('countSubscribers', () => {
    let countDocumentsStub;

    beforeEach(() => {
      countDocumentsStub = sinon.stub(Subscriber, 'countDocuments');
    });

    afterEach(() => {
      countDocumentsStub.restore();
    });

    it('devrait compter le nombre d\'abonnés', async () => {
      countDocumentsStub.resolves(42);

      const result = await subscriberController.countSubscribers();

      expect(result).to.equal(42);
    });

    it('devrait retourner 0 s\'il n\'y a pas d\'abonnés', async () => {
      countDocumentsStub.resolves(0);

      const result = await subscriberController.countSubscribers();

      expect(result).to.equal(0);
    });
  });
});
