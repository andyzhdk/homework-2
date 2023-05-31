// initial array for all the pokemon
let pokemonList = [];
// instance of colorthief to obtain colors
const colorThief = new ColorThief();

//load all pokemon
window.addEventListener("load", function () {
  getPokemon();
});

// update displayed pokemons with search query
search.addEventListener("input", function (evt) {
  filterPokemon(this.value), typing.play();
});

// audio effects
const button = new Audio("assets/sounds/button.mp3");
const typing = new Audio("assets/sounds/typing.mp3");
typing.volume = 0.4;
button.volume = 0.6;

// pokeAPI related

// API request to get 151 kanto region pokemon
async function getPokemon() {
  try {
    console.log("Request started...");
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const result = await response.json();
    console.log("Fetch success");
    let index = 1;
    for (let pokemon of result.results) {
      buildPokemonObject(pokemon, index);
      index++;
    }
    displayPokemon(pokemonList);
  } catch (error) {
    console.log(`Fetch error: ${error.name}`);
  }
}

async function buildPokemonObject(pokemon, id) {
  pokemonList.push({
    id: id,
    name: pokemon.name,
    image: `assets/pokemon/static/${id}.png`,
    animated: `assets/pokemon/animated/${id}.gif`,
  });
  filteredPokemonList = pokemonList;
}

// Part of this code was taken from the lesson (pizza example)
function displayPokemon(list) {
  const wrapper = document.querySelector('[data-js="pokemon-wrapper"]');
  wrapper.innerHTML = "";
  for (let pokemon of list) {
    const item = document.createElement("li");
    item.classList.add("pokemon-card");
    item.dataset.js = "pokemon";
    item.innerHTML = populateList(pokemon);
    wrapper.appendChild(item);
  }
}

async function displayDetails(pokemon_id) {
  button.play();
  // Get pokemon object corresponding to ID
  let pokemon = pokemonList.find((x) => x.id === pokemon_id);
  // Get specific pokemon details and display a detailed card
  try {
    console.log("Request started...");
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
    );
    const result = await response.json();
    console.log("Fetch success");
    // Retrieve required elements
    const detail_card = document.getElementById("pokemon-details");
    const dimmer = document.getElementById("dimmer");
    const close = document.getElementById("close-popup");
    const img = document.getElementById(`image-${pokemon.id}`);
    // Query for most prominent color of image for popup background
    const colorResult = colorThief.getColor(img);
    // Popup and dimmer animations/content
    detail_card.classList.add("slide-in");
    detail_card.style.backgroundColor = `rgb(${colorResult[0]}, ${colorResult[1]}, ${colorResult[2]})`;
    setTimeout(() => {
      dimmer.style.opacity = 1;
    }, 180);
    dimmer.style.zIndex = 1;
    close.style.zIndex = 3;
    close.style.opacity = 1;
    detail_card.innerHTML = populateDetails(pokemon, result.types);
  } catch (error) {
    console.log(`Fetch error: ${error.name}`);
  }
}

function closePopup() {
  button.play();
  // Retrieve required elements
  const detail_card = document.getElementById("pokemon-details");
  const dimmer = document.getElementById("dimmer");
  const close = document.getElementById("close-popup");
  // Popup and dimmer animations/content
  detail_card.classList.remove("slide-in");
  setTimeout(() => {
    dimmer.style.zIndex = -1;
  }, 180);
  dimmer.style.opacity = 0;
  close.style.zIndex = -1;
  close.style.opacity = 0;
}

function filterPokemon(query) {
  const filteredPokemonList = pokemonList.filter((val) =>
    val.name.includes(query)
  );
  console.log(filteredPokemonList);
  displayPokemon(filteredPokemonList);
}

// Populate template code was taken from the lesson (pizza example) and expanded upon
function populateList(pokemon) {
  const template = `
      <div class="clickable-card" onClick="displayDetails(${pokemon.id})" >
      <div class="pokemon-name">${pokemon.name}</span>
      <img class="pokemon-image" id="image-${pokemon.id}" src="${pokemon.image}"/>
      </div>
    `;
  return template;
}

function populateDetails(pokemon, pokemon_details) {
  const types = [];

  for (let details of pokemon_details) {
    types.push(`<div class="detail-type">${details.type.name}</div>`);
  }

  const details = `
      <div class="detail-header-frame">
        <div class="pokemon-name">${pokemon.name}</span>
        <div class="pokemon-tag">#${pokemon.id}</div>
      </div>
      <div class="detail-image-frame">
        <img class="detail-image" src="${pokemon.animated}"/>
      </div>
      ${types.join("")}
    `;
  return details;
}
