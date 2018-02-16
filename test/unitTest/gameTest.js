const assert = require('chai').assert;
const Game = require('../../src/models/game.js');
let game;
describe('#Game', () => {
  beforeEach(() => {
    let ColorDistributer = function() {
      this.colors = ['red','green','blue','yellow'];
    }
    ColorDistributer.prototype = {
      getColor:function() {
        return this.colors.shift();
      }
    }
    game = new Game('newGame',new ColorDistributer());
  });
  describe('#getStatus()', () => {
    it('should return game status', () => {
      let status = game.getStatus();
      assert.deepEqual(status, {});
    });
  });
  describe('#addPlayer()', () => {
    it('should addPlayer to game', () => {
      game.addPlayer('manish');
      assert.deepEqual(game.getPlayer('manish'), {
        name: 'manish',color:'red'
      });
    });
  });
  describe('#removePlayer()', () => {
    it('should removePlayer from game', () => {
      game.addPlayer('manish');
      assert.deepEqual(game.getPlayer('manish'), {name: 'manish',color:'red'});
      game.removePlayer('manish');
      assert.isUndefined(game.getPlayer('manish'));
    });
  });
  describe('#addPlayer()', () => {
    it('should add player in games', () => {
      game.addPlayer('john');
      assert.deepEqual(game.players,[{name:'john',color:'red'}]);
    });
    it('should add player in games', () => {
      game.addPlayer('john');
      game.addPlayer('alex');
      assert.deepEqual(game.players,[{name:'john',color:'red'},{name:'alex',color:'green'}]);
    });
  });
  describe('#hasEnoughPlayers()', () => {
    it(`should give false when game don't have enough players`, () => {
      game.addPlayer('ram');
      assert.isNotOk(game.hasEnoughPlayers());
    });
    it(`should give true when game has enough players`, () => {
      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.addPlayer('kaka');
      game.addPlayer('lala');
      assert.isOk(game.hasEnoughPlayers());
    });
  });
  describe('#neededPlayers()', () => {
    it(`should give number of needed players to start the game`, () => {
      game.addPlayer('ram');
      assert.equal(game.neededPlayers(),3);

      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.addPlayer('kaka');
      assert.equal(game.neededPlayers(),0);
    });
  });
  describe('#getDetails', () => {
    it(`should give name, creator and player's needed for game`, () => {
      game.addPlayer('ram');
      let expected = {
        name:'newGame',
        createdBy:'ram',
        remain:3,
      };
      assert.deepEqual(expected,game.getDetails());
    });
  });
  describe('#getBoardStatus',() => {
    it('should give the color-coin pair', () => {
      game.addPlayer('ashish');
      game.addPlayer('joy');
      assert.deepEqual(game.getBoardStatus(),{'red':'ashish','green':'joy'});
    })
  });
  describe('#getNoOfPlayers',() => {
    it('should give total number of players in game', () => {
      game.addPlayer('ashish');
      game.addPlayer('joy');
      assert.equal(game.getNoOfPlayers(),2);
    })
  });
});
