document.addEventListener('DOMContentLoaded', function(){
  fetchMovies()
})

function fetchMovies(){
  let characterContainer = document.getElementById('show-character-container')
  characterContainer.classList.add('showCharacter')
  let welcomeHeader = document.createElement('h1')
  welcomeHeader.classList.add('header')
  welcomeHeader.innerText = "Welcome to the Studio Ghibli Fan Page!"
  characterContainer.append(welcomeHeader)
  fetch('http://localhost:3000/api/v1/movies')
    .then(response => response.json())
    .then(data => {
      data.forEach(renderAll)
    })
}

function renderAll(movie){
  let characterContainer = document.getElementById('show-character-container')
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
  let title = document.getElementById('window')
  title.classList.add('window')
  characterContainer.classList.add('showCharacter')
  characterContainer.innerHTML = ""
  let addCharacterButton = document.createElement('button')
  addCharacterButton.classList.add('createNewBut')
  addCharacterButton.innerText = 'Add a new character!'
  addCharacterButton.addEventListener('click', () => {showForm(movieName, movieId)})
  let movieHeader = document.createElement('h1')
  movieHeader.classList.add('characterTitle')
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
    showCharacterButton.classList.add('characterBut')
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
  addCharacterForm.classList.add('new-form')
  addCharacterForm.addEventListener('submit', (event)=>{ addNewCharacter(event, movieId) })
  let nameInput = document.createElement('input')
  nameInput.placeholder = "Character Name"
  nameInput.classList.add('input-field')
  let imageInput = document.createElement('input')
  imageInput.placeholder = "Image Url"
  imageInput.classList.add('input-field')
  let descInput = document.createElement('input')
  descInput.placeholder = "Character Description"
  descInput.classList.add('input-field')
  let quoteInput = document.createElement('input')
  quoteInput.placeholder = "Character Quote"
  quoteInput.classList.add('input-field')
  let abilitiesInput = document.createElement('input')
  abilitiesInput.placeholder = "Character Abilities"
  abilitiesInput.classList.add('input-field')
  let speciesInput = document.createElement('input')
  speciesInput.placeholder = "Character Species"
  speciesInput.classList.add('input-field')
  let personalityInput = document.createElement('input')
  personalityInput.placeholder = "Character Personality"
  personalityInput.classList.add('input-field')
  let submitButton = document.createElement('input')
  submitButton.type = 'submit'
  submitButton.classList.add('input-field')

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
  characterContainer.dataset.characterId = character.id
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

  //Comments
  let commentsDiv = document.createElement('div')
  commentsDiv.id = `comments-for-${character.id}`

  let characterDeleteButton = document.createElement('button')
 characterDeleteButton.innerText = "Delete this character"
 characterDeleteButton.addEventListener('click', (event) => deleteCharacter(event, character))

  characterContainer.append(characterName, characterImage, characterLikes, characterQuote, characterAbilities, characterSpecies, characterDescription, characterPersonality, characterDeleteButton, commentsDiv)

  fetchComments(character)
}

function fetchComments(character){
  let characterId = character.id
  fetch('http://localhost:3000/api/v1/comments')
    .then(response => response.json())
    .then(data => renderComments(data, characterId))
}

function renderComments(data, characterId){
  let commentsDiv = document.getElementById(`comments-for-${characterId}`)
  let commentsHeading = document.createElement('h3')
  commentsHeading.innerText = 'Comments: '
  commentsDiv.append(commentsHeading)
  let commentsList = document.createElement('ul')
  myComments = data.filter(comment => comment.character_id === characterId)
  myComments.forEach(comment =>{
    let commentItem = document.createElement('li')
    let commentUsername = document.createElement('h5')
    let commentContent = document.createElement('p')
    commentUsername.innerText = comment.username
    commentContent.innerText = comment.content
    commentItem.append(commentUsername, commentContent)
    commentsList.appendChild(commentItem)
    commentsDiv.appendChild(commentsList)
  })
  let commentButton = document.createElement('button')
  commentButton.innerText = 'Add a new comment!'
  commentButton.addEventListener('click', ()=>showCommentForm(characterId))
  commentsDiv.append(commentButton)
}

function addLikes(event){
    let id = (event.target.parentElement.dataset.characterId)
    let likes = (event.target.parentElement.childNodes[2])
    let onlyNum = parseInt(likes.innerText.split(' ')[0])
    onlyNum++
    likes.innerText = `${onlyNum} Likes`
    postLikes(id, onlyNum)
}

function postLikes(id, onlyNum){
  fetch(`http://localhost:3000/api/v1/characters/${id}`,{
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
  	"Accept": "application/json"
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

function showCommentForm(characterId){
  let characterContainer = document.getElementById('show-character-container')
  characterContainer.innerHTML = ""
  let commentFormHeader = document.createElement('h3')
  commentFormHeader.innerText = "Add a Comment Here"
  let commentForm = document.createElement('form')
  commentForm.id = `comment-for-${characterId}`
  commentForm.classList.add('new-form')
  let usernameInput = document.createElement('input')
  usernameInput.classList.add('input-field')
  usernameInput.placeholder = 'Username'
  let contentInput = document.createElement('textarea')
  contentInput.classList.add('input-field')
  contentInput.placeholder = 'comment'
  let commentSubmit = document.createElement('input')
  commentSubmit.classList.add('input-field')
  commentSubmit.type = 'submit'

  commentForm.append(usernameInput, contentInput, commentSubmit)

  commentForm.addEventListener('submit', (event)=> addComment(event, characterId))

  characterContainer.append(commentFormHeader, commentForm)
}

function addComment(event, characterId){
  event.preventDefault()
  let form = document.getElementById(`comment-for-${characterId}`)
  username = form.querySelectorAll('input')[0].value
  content = form.querySelector('textarea').value
  data = {
    character_id: characterId,
    content: content,
    username: username
  }
  fetch('http://localhost:3000/api/v1/comments', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({comment: data})
  }).then(response => response.json())
  .then(data => showCommentAddedMessage(data))
}

function showCommentAddedMessage(data){
  let characterContainer = document.getElementById('show-character-container')
  characterContainer.innerHTML = ""
  let commentMessage = document.createElement('h1')
  commentMessage.innerText = 'Your comment has been added!'
  characterContainer.appendChild(commentMessage)
}
