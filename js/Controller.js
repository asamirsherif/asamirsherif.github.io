/**
 * Game Logic 
 * Controller
 */

/** @namespace application main object (MemoryGame)
 */
var MemoryGame = {

  settings: {
    rows: 2,
    columns: 3,
    images: 3, // Number of images
  },

  // state properties
  cards: [], 
  trials: 0, 
  wrongMoves: 0, 
  isGameOver: false,

  /**
   * check setting entered to prevent logic error during the game
   * @param (rows,colums,images)
   */
  initialize : function(rows, columns, images) {
    var validinputs = true;

    // Validate args
    if (!(typeof columns === 'number' && (columns % 1) === 0 && columns > 1) ||
        !(typeof rows === 'number' && (rows % 1) === 0) && rows > 1) {
      validinputs = false;
      throw {
        name: "invalidnumber",
        message: "rows and columns must be integers or > 1."
      };
    }

    if ((columns * rows) % 2 !== 0) {
      validinputs = false;
      throw {
        name: "notEven",
        message: "rows or columns multiplication must be an even number."
      };
    }

    if (validinputs) {
      this.settings.rows = rows;
      this.settings.columns = columns;
      this.settings.images = images;
      this.trials = 0;
      this.wrongMoves = 0;
      this.isGameOver = false;
      this.genetateCards().shuffleCards();
    }

    return this.cards;
  },

  

  /**
   * Create an array of sorted cards
   *
   * @return Reference to self object
   */
  genetateCards: function() {
    var cards = [];
    var values = [];
    var i = 0;
    var maxNumberofCards = (this.settings.columns * this.settings.rows) / 2;
    while (i < maxNumberofCards) {
      // Next random card value
      var value = this.randomizeCardNumbers(values);
      // Card 1
      cards[2 * i] = new this.Card(value); //Constructor
      // Card 2 (card with same value)
      cards[2 * i + 1] = new this.Card(value, true);
      i++;
    }

    this.cards = cards;

    return this;
  },

  /**
    *get random value between 0 and cards numbers
   */
  randomizeCardNumbers: function(values) {
    var valid = false;
    var randomValue = 0;

    while (!valid) {
      randomValue = Math.floor(Math.random() * this.settings.images) + 1;
      var found = false;
      for (var index = 0; index < values.length; index++) {
        if (randomValue === values[index]) {
          found = true;
          break;
        }
      }
      if (!found) {
        valid = true;
        values.push(randomValue); // add random values 
      }
    }

    return randomValue;
  },

  /**
   * shuffle elements in array
   */
  shuffleCards: function() {
    var cards = this.cards;
    var shuffledCards = [];
    var randomIndex = 0;

    while (shuffledCards.length < cards.length) {
      randomIndex  = Math.floor(Math.random() * cards.length);

      if(cards[randomIndex]) {
        shuffledCards.push(cards[randomIndex]);
        cards[randomIndex] = false;
      }

    }

    this.cards = shuffledCards;

    return this;
  },

  /**
   * player flip two cards and return what happen with each selection
   *
   * @param card selected by player
   */
  play: (function() {
    var cardSelected = [];
    var openedCards = 0;
    var openedValues = [];

    return function(index) {
      var status = {};
      var value = this.cards[index].value;

      if (!this.cards[index].Revealed) {
        this.cards[index].reveal();
        cardSelected.push(index);
        if (cardSelected.length == 2) {
          this.trials++;
          if (this.cards[cardSelected[0]].value !=
              this.cards[cardSelected[1]].value) {
            
            this.cards[cardSelected[0]].hide();
            this.cards[cardSelected[1]].hide();
            
            var isWrong = false;

            if (openedValues.indexOf(this.cards[cardSelected[0]].value) === -1) {
              openedValues.push(this.cards[cardSelected[0]].value);
            }
            else {
              isWrong = true;
            }

            if (openedValues.indexOf(this.cards[cardSelected[1]].value) === -1) {
              openedValues.push(this.cards[cardSelected[1]].value);
            }

            if (isWrong) {
              this.wrongMoves++;
            }

            openedValues.push(this.cards[cardSelected[0]].value);

            status.code = 3,
            status.args = cardSelected;
          }
          else {
            openedCards += 2;
            if (openedCards == this.cards.length) {

              this.isGameOver = true;
              openedCards = 0;
              openedValues = [];
              status.code = 4;
            }
            else {
              status.code = 2;
            }
          }
          cardSelected = [];
        }
        else {
          status.code = 1;
        }
      }
      else {
        status.code = 0;
      }

      return status;

    };
  })()

};
