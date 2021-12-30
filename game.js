var grid = document.querySelector("#grid")
var undoBtn = document.querySelector("#undoBtn")
var redoBtn = document.querySelector("#redoBtn")
var occupiedBlocks = document.querySelectorAll('.blocks');
var restartBtn = document.querySelector("#restartBtn")

var btns = document.querySelectorAll(".btn")

let width;
let height;




//set grid(paper) to fit screen
function resizeGrid() {
 if (window.innerHeight > window.innerWidth) {
  grid.style.height = window.innerWidth + 'px';
  grid.style.width = window.innerWidth + 'px';
  height = window.innerWidth;
  width = window.innerWidth;

 }
 else {
  grid.style.width = window.innerHeight + 'px';
  grid.style.height = window.innerHeight + 'px';
  width = window.innerHeight;
  height = window.innerHeight;

 }

}


resizeGrid();


window.addEventListener('resize', function() {
 resizeGrid();
 undo();
 redo();
})


var player1 = "X";
var player2 = "O";

let ogPlayer;

var draft = [];

var historyBlocks = [];

var allowTap = true;

let botMode = false;

let you;

let botReady = false;

let difficulty;


let jessPosResponses = ['Wow that was awesome...😯', 'I did not see that coming...🤨', 'Way to go 😊...', 'Looks like you beat me...\n wanna rematch...😏', 'Am so humiliated...🤕', 'How did you do that??!!...🤔', 'Nice, maybe next time go easy on me...😅']


function Block(id) {
 this.id = id;
 this.occupied = false;
 this.block = document.createElement('div');
}

Block.prototype.draw = function() {

 this.block.setAttribute("id", this.id)
 this.block.setAttribute("class", "blocks");
 grid.appendChild(this.block);
}

Block.prototype.unfreeze = function() {
 occupiedBlocks = document.querySelectorAll('.blocks');
 for (i = 0; i < occupiedBlocks.length; i++) {
  occupiedBlocks[i].classList.remove('undo')
  occupiedBlocks[i].classList.remove('occupied');
 }
 this.block.classList.add('undo');
}


Block.prototype.tap = function() {
 var block = this.block;
 var id = this.id;
 var _this = this;
 this.block.onclick = function() {
  if (allowTap) {
   if (!_this.occupied) {
    block.innerHTML = '<div>' + nxtPlyTracker + '</div>';
    draft.push(id);
    _this.occupied = true;

    historyBlocks.length = 0;


    let match = searchMatch(nxtPlyTracker);

    switchActivePlayer();


    occupiedBlocks = document.querySelectorAll('.blocks');
    for (i = 0; i < occupiedBlocks.length; i++) {
     occupiedBlocks[i].classList.remove('occupied');
     occupiedBlocks[i].classList.remove('undo');
    }



    if (nxtPlyTracker == player1) {
     nxtPlyTracker = player2;
    } else {
     nxtPlyTracker = player1;
    }

    if (botMode) allowTap = false;


    if (!match) {
     setTimeout(function() {


      if (botMode) {
       bot();
      }
     }, 1000);

    } else {
     if (botMode) {
      botReady = true;
     }
    }

   } else {
    for (i = 0; i < occupiedBlocks.length; i++) {
     occupiedBlocks[i].classList.remove('occupied')
     occupiedBlocks[i].classList.remove('undo');
    }
    block.classList.add('occupied');
   }
  }
 }
}



/**
 * 
 * find matches each time a block is occupied so as indentify the winner... if all the blocks are occupied and no match is found call draw()
 * 
 *
 **/

function searchMatch(nxtPlyTracker) {

 let matchBlocks = blocks.filter(blk =>
  blk.occupied == true && blk.block.innerText.toString() == nxtPlyTracker);



 if (matchBlocks.length > 2) {

  if (matchBlocks.find(block => block.id == 1) && matchBlocks.find(block => block.id == 2) && matchBlocks.find(block => block.id == 3)) {
   winner(nxtPlyTracker);
   return true;
  } else if (matchBlocks.find(block => block.id == 4) && matchBlocks.find(block => block.id == 5) && matchBlocks.find(block => block.id == 6)) {
   winner(nxtPlyTracker);
   return true;
  } else if (matchBlocks.find(block => block.id == 7) && matchBlocks.find(block => block.id == 8) && matchBlocks.find(block => block.id == 9)) {
   winner(nxtPlyTracker);
   return true;
  } else if (matchBlocks.find(block => block.id == 1) && matchBlocks.find(block => block.id == 4) && matchBlocks.find(block => block.id == 7)) {
   winner(nxtPlyTracker);
   return true;
  } else if (matchBlocks.find(block => block.id == 2) && matchBlocks.find(block => block.id == 5) && matchBlocks.find(block => block.id == 8)) {
   winner(nxtPlyTracker);
   return true;
  } else if (matchBlocks.find(block => block.id == 3) && matchBlocks.find(block => block.id == 6) && matchBlocks.find(block => block.id == 9)) {
   winner(nxtPlyTracker);
   return true;
  } else if (matchBlocks.find(block => block.id == 1) && matchBlocks.find(block => block.id == 5) && matchBlocks.find(block => block.id == 9)) {
   winner(nxtPlyTracker);
   return true;
  } else if (matchBlocks.find(block => block.id == 3) && matchBlocks.find(block => block.id == 5) && matchBlocks.find(block => block.id == 7)) {
   winner(nxtPlyTracker);
   return true;
  } else if (blocks.every(block => block.occupied == true)) {
   draw();
   return true;
  } else {
   return false;
  }
 }
}



var blocks = [];

var matches = [];


var matchArr = [];

let starter;



function play() {
 Swal.fire({
  icon: 'question',
  title: 'Play With...',
  confirmButtonText: 'BOT',
  customClass: 'swal',
  allowOutsideClick: false,
  showCancelButton: true,
  cancelButtonText: 'A Friend',

 }).then((result) => {
  if (!result.isConfirmed) {
   $('#player1Score').text(player1Score);
   $('#player2Score').text(player2Score);
   Swal.fire({
    icon: 'info',
    title: 'Play as...',
    confirmButtonText: '<i class="fa fa-circle-o white-text"></i>',
    allowOutsideClick: false,
    showCancelButton: true,
    cancelButtonText: '<i class="fa fa-times white-text"></i>',
    customClass: 'swal',
   }).then((result) => {
    if (result.isConfirmed) {
     nxtPlyTracker = player2;
     ogPlayer = player2;

     starter = player2;

     $('#player1').html('Player ' + player2);
     $('#player2').html('Player ' + player1)
    } else {
     nxtPlyTracker = player1;
     ogPlayer = player1;

     starter = player1;

     $('#player1').html('Player ' + player1);
     $('#player2').html('Player ' + player2)
    }
    let i = 0;
    while (i < 9) {
     i++
     let block = new Block(i);
     block.draw();
     block.tap();
     blocks.push(block);
    }
   })
  } else {
   //when playing with bot
   botMode = true;
   $('#player1Score').text(player1Score);
   $('#player2Score').text(player2Score);
   Swal.fire({
    icon: 'info',
    title: 'Play as...',
    confirmButtonText: '<i class="fa fa-circle-o white-text"></i>',
    allowOutsideClick: false,
    showCancelButton: true,
    cancelButtonText: '<i class="fa fa-times white-text"></i>',
    customClass: 'swal',
   }).then((result) => {
    if (result.isConfirmed) {

     nxtPlyTracker = player2;
     ogPlayer = player2;
     you = player2;
     $('#player1').html('You');
     $('#player2').html('BOT')
    } else {
     nxtPlyTracker = player1;
     ogPlayer = player1;
     you = player1;
     $('#player1').html('You');
     $('#player2').html('BOT')
    }
    $('#actionBtns').hide();

    swal.fire({
     title: "Difficulty",
     confirmButtonText: 'Easy',
     showDenyButton: true,
     showCancelButton: true,
     cancelButtonText: 'Hard',
     denyButtonText: `Normal`,
     allowOutsideClick: false,
     customClass: 'swal',
    }).then((result) => {
     if (result.isConfirmed) {
      difficulty = 'easy';
     } else if (result.isDenied) {
      difficulty = 'normal';
     } else {
      difficulty = 'hard'
     }
     let i = 0;
     while (i < 9) {
      i++
      let block = new Block(i);
      block.draw();
      block.tap();
      blocks.push(block);
     }


    })
   })

  }
 })


}

$('#playBtn').click(() => play())


undoBtn.onclick = function() {
 undo();
}

function undo() {
 if (draft.length > 0) {
  var lastPlay = draft.pop();
  let match = blocks.find(chat => chat.id == lastPlay);
  match.occupied = false;
  match.block.innerHTML = "";
  historyBlocks.push(lastPlay);
  switchActivePlayer();
  match.unfreeze();

  if (nxtPlyTracker == player1) {
   nxtPlyTracker = player2;
  } else {
   nxtPlyTracker = player1
  }


  if (you !== undefined) {
   if (you !== nxtPlyTracker) {
    allowTap = false;
    setTimeout(function() {
     bot();
    }, 100)
   }
  }

  if (!allowTap) {
   allowTap = true;
  }
 }
}


redoBtn.onclick = function() {
 redo()
}

function redo() {
 if (historyBlocks.length > 0) {

  var lastPlay = historyBlocks.pop();
  draft.push(lastPlay);
  let match = blocks.find(block => block.id == lastPlay);
  match.occupied = true;
  match.block.innerHTML = nxtPlyTracker;
  if (nxtPlyTracker == player1) {
   nxtPlyTracker = player2;
  } else {
   nxtPlyTracker = player1;
  }
  switchActivePlayer();
  for (i = 0; i < occupiedBlocks.length; i++) {
   occupiedBlocks[i].classList.remove('occupied');
   occupiedBlocks[i].classList.remove('undo');
  }
  match.block.classList.add('undo')
 }
}


var allBlocks = document.querySelectorAll('.blocks');
for (i = 0; i < blocks.length; i++) {
 var blockId = allBlocks[i].getAttribute('id');
 var txtcontent = '';
 var block = { id: blockId, content: txtcontent }

 matchArr.push(block);
}

let player1Score = 0;
let player2Score = 0;


function winner(nxtPlyTracker) {
 allowTap = false;
 let title;
 let html = '';
 if (you !== undefined) {
  if (you == nxtPlyTracker) {
   title = 'You win';
   rnd = Math.floor(Math.random() * jessPosResponses.length);
   html = '<strong>BOT~ </strong>' + jessPosResponses[rnd];
   player1Score++;
   $('#player1Score').text(player1Score);
  } else {
   title = 'BOT wins';
   player2Score++;
   $('#player2Score').text(player2Score);
  }
  if (you == player1) {
   you == player2;
  } else {
   you == player1;
  }
 } else {
  title = 'Player ' + nxtPlyTracker + ' wins';
  if (nxtPlyTracker == starter) {
   player1Score++;
   $('#player1Score').text(player1Score);
  } else {
   player2Score++;
   $('#player2Score').text(player2Score);
  }
 }
 setTimeout(function() {
  Swal.fire({
   title: title,
   html: html,
   confirmButtonColor: '#3085d6',
   confirmButtonText: 'Continue',
   allowOutsideClick: false,
   customClass: 'swal',
  }).then((result) => {
   if (result.isConfirmed) {
    allowTap = true;
    for (let blk of blocks) {
     blk.occupied = false;
     blk.block.innerHTML = '';
    }

    draft = [];
    historyBlocks = [];
    if (nxtPlyTracker == player1) {
     nxtPlyTracker = player2;
    } else {
     nxtPlyTracker = player1;
    }
    ogPlayer = nxtPlyTracker;

    for (i = 0; i < btns.length; i++) {
     btns[i].removeAttribute('disabled')
    }

    if (botReady) {
     allowTap = false;
     setTimeout(function() {
      bot();
     }, 400)
    }
   }
  })
 }, 300)

}

function draw() {
 Swal.fire({
  title: 'Looks like a draw',
  confirmButtonText: 'Rematch <i class="fa fa-repeat"></i>',
  allowOutsideClick: false,
  showCancelButton: true,
  cancelButtonText: 'Quit <i class="fa fa-close white-text"></i>',
  customClass: 'swal',

 }).then((result) => {
  if (result.isConfirmed) {
   for (let blk of blocks) {
    blk.occupied = false;
    blk.block.innerHTML = '';
   }
   if (you !== undefined) {
    if (you == player1) {
     you == player2
    } else {
     you == player1
    }
   }

   draft = [];
   historyBlocks = [];

   ogPlayer = nxtPlyTracker;
   if (botReady) {
    allowTap = false;
    setTimeout(function() {
     bot();
    }, 200)
   }
  } else {
   quit();
  }
 })
}


//switch player consecutively after a player has played
function switchActivePlayer() {
 if ($('#player1').hasClass('active')) {
  $('#player1').removeClass('active');
  $('#player2').addClass('active');
 } else {
  $('#player2').removeClass('active');
  $('#player1').addClass('active');
 }
}




function bot() {
 allowTap = false;
 if (botMode) {
  if (difficulty == "easy") {
   let occ = blocks.filter(block => block.occupied == false);
   rnd = Math.floor(Math.random() * occ.length);
   rnd = occ[rnd].id;

   let track = blocks.find(block => block.id == rnd);
   if (track.occupied == false) {
    botPlay(rnd);
    draft.push(rnd);
   } else {
    bot();
   }
  } else if (difficulty == 'normal') {
   findABox();
  } else {
   
  /**
   * when difficulty is hard.... make bot play at strategic positions to avoid two way situations that might occur in easy or normal difficulty
   * 
   **/
   
   
   
   
   let srch = blocks.every(blk => blk.occupied == false);
   let srchO = blocks.filter(blk => blk.occupied == true);

   let srch2 = blocks.filter(blk => blk.occupied == true && (blk.id == 1 || blk.id == 3 || blk.id == 7 || blk.id == 9 || blk.id == 5));
   if (srch) {
    let arr = [1, 3, 7, 9];
    let rnd = Math.floor(Math.random() * arr.length)

    botPlay(arr[rnd])
   } else if (srch2.length == 1) {
    if (srch2[0].id == 1 || srch2[0].id == 3 || srch2[0].id == 7 || srch2[0].id == 9) {

     botPlay(5);
    } else if(srch2[0].id == 5) {
     let arr = [1, 3, 7, 9];
    let rnd = Math.floor(Math.random() * arr.length)

    botPlay(arr[rnd])
    }
   } else if (srchO.length > 0) {
    findABox();
   }
  }
 }
}



/*
 * locate the blocks with similar bot charater greater than 1 that also match... if non is found reverse the process(flip)... locate opponent characters greater than 1 that match so as to stop opponent from Winnig
 *
 */

function findABox(flip) {
 let offense;

 if (nxtPlyTracker == player1) {
  offense = player2;
 } else {
  offense = player1;
 }

 let sugg;
 if (flip == undefined) {
  sugg = blocks.filter(blk => blk.occupied == true && blk.block.innerText == nxtPlyTracker);
 } else {
  sugg = blocks.filter(blk => blk.occupied == true && blk.block.innerText == offense);
 }



 if (sugg.length > 0) {

  if (!sugg.find(blk => blk.id == 1) && blocks.find(blk => blk.id == 1 && blk.occupied == false) && sugg.find(blk => blk.id == 2) && sugg.find(blk => blk.id == 3)) {
   botPlay(1);
  } else if (!sugg.find(blk => blk.id == 2) && blocks.find(blk => blk.id == 2 && blk.occupied == false) && sugg.find(blk => blk.id == 1) && sugg.find(blk => blk.id == 3)) {
   botPlay(2);
  } else if (!sugg.find(blk => blk.id == 3) && blocks.find(blk => blk.id == 3 && blk.occupied == false) && sugg.find(blk => blk.id == 1) && sugg.find(blk => blk.id == 2)) {
   botPlay(3);
  } else if (!sugg.find(blk => blk.id == 4) && blocks.find(blk => blk.id == 4 && blk.occupied == false) && sugg.find(blk => blk.id == 5) && sugg.find(blk => blk.id == 6)) {
   botPlay(4);
  } else if (!sugg.find(blk => blk.id == 5) && blocks.find(blk => blk.id == 5 && blk.occupied == false) && sugg.find(blk => blk.id == 4) && sugg.find(blk => blk.id == 6)) {
   botPlay(5);
  } else if (!sugg.find(blk => blk.id == 6) && blocks.find(blk => blk.id == 6 && blk.occupied == false) && sugg.find(blk => blk.id == 5) && sugg.find(blk => blk.id == 4)) {
   botPlay(6);
  } else if (!sugg.find(blk => blk.id == 7) && blocks.find(blk => blk.id == 7 && blk.occupied == false) && sugg.find(blk => blk.id == 8) && sugg.find(blk => blk.id == 9)) {
   botPlay(7);
  } else if (!sugg.find(blk => blk.id == 8) && blocks.find(blk => blk.id == 8 && blk.occupied == false) && sugg.find(blk => blk.id == 7) && sugg.find(blk => blk.id == 9)) {
   botPlay(8);
   
  } else if (!sugg.find(blk => blk.id == 9) && blocks.find(blk => blk.id == 9 && blk.occupied == false) && sugg.find(blk => blk.id == 7) && sugg.find(blk => blk.id == 8)) {
   botPlay(9);
   
  } else if (!sugg.find(blk => blk.id == 1) && blocks.find(blk => blk.id == 1 && blk.occupied == false) && sugg.find(blk => blk.id == 4) && sugg.find(blk => blk.id == 7)) {
   botPlay(1);
   
  } else if (!sugg.find(blk => blk.id == 4) && blocks.find(blk => blk.id == 4 && blk.occupied == false) && sugg.find(blk => blk.id == 1) && sugg.find(blk => blk.id == 7)) {
   botPlay(4);
   
  } else if (!sugg.find(blk => blk.id == 7) && blocks.find(blk => blk.id == 7 && blk.occupied == false) && sugg.find(blk => blk.id == 1) && sugg.find(blk => blk.id == 4)) {
   botPlay(7);
   
  } else if (!sugg.find(blk => blk.id == 2) && blocks.find(blk => blk.id == 2 && blk.occupied == false) && sugg.find(blk => blk.id == 5) && sugg.find(blk => blk.id == 8)) {

   botPlay(2);
   
  } else if (!sugg.find(blk => blk.id == 5) && blocks.find(blk => blk.id == 5 && blk.occupied == false) && sugg.find(blk => blk.id == 2) && sugg.find(blk => blk.id == 8)) {
   botPlay(5);
   
  } else if (!sugg.find(blk => blk.id == 8) && blocks.find(blk => blk.id == 8 && blk.occupied == false) && sugg.find(blk => blk.id == 2) && sugg.find(blk => blk.id == 5)) {
   botPlay(8);
   
  } else if (!sugg.find(blk => blk.id == 3) && blocks.find(blk => blk.id == 3 && blk.occupied == false) && sugg.find(blk => blk.id == 6) && sugg.find(blk => blk.id == 9)) {
   botPlay(3);
   
  } else if (!sugg.find(blk => blk.id == 6) && blocks.find(blk => blk.id == 6 && blk.occupied == false) && sugg.find(blk => blk.id == 3) && sugg.find(blk => blk.id == 9)) {
   botPlay(6);
   
  } else if (!sugg.find(blk => blk.id == 9) && blocks.find(blk => blk.id == 9 && blk.occupied == false) && sugg.find(blk => blk.id == 3) && sugg.find(blk => blk.id == 6)) {
   botPlay(9);
   ;
  } else if (!sugg.find(blk => blk.id == 1) && blocks.find(blk => blk.id == 1 && blk.occupied == false) && sugg.find(blk => blk.id == 5) && sugg.find(blk => blk.id == 9)) {
   botPlay(1);

  } else if (!sugg.find(blk => blk.id == 5) && blocks.find(blk => blk.id == 5 && blk.occupied == false) && sugg.find(blk => blk.id == 1) && sugg.find(blk => blk.id == 9)) {

   botPlay(5)

  } else if (!sugg.find(blk => blk.id == 9) && blocks.find(blk => blk.id == 9 && blk.occupied == false) && sugg.find(blk => blk.id == 1) && sugg.find(blk => blk.id == 5)) {
   botPlay(9);

  } else if (!sugg.find(blk => blk.id == 3) && blocks.find(blk => blk.id == 3 && blk.occupied == false) && sugg.find(blk => blk.id == 5) && sugg.find(blk => blk.id == 7)) {
   botPlay(3);
   
  } else if (!sugg.find(blk => blk.id == 5) && blocks.find(blk => blk.id == 5 && blk.occupied == false) && sugg.find(blk => blk.id == 3) && sugg.find(blk => blk.id == 7)) {
   
   botPlay(5)


  } else if (!sugg.find(blk => blk.id == 7) && blocks.find(blk => blk.id == 7 && blk.occupied == false) && sugg.find(blk => blk.id == 3) && sugg.find(blk => blk.id == 5)) {
   botPlay(7);
   ;
  } else {
   if (flip == undefined) {
    let fp = true;
    findABox(fp);
   } else {
    randomPlay();
   }
  }
 } else {
  randomPlay();
 }
}


//select a random non occupied block
function randomPlay() {
 let occ = blocks.filter(block => block.occupied == false);
 rnd = Math.floor(Math.random() * occ.length);
 rnd = occ[rnd].id;
 let track = blocks.find(block => block.id == rnd);
 if (track.occupied == false) {
  botPlay(rnd);
 }
}



/*
 * tell the bot which block to play if block is occupied play at any random free block
 * 
 */
function botPlay(play) {

 let blk = blocks.find(block => block.id == play && block.occupied == false);

 if (blk) {
  blk.block.innerHTML = '<div>' + nxtPlyTracker + '</div>';


  blk.occupied = true;

  let match = searchMatch(nxtPlyTracker);

  if (match) botReady = false;

  allowTap = true;

  if (nxtPlyTracker == player1) {
   nxtPlyTracker = player2;
  } else {
   nxtPlyTracker = player1
  }

  switchActivePlayer();

 } else {
  alert('rrp' + ' ' + play)
  randomPlay();
 }

}





restartBtn.addEventListener('click', function() {
 Swal.fire({
  title: 'Restart Game',
  icon: 'question',
  customClass: 'swal',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Restart',
  reverseButtons: true,
 }).then((result) => {
  if (result.isConfirmed) {
   allowTap = true;
   for (let blk of blocks) {
    blk.occupied = false;
    blk.block.innerHTML = '';
   }
   draft = [];
   historyBlocks = [];
   nxtPlyTracker = ogPlayer;
   if (you !== undefined) {
    if (you == ogPlayer) {
     $('#player1').addClass('active');
     $('#player2').removeClass('active');
    } else {
     allowTap = false;
     $('#player1').removeClass('active');
     $('#player2').addClass('active');
     setTimeout(function() {
      bot();
     }, 90)
    }
   }
  }
 })

})

$('#quitBtn').click(function() {
 Swal.fire({
  icon: 'warning',
  title: 'Are you sure?',
  confirmButtonText: 'Quit',
  customClass: 'swal',
  showCancelButton: true,
  reverseButtons: true,
 }).then(result => {
  if (result.isConfirmed) {
  if(botMode){
  feedBack();
  } else {
    quit(); 
  }
  }
 })
})

function quit() {
 player1Score = 0;
 player2Score = 0;
 $('#player1Score').text(player1Score);
 $('#player2Score').text(player2Score);
 botMode = false;
 blocks = [];
 historyBlocks = [];
 draft = [];
 nxtPlyTracker = null;
 you = undefined;
 grid.innerHTML = "";
 $('ul.tabs').tabs('select_tab', 'tab1');

 $('#tab1').removeClass('hide');
}

function feedBack() {
Swal.fire({
 title: 'BOT~',
 text: 'Do yo like the game 🤔',
 showCancelButton: true,
 reverseButtons: true,
 confirmButtonText: 'Yes I do',
 cancelButtonText: 'Nope',
 allowOutsideClick: false
}).then(result => {
 if(result.isConfirmed) {
  Swal.fire( {
   title: 'BOT~',
   text: 'Thanks For Playing! 😊...',
  })
  quit();
 } else {
  quit();
 }
})
}


var playBtn = $('#playBtn');

   playBtn.click(function() {

    $('ul.tabs').tabs('select_tab', 'tab2');

    $('#tab2').removeClass('hide');

   })
