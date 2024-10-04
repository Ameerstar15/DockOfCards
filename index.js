async function createDeck() {
  let response = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2"
  );
  let rawData = await response.json();
  deckId = await rawData.deck_id;
  console.dir(deckId);
  return deckId;
}

async function getCard() {
  console.log(deckId);
  let response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  );
  let rawData = await response.json();
  console.dir(rawData); // Log the raw API response for debugging

  return {
    card1_image: rawData.cards[0].image,
    card1_value: rawData.cards[0].value,
    card2_image: rawData.cards[1].image,
    card2_value: rawData.cards[1].value,
  };
}

const START = document.querySelector("#start-game");
const RESET = document.querySelector("#reset-game");
const PLAYER1 = document.querySelector("#player1-draw");
const PLAYER2 = document.querySelector("#player2-draw");

const PLAYER1_CARDS = document.querySelector("#player1-cards");
const PLAYER2_CARDS = document.querySelector("#player2-cards");

let deckId;
let player1Score = 0;
let player2Score = 0;
let cardsContainer;

START.addEventListener("click", startGame);
RESET.addEventListener("click", resetGame);
PLAYER1.addEventListener("click", drawCard);
PLAYER2.addEventListener("click", drawCard);

async function resetGame() {
  player1Score = 0;
  player2Score = 0;
  document.querySelector("#player1-score").textContent = "Score: 0";
  document.querySelector("#player2-score").textContent = "Score: 0";

  // Clear the card containers for both players
  document.querySelector("#player1-cards").innerHTML = "";
  document.querySelector("#player2-cards").innerHTML = "";

  await createDeck();
}

async function startGame() {
  await createDeck();
}

async function drawCard(player) {
  let cards = await getCard();
  console.dir(cards);
  if (["QUEEN", "KING", "JACK", "ACE"].includes(cards.card1_value)) {
    console.dir(cards.card1_value);
    cards.card1_value = 10;
    console.dir(cards.card1_value);
  }
  if (["ACE", "QUEEN", "KING", "JACK"].includes(cards.card2_value)) {
    cards.card2_value = 10;
  }

  if (player.target == PLAYER1) {
    console.dir(
      parseInt(cards.card1_value) + " - " + parseInt(cards.card2_value)
    );
    player1Score += parseInt(cards.card1_value) + parseInt(cards.card2_value);
    console.dir(player1Score);
    document.querySelector("#player1-score").textContent =
      "Score: " + player1Score;
  } else if (player.target == PLAYER2) {
    player2Score += parseInt(cards.card1_value) + parseInt(cards.card2_value);
    document.querySelector("#player2-score").textContent =
      "Score: " + player2Score;
    console.dir(player2Score);
  }

  displayCards(cards, player);
}

function displayCards(cards, player) {
  // Determine which player's card container to use
  if (player.target.id === "player1-draw") {
    cardsContainer = document.querySelector("#player1-cards");
  } else if (player.target.id === "player2-draw") {
    cardsContainer = document.querySelector("#player2-cards");
  }

  // Clear the current cards displayed
  cardsContainer.innerHTML = "";

  // Create new card elements
  const card1 = document.createElement("div");
  const card2 = document.createElement("div");

  // Set the card images
  card1.classList.add("card");
  card1.style.backgroundImage = `url(${cards.card1_image})`;

  card2.classList.add("card");
  card2.style.backgroundImage = `url(${cards.card2_image})`;

  // Append the cards to the correct container
  cardsContainer.appendChild(card1);
  cardsContainer.appendChild(card2);
}
