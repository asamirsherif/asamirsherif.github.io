/**
 * game UI
 * 
 */
//anonymous function in MemoryGame object
(function($) {
  
  // time before card reflip
  var noMatchTime = 1000;

  // images in database (in css file)
  var imagesInHand = 15;

  // when setting icon opened
  var settings = document.getElementById('game--settings-icon');
  var modal = document.getElementById('game--settings-modal');
  var endgame = document.getElementById('game--end-game-modal');
  var openSettings = function (event) {
    event.preventDefault();
    modal.classList.toggle('show');
    endgame.classList.remove('show');
  };
  settings.addEventListener('click', openSettings);

  // when start button opened
  var start = document.getElementById('game--settings-reset');
  var startSetting = function (event) {
    event.preventDefault();

    var widget = document.getElementById("game--settings-grid").valueOf();
    var rowsAndColums = widget.options[widget.selectedIndex].value;
    var grid = rowsAndColums.split('x'); //split "2x3" to {2,3}
    var cards = $.initialize(Number(grid[0]), Number(grid[1]), imagesInHand);
    

    if (cards) {
      document.getElementById('game--settings-modal').classList.remove('show');
      document.getElementById('game--end-game-modal').classList.remove('show');
      document.getElementById('game--end-game-message').innerText = "";
      document.getElementById('game--end-game-score').innerText = "";
      document.getElementById('game--end-game-moves').innerText = "";
      document.getElementById('game--end-game-mistakes').innerText = "";
      createLayout($.cards, $.settings.rows, $.settings.columns);
      flashCards();
    }

  };
  start.addEventListener('click', startSetting);

  //Music Play/Pause

  var music = document.getElementById('sound_button');
  var playPause = function(event){
    var snd = document.getElementById("sound"); 
    var snd_btn = document.getElementById("sound_button"); 
    snd.muted = !snd.muted; 
        if(snd.muted){ 
          snd_btn.innerHTML = "<img alt='Pause The Music' title='Music Paused' src='./images/music/off.png' />"; 
        } 
        else { 
          snd_btn.innerHTML = "<img alt='Play The Music' title='Music Palying' src='./images/music/on.png' />"; 
        }
  }
  
  music.addEventListener('click', playPause);
  

  //Flash Cards
  var flashCards = function() {
    for(i=0; i< $.cards.length; i++) {
      var childNodes = document.getElementById('game--cards').childNodes;
      childNodes[i].classList.toggle('opened');
    }
    setTimeout(function(){
        for(i=0; i< $.cards.length; i++) {
          var childNodes = document.getElementById('game--cards').childNodes;
          childNodes[i].classList.remove('opened');
        }
    }, 1200)
}


  // when Card is opened
  var flipCard = function (event) {

    event.preventDefault();

    var status = $.play(this.index);
    console.log(status);

    if (status.code != 0 ) {
      this.classList.toggle('opened');
    }

    if (status.code == 3 ) {
      setTimeout(function () {
        var childNodes = document.getElementById('game--cards').childNodes;
        childNodes[status.args[0]].classList.remove('opened');
        childNodes[status.args[1]].classList.remove('opened');
      }.bind(status), noMatchTime);
    }
    else if (status.code == 4) {
      var totalScore = parseInt((($.trials - $.wrongMoves) / $.trials) * 100, 10);
      var message = endGameModal(totalScore);

      document.getElementById('game--end-game-message').textContent = message;
      document.getElementById('game--end-game-moves').textContent = 'حركاتك : ' + $.trials;
      document.getElementById('game--end-game-mistakes').textContent = 'غلطاتك : ' + $.wrongMoves;
      document.getElementById('game--end-game-score').textContent = 'درجتك :' + totalScore + ' / 100';

      document.getElementById("game--end-game-modal").classList.toggle('show');
    }

  };

  var endGameModal = function(totalScore) {
    var message = "";

    if (totalScore >= 90) {
      message = "عظمة علي عظمة"
    }
    else if (totalScore >= 70 ) {
      message = "فنان بيلعب، أول مرة اشوف فنان بيلعب"
    }
    else if (totalScore >= 50) {
      message = "حلو و يجي منك"
    }
    else {
      message = "أداءك ضعيف";
    }

    return message;
  }

  // create the game layout
  var createLayout = function (cards, rows, columns) {
    if (!cards.length) {
      return;
    }

    var gameCards = document.getElementById("game--cards");
    var index = 0;

    var cardWidth = document.getElementById('game--app-container').offsetWidth / columns;
    var heightWidthRatio = cardWidth * (3 / 4);

    var cardHeight = document.getElementById('game--app-container').offsetHeight / rows;
    var widthHeightRatio = cardHeight * (4 / 3);

    //console.log(gameCards); /*resize testing*/ 

    // clear all child nodes
    while (gameCards.firstChild) {
      gameCards.firstChild.removeEventListener('click', flipCard);
      gameCards.removeChild(gameCards.firstChild);
    }

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        // Use cloneNode(true) otherwise only one node is appended
        gameCards.appendChild(createCard(index, cards[index],
          (100 / columns) + "%", (100 / rows) + "%"));
        index++;
      }
    }

    // resize cards
    if (cardHeight > heightWidthRatio) {
      // Update height
      gameCards.style.height = (heightWidthRatio * rows) + "px";
      gameCards.style.width = document.getElementById('game--app-container').offsetWidth + "px";
      gameCards.style.top = ((cardHeight * rows - (heightWidthRatio * rows)) / 2) + "px";
    }
    else {
      // width control
      gameCards.style.width = (widthHeightRatio * columns) + "px";
      gameCards.style.height = document.getElementById('game--app-container').offsetHeight + "px";
      gameCards.style.top = 0;
    }

  };

  // resize control
  window.addEventListener('resize', function() {
    createLayout($.cards, $.settings.rows, $.settings.columns);
  }, true);

  // Build single card
  var createCard = function (index, card, width, height) {
    var cardContainer = document.createElement("li");
    var flipper = document.createElement("div");
    var face = document.createElement("a");
    var back = document.createElement("a");

    cardContainer.index = index;
    cardContainer.style.width = width;
    cardContainer.style.height = height;
    cardContainer.classList.add("card-container");
    if (card.Revealed) {
      cardContainer.classList.add("opened");
    }

    flipper.classList.add("flipper");
    face.classList.add("face");
    face.setAttribute("href", "#");
    back.classList.add("back");
    back.classList.add("card-" + card.value);
    if (card.matchingCard) {
      back.classList.add("matching");
    }
    back.setAttribute("href", "#");

    flipper.appendChild(face);
    flipper.appendChild(back);
    cardContainer.appendChild(flipper);

    cardContainer.addEventListener('click', flipCard);

    return cardContainer;
  };

})(MemoryGame);
