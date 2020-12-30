let blackjackGameDatabase = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11] },
    'win': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};
const YOU = blackjackGameDatabase['you'];
const DEALER = blackjackGameDatabase['dealer'];

const hitSound = new Audio('../UTILITIES/sounds/hit.m4a')
const winSound = new Audio('../UTILITIES/sounds/win.mp3')
const loseSound = new Audio('../UTILITIES/sounds/lose.mp3')

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackGameDatabase['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}
function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGameDatabase['cards'][randomIndex];
}
function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `../UTILITIES/images/${card}.png`;
        
        var x = window.matchMedia("(max-width: 944px)")
        myFunction(x)
        x.addListener(myFunction)
        function myFunction(x) {
            if (x.matches) { 
                cardImage.style.height = '70px'
                cardImage.style.width = '50px'
                cardImage.style.padding = '10px'
            } else {
                cardImage.style.padding = '10px'
                cardImage.style.height = '150px'
                cardImage.style.width = '120px'
            }
        }
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}
function blackjackDeal() {
    if (blackjackGameDatabase['turnsOver'] === true) {
        blackjackGameDatabase['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        console.log(yourImages);
        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGameDatabase['turnsOver'] = true;
    }
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
        if (activePlayer['score'] + blackjackGameDatabase['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGameDatabase['cardsMap'][card][1];
        }
        else {
            activePlayer['score'] += blackjackGameDatabase['cardsMap'][card][0];
        }
    }
    else {
        activePlayer['score'] += blackjackGameDatabase['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = "BURST!";
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function dealerLogic() {
    blackjackGameDatabase['isStand'] = true;
    while (DEALER['score'] < 16 && blackjackGameDatabase['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(500);
    }

    blackjackGameDatabase['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

function computeWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackGameDatabase['win']++;
            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
            blackjackGameDatabase['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score']) {
            blackjackGameDatabase['draws']++;
        }
        else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
            blackjackGameDatabase['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] > 21 && DEALER['score'] > 21) {
            blackjackGameDatabase['draws']++;
        }
    }
    console.log(blackjackGameDatabase);
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGameDatabase['turnsOver'] === true) {

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGameDatabase['win'];
            message = "You Won !";
            messageColor = "green";
            winSound.play();
        }
        else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGameDatabase['losses'];
            message = "You Lost !";
            messageColor = "red";
            loseSound.play();
        }
        else {
            document.querySelector('#draws').textContent = blackjackGameDatabase['draws'];
            message = "You Drew !";
            messageColor = "yellow";
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}