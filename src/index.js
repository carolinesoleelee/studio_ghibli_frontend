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
  let divElement = document.createElement('div')
  divElement.id = `${movie.name}-${movie.id}`
  movieContainer.appendChild(divElement)
  let movieName = document.createElement('button')
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
      renderCharacters(movieCharacters, movieName)
    })
}

function renderCharacters(movieCharacters, movieName){
  let characterContainer = document.getElementById('show-character-container')
  characterContainer.innerHTML = ""
  let movieHeader = document.createElement('h1')
  movieHeader.innerText = `${movieName} Characters`
  characterContainer.appendChild(movieHeader)

  movieCharacters.forEach(character => {
    let divElement = document.createElement('div')
    divElement.classList.add('card')
    characterContainer.appendChild(divElement)
    let image = document.createElement('img')
    image.src = character.image_url
    divElement.appendChild(image)
  })
}
