/**
 * @namespace a class object in MemoryGame object for card control
 */
MemoryGame.Card = function(value, matchingCard) {
  this.value = value;
  this.Revealed = false;
  if (matchingCard) {
    this.matchingCard = true;
  }

  this.reveal = function() {
    this.Revealed = true;
  }

  this.hide = function() {
    this.Revealed = false;
  }
};
