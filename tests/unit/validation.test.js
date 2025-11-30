/**
 * Tests unitaires pour les fonctions de validation
 */

const { expect } = require('chai');
const {
  isValidEmail,
  isValidName,
  validateSubscriptionData,
  sanitizeData
} = require('../../src/utils/validation');

describe('Validation Utils', () => {
  
  describe('isValidEmail', () => {
    
    it('devrait valider un email correct', () => {
      expect(isValidEmail('test@example.com')).to.be.true;
      expect(isValidEmail('john.doe@company.co.uk')).to.be.true;
      expect(isValidEmail('user+tag@domain.org')).to.be.true;
    });

    it('devrait rejeter un email invalide', () => {
      expect(isValidEmail('notanemail')).to.be.false;
      expect(isValidEmail('missing@domain')).to.be.false;
      expect(isValidEmail('@example.com')).to.be.false;
      expect(isValidEmail('user@')).to.be.false;
    });

    it('devrait rejeter les entrées null/undefined', () => {
      expect(isValidEmail(null)).to.be.false;
      expect(isValidEmail(undefined)).to.be.false;
      expect(isValidEmail('')).to.be.false;
    });

    it('devrait accepter les emails avec espaces avant/après', () => {
      expect(isValidEmail('  test@example.com  ')).to.be.true;
    });

    it('devrait rejeter les types non-string', () => {
      expect(isValidEmail(123)).to.be.false;
      expect(isValidEmail({})).to.be.false;
      expect(isValidEmail([])).to.be.false;
    });
  });

  describe('isValidName', () => {
    
    it('devrait valider un nom avec au moins 2 caractères', () => {
      expect(isValidName('Jean')).to.be.true;
      expect(isValidName('Jo')).to.be.true;
      expect(isValidName('Alexandre')).to.be.true;
    });

    it('devrait rejeter un nom avec moins de 2 caractères', () => {
      expect(isValidName('A')).to.be.false;
      expect(isValidName('')).to.be.false;
    });

    it('devrait rejeter les entrées null/undefined', () => {
      expect(isValidName(null)).to.be.false;
      expect(isValidName(undefined)).to.be.false;
    });

    it('devrait accepter les noms avec espaces', () => {
      expect(isValidName('  Jean  ')).to.be.true;
    });

    it('devrait rejeter les types non-string', () => {
      expect(isValidName(123)).to.be.false;
      expect(isValidName({})).to.be.false;
    });
  });

  describe('validateSubscriptionData', () => {
    
    it('devrait valider les données correctes', () => {
      const result = validateSubscriptionData({
        email: 'test@example.com',
        prenom: 'Jean',
        nom: 'Dupont'
      });
      expect(result.isValid).to.be.true;
      expect(result.errors).to.be.an('array').that.is.empty;
    });

    it('devrait rejeter les données avec email manquant', () => {
      const result = validateSubscriptionData({
        email: '',
        prenom: 'Jean',
        nom: 'Dupont'
      });
      expect(result.isValid).to.be.false;
      expect(result.errors).to.include('L\'email est requis');
    });

    it('devrait rejeter les données avec email invalide', () => {
      const result = validateSubscriptionData({
        email: 'notanemail',
        prenom: 'Jean',
        nom: 'Dupont'
      });
      expect(result.isValid).to.be.false;
      expect(result.errors).to.include('L\'email n\'est pas valide');
    });

    it('devrait rejeter les données avec prénom manquant', () => {
      const result = validateSubscriptionData({
        email: 'test@example.com',
        prenom: '',
        nom: 'Dupont'
      });
      expect(result.isValid).to.be.false;
      expect(result.errors).to.include('Le prénom est requis');
    });

    it('devrait rejeter les données avec prénom trop court', () => {
      const result = validateSubscriptionData({
        email: 'test@example.com',
        prenom: 'A',
        nom: 'Dupont'
      });
      expect(result.isValid).to.be.false;
      expect(result.errors).to.include('Le prénom doit contenir au moins 2 caractères');
    });

    it('devrait rejeter les données avec nom manquant', () => {
      const result = validateSubscriptionData({
        email: 'test@example.com',
        prenom: 'Jean',
        nom: ''
      });
      expect(result.isValid).to.be.false;
      expect(result.errors).to.include('Le nom est requis');
    });

    it('devrait retourner plusieurs erreurs', () => {
      const result = validateSubscriptionData({
        email: 'invalid',
        prenom: 'A',
        nom: ''
      });
      expect(result.isValid).to.be.false;
      expect(result.errors).to.have.lengthOf(3);
    });
  });

  describe('sanitizeData', () => {
    
    it('devrait nettoyer les espaces blancs', () => {
      const result = sanitizeData({
        email: '  test@example.com  ',
        prenom: '  Jean  ',
        nom: '  Dupont  '
      });
      expect(result.email).to.equal('test@example.com');
      expect(result.prenom).to.equal('Jean');
      expect(result.nom).to.equal('Dupont');
    });

    it('devrait convertir l\'email en minuscules', () => {
      const result = sanitizeData({
        email: 'TEST@EXAMPLE.COM',
        prenom: 'Jean',
        nom: 'Dupont'
      });
      expect(result.email).to.equal('test@example.com');
    });

    it('devrait gérer les données vides', () => {
      const result = sanitizeData({
        email: '',
        prenom: '',
        nom: ''
      });
      expect(result.email).to.equal('');
      expect(result.prenom).to.equal('');
      expect(result.nom).to.equal('');
    });

    it('devrait conserver la casse pour prénom et nom', () => {
      const result = sanitizeData({
        email: 'test@example.com',
        prenom: 'JeAn',
        nom: 'DuPoNt'
      });
      expect(result.prenom).to.equal('JeAn');
      expect(result.nom).to.equal('DuPoNt');
    });
  });
});
