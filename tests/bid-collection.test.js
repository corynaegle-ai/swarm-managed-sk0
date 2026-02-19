/**
 * Tests for bid-collection.js
 */

// Mock DOM for testing
if (typeof document === 'undefined') {
    global.document = {
        getElementById: jest.fn(),
        createElement: jest.fn(),
        body: { appendChild: jest.fn() },
        querySelectorAll: jest.fn()
    };
}

const { BidCollection, showBidCollection, getBids } = require('../js/bid-collection.js');

describe('BidCollection', () => {
    let bidCollection;
    let mockContainer;
    let mockInputs;

    beforeEach(() => {
        bidCollection = new BidCollection();
        mockContainer = {
            innerHTML: '',
            id: 'bid-collection-container'
        };
        mockInputs = [];
        
        document.getElementById = jest.fn((id) => {
            if (id === 'bid-collection-container') return mockContainer;
            if (id === 'bid-total') return { textContent: '0' };
            if (id === 'proceed-bid-button') return { disabled: true, textContent: '' };
            return null;
        });
        
        document.createElement = jest.fn(() => mockContainer);
        document.querySelectorAll = jest.fn(() => mockInputs);
    });

    describe('showBidCollection', () => {
        it('should initialize with correct parameters', () => {
            const players = [{ id: '1', name: 'Player 1' }, { id: '2', name: 'Player 2' }];
            
            bidCollection.showBidCollection(3, 5, players);
            
            expect(bidCollection.currentRound).toBe(3);
            expect(bidCollection.handsInRound).toBe(5);
            expect(bidCollection.players).toEqual(players);
        });

        it('should clear previous bids', () => {
            bidCollection.bids.set('1', 3);
            
            bidCollection.showBidCollection(1, 4, [{ id: '1', name: 'Player 1' }]);
            
            expect(bidCollection.bids.size).toBe(0);
        });
    });

    describe('validateBid', () => {
        beforeEach(() => {
            bidCollection.handsInRound = 5;
            bidCollection.players = [{ id: '1', name: 'Player 1' }];
        });

        it('should accept valid bid', () => {
            const mockInput = {
                dataset: { playerId: '1' },
                value: '3',
                classList: { add: jest.fn(), remove: jest.fn() }
            };
            
            document.getElementById = jest.fn(() => ({ 
                textContent: '', 
                className: 'validation-message',
                classList: { add: jest.fn() }
            }));
            
            const result = bidCollection.validateBid(mockInput);
            
            expect(result).toBe(true);
            expect(bidCollection.bids.get('1')).toBe(3);
        });

        it('should reject bid exceeding handsInRound', () => {
            const mockInput = {
                dataset: { playerId: '1' },
                value: '6',
                classList: { add: jest.fn(), remove: jest.fn() }
            };
            
            document.getElementById = jest.fn(() => ({ 
                textContent: '', 
                className: 'validation-message',
                classList: { add: jest.fn() }
            }));
            
            const result = bidCollection.validateBid(mockInput);
            
            expect(result).toBe(false);
            expect(bidCollection.bids.has('1')).toBe(false);
        });

        it('should reject negative bid', () => {
            const mockInput = {
                dataset: { playerId: '1' },
                value: '-1',
                classList: { add: jest.fn(), remove: jest.fn() }
            };
            
            document.getElementById = jest.fn(() => ({ 
                textContent: '', 
                className: 'validation-message',
                classList: { add: jest.fn() }
            }));
            
            const result = bidCollection.validateBid(mockInput);
            
            expect(result).toBe(false);
            expect(bidCollection.bids.has('1')).toBe(false);
        });
    });

    describe('getBids', () => {
        it('should return array of bid objects', () => {
            bidCollection.players = [
                { id: '1', name: 'Alice' },
                { id: '2', name: 'Bob' }
            ];
            bidCollection.bids.set('1', 2);
            bidCollection.bids.set('2', 3);
            
            const bids = bidCollection.getBids();
            
            expect(bids).toHaveLength(2);
            expect(bids[0]).toEqual({ playerId: '1', playerName: 'Alice', bid: 2 });
            expect(bids[1]).toEqual({ playerId: '2', playerName: 'Bob', bid: 3 });
        });

        it('should only return players with bids', () => {
            bidCollection.players = [
                { id: '1', name: 'Alice' },
                { id: '2', name: 'Bob' }
            ];
            bidCollection.bids.set('1', 2);
            
            const bids = bidCollection.getBids();
            
            expect(bids).toHaveLength(1);
            expect(bids[0]).toEqual({ playerId: '1', playerName: 'Alice', bid: 2 });
        });
    });

    describe('updateProceedButton', () => {
        beforeEach(() => {
            bidCollection.proceedButton = {
                disabled: true,
                textContent: ''
            };
            bidCollection.players = [
                { id: '1', name: 'Alice' },
                { id: '2', name: 'Bob' }
            ];
            bidCollection.handsInRound = 5;
        });

        it('should enable button when all players have valid bids', () => {
            bidCollection.bids.set('1', 2);
            bidCollection.bids.set('2', 3);
            
            bidCollection.updateProceedButton();
            
            expect(bidCollection.proceedButton.disabled).toBe(false);
        });

        it('should disable button when not all players have bids', () => {
            bidCollection.bids.set('1', 2);
            
            bidCollection.updateProceedButton();
            
            expect(bidCollection.proceedButton.disabled).toBe(true);
        });
    });
});

describe('Global Functions', () => {
    it('showBidCollection should create instance and call method', () => {
        const players = [{ id: '1', name: 'Player 1' }];
        
        // Mock DOM elements
        document.getElementById = jest.fn(() => null);
        document.createElement = jest.fn(() => ({ id: '', innerHTML: '' }));
        document.body = { appendChild: jest.fn() };
        document.querySelectorAll = jest.fn(() => []);
        
        showBidCollection(1, 3, players);
        
        // Should not throw error
        expect(true).toBe(true);
    });

    it('getBids should return empty array when no instance', () => {
        const bids = getBids();
        expect(bids).toEqual([]);
    });
});