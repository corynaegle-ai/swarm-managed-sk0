// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: function(key) {
        return this.store[key] || null;
    },
    setItem: function(key, value) {
        this.store[key] = value.toString();
    },
    clear: function() {
        this.store = {};
    }
};

// Mock DOM
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="tricks-entry-container"></div></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = localStorageMock;

const TricksEntry = require('../js/tricks-entry');

describe('TricksEntry', () => {
    let tricksEntry;
    const mockGameState = {
        currentRound: 0,
        players: [
            { name: 'Player 1' },
            { name: 'Player 2' }
        ],
        rounds: [{
            cardsPerPlayer: 5,
            trumpSuit: 'Hearts',
            bids: [
                { bid: 2, tricksTaken: null, bonusPoints: 0 },
                { bid: 3, tricksTaken: null, bonusPoints: 0 }
            ]
        }]
    };

    beforeEach(() => {
        localStorageMock.clear();
        localStorageMock.setItem('gameState', JSON.stringify(mockGameState));
        document.body.innerHTML = '<div id="tricks-entry-container"></div>';
    });

    describe('Initialization', () => {
        test('should load game state from localStorage', () => {
            tricksEntry = new TricksEntry();
            expect(tricksEntry.gameState).toEqual(mockGameState);
        });

        test('should throw error if no game state found', () => {
            localStorageMock.clear();
            expect(() => new TricksEntry()).toThrow('No game state found');
        });

        test('should create form with player entries', () => {
            tricksEntry = new TricksEntry();
            const form = document.getElementById('tricks-form');
            expect(form).not.toBeNull();
            
            const playerEntries = document.querySelectorAll('.player-entry');
            expect(playerEntries.length).toBe(2);
        });
    });

    describe('Form Validation', () => {
        beforeEach(() => {
            tricksEntry = new TricksEntry();
        });

        test('should validate tricks input within range', () => {
            const tricksInput = document.getElementById('tricks-0');
            tricksInput.value = '3';
            
            const isValid = tricksEntry.validateInput(tricksInput);
            expect(isValid).toBe(true);
            expect(tricksInput.classList.contains('error')).toBe(false);
        });

        test('should invalidate tricks input out of range', () => {
            const tricksInput = document.getElementById('tricks-0');
            tricksInput.value = '10'; // Max is 5
            
            const isValid = tricksEntry.validateInput(tricksInput);
            expect(isValid).toBe(false);
            expect(tricksInput.classList.contains('error')).toBe(true);
        });

        test('should disable submit button when form is invalid', () => {
            const submitButton = document.getElementById('submit-tricks');
            expect(submitButton.disabled).toBe(true);
        });

        test('should enable submit button when all tricks are entered', () => {
            document.getElementById('tricks-0').value = '2';
            document.getElementById('tricks-1').value = '3';
            
            tricksEntry.validateForm();
            
            const submitButton = document.getElementById('submit-tricks');
            expect(submitButton.disabled).toBe(false);
        });
    });

    describe('Data Submission', () => {
        beforeEach(() => {
            tricksEntry = new TricksEntry();
            document.getElementById('tricks-0').value = '2';
            document.getElementById('tricks-1').value = '3';
            document.getElementById('bonus-0').value = '1';
            document.getElementById('bonus-1').value = '0';
        });

        test('should update gameState with tricks taken and bonus points', () => {
            tricksEntry.handleSubmit();
            
            expect(tricksEntry.gameState.rounds[0].bids[0].tricksTaken).toBe(2);
            expect(tricksEntry.gameState.rounds[0].bids[0].bonusPoints).toBe(1);
            expect(tricksEntry.gameState.rounds[0].bids[1].tricksTaken).toBe(3);
            expect(tricksEntry.gameState.rounds[0].bids[1].bonusPoints).toBe(0);
        });

        test('should mark round as having tricks entered', () => {
            tricksEntry.handleSubmit();
            
            expect(tricksEntry.gameState.rounds[0].tricksEntered).toBe(true);
            expect(tricksEntry.gameState.rounds[0].lastUpdated).toBeDefined();
        });

        test('should save gameState to localStorage', () => {
            tricksEntry.handleSubmit();
            
            const savedState = JSON.parse(localStorageMock.getItem('gameState'));
            expect(savedState.rounds[0].bids[0].tricksTaken).toBe(2);
        });
    });

    describe('Navigation', () => {
        beforeEach(() => {
            tricksEntry = new TricksEntry();
            // Mock window.location
            delete window.location;
            window.location = { href: '' };
        });

        test('should navigate to scoring page after successful submission', () => {
            document.getElementById('tricks-0').value = '2';
            document.getElementById('tricks-1').value = '3';
            
            tricksEntry.handleSubmit();
            
            expect(window.location.href).toBe('scoring.html');
        });
    });
});