document.addEventListener('DOMContentLoaded', function(){
  fetchMovies()
})

function fetchMovies(){
  fetch('http://localhost:3000/api/v1/movies')
    .then(response => response.json())
    .then(data => data.forEach(renderAll))
}

function renderAll(movie){
  let movieContainer = document.getElementById('movie-container')
  movieContainer.classList.add('movieCard')
  let divElement = document.createElement('div')
  divElement.id = `${movie.name}-${movie.id}`
  movieContainer.appendChild(divElement)
  let movieName = document.createElement('button')
  movieName.classList.add('button')
  movieName.innerText = movie.name
  divElement.appendChild(movieName)
  movieName.addEventListener('click', fetchCharacters)
}

function fetchCharacters(event){
  movieId = Number(event.target.parentElement.id.split('-')[1])
  movieName = event.target.parentElement.id.split('-')[0]
  fetch('http://localhost:3000/api/v1/characters/')
    .then(response => response.json())
    .then(data => {
      movieCharacters = data.filter(character => character.movie_id === movieId)
      renderCharacters(movieCharacters, movieName, movieId)
    })
}

function renderCharacters(movieCharacters, movieName, movieId){
  let characterContainer = document.getElementById('show-character-container')
  characterContainer.classList.add('showCharacter')
  characterContainer.innerHTML = ""
  let addCharacterButton = document.createElement('button')
  addCharacterButton.innerText = 'Add a new character!'
  addCharacterButton.addEventListener('click', () => {showForm(movieName, movieId)})
  let movieHeader = document.createElement('h1')
  movieHeader.classList.add('movieName')
  movieHeader.innerText = `${movieName} Characters`
  characterContainer.append(movieHeader, addCharacterButton)

  movieCharacters.forEach(character => {
    let divElement = document.createElement('div')
    divElement.classList.add('characterCard')
    characterContainer.appendChild(divElement)
    let image = document.createElement('img')
    image.src = character.image_url
    divElement.appendChild(image)
    let name = document.createElement('h3')
    name.innerText = character.name
    name.classList.add('name')
    let showCharacterButton = document.createElement('button')
    showCharacterButton.innerText = "Character Information"
    showCharacterButton.addEventListener('click', (event)=>{
      showCharacterDetails(event, character)
    })
    divElement.append(name, showCharacterButton)
  })
}

function showForm(movieName, movieId){
  let characterContainer = document.getElementById('show-character-container')
  characterContainer.innerHTML = ""
  let formHeader = document.createElement('h2')
  formHeader.innerText = `Add a character for ${movieName} here!`
  let addCharacterForm = document.createElement('form')
  addCharacterForm.addEventListener('submit', (event)=>{ addNewCharacter(event, movieId) })
  let nameInput = document.createElement('input')
  nameInput.placeholder = "Character Name"
  let imageInput = document.createElement('input')
  imageInput.placeholder = "Image Url"
  let descInput = document.createElement('input')
  descInput.placeholder = "Character Description"
  let quoteInput = document.createElement('input')
  quoteInput.placeholder = "Character Quote"
  let abilitiesInput = document.createElement('input')
  abilitiesInput.placeholder = "Character Abilities"
  let speciesInput = document.createElement('input')
  speciesInput.placeholder = "Character Species"
  let personalityInput = document.createElement('input')
  personalityInput.placeholder = "Character Personality"
  let submitButton = document.createElement('input')
  submitButton.type = 'submit'

  addCharacterForm.append(nameInput, imageInput, descInput, quoteInput, abilitiesInput, speciesInput, personalityInput, submitButton)

  characterContainer.append(formHeader, addCharacterForm)
}

function addNewCharacter(event, movieId){
  event.preventDefault();
  let inputFields = event.target.querySelectorAll('input')
  name = inputFields[0].value
  image_url = inputFields[1].value
  description = inputFields[2].value
  quote = inputFields[3].value
  abilities = inputFields[4].value
  species = inputFields[5].value
  personality = inputFields[6].value
  data = {
    name: name,
    image_url: image_url,
    likes: 0,
    description: description,
    movie_id: movieId,
    quote: quote,
    abilities: abilities,
    species: species,
    personality: personality
  }
  // debugger;
  fetch('http://localhost:3000/api/v1/characters',{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({character: data})
  }).then(response => response.json()).then(data => showAddMessage(data))
}

function showAddMessage(data){
  let characterContainer = document.getElementById('show-character-container')
  characterContainer.innerHTML = ""
  let characterAddedMessage = document.createElement('h1')
  characterAddedMessage.innerText = `The character ${data.name} has been added!`
  characterContainer.appendChild(characterAddedMessage)
}

function showCharacterDetails(event, character){
  let characterContainer = document.getElementById('show-character-container')
  characterContainer.innerHTML = ""
  let characterName = document.createElement('h1')
  characterName.innerText = character.name
  let characterImage = document.createElement('img')
  characterImage.src = character.image_url
  let characterLikes = document.createElement('button')
  characterLikes.innerText = `${character.likes} Likes`
  characterLikes.addEventListener('click', addLikes)
  let characterQuote = document.createElement('h3')
  characterQuote.innerText = `"${character.quote}"`
  let characterAbilities = document.createElement('h4')
  characterAbilities.innerText = `Abilities: ${character.abilities}`
  let characterSpecies = document.createElement('h4')
  characterSpecies.innerText = `Species: ${character.species}`
  let characterDescription = document.createElement('p')
  characterDescription.innerText = `Description: ${character.description}`
  let characterPersonality = document.createElement('p')
  characterPersonality.innerText = `Personality: ${character.personality}`
  let characterDeleteButton = document.createElement('button')
 characterDeleteButton.innerText = "Delete this character"
 characterDeleteButton.addEventListener('click', (event) => deleteCharacter(event, character))

  characterContainer.append(characterName, characterImage, characterLikes, characterQuote, characterAbilities, characterSpecies, characterDescription, characterPersonality, characterDeleteButton)
}

function addLikes(event){
    let id = (event.target.parentElement.id)
    let likes = (event.target.parentElement.childNodes[2])
    let onlyNum = parseInt(likes.innerText.split(' ')[0])
    onlyNum++
    likes.innerText = `${onlyNum} Likes`
    postLikes(id, onlyNum)
}

function postLikes(id, onlyNum){
fetch(`http://localhost:3000/api/v1/characters/${id}`,{
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({likes: onlyNum})
})
.then(response => response.json())
.then(data => console.log(data))

}

function deleteCharacter(event, character){
  fetch(`http://localhost:3000/api/v1/characters/${character.id}`, {
    method: "DELETE"
  }).then(response => response.json())
  .then(data => deleteFromDOM(data))

}

function deleteFromDOM(data){
  let characterContainer = document.getElementById('show-character-container')
  characterContainer.innerHTML = ""
  let deleteMessage = document.createElement('h1')
  deleteMessage.innerText = `${data.name} has been deleted`
  characterContainer.appendChild(deleteMessage)

}
