const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const dataPanel = document.querySelector('#data-panel')
const favList = JSON.parse(localStorage.getItem('FavoriteMovies'))


//Render Movie List
//畫面初始
RenderMovieList(favList)

function RenderMovieList(data){
    let rawHtml = ''
    data.forEach((item) =>{
        //title, image
        rawHtml += `
        <div class="col-sm-3">
            <div class="mb-2">
                <div class="card">
                    <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-danger btn-remove" data-id="${item.id}">x</button>
                    </div>
                </div>
            </div>
        </div>    
        `
    })
    dataPanel.innerHTML = rawHtml
}


//Movie Modal
showMovieModal=(id) =>{
    const movieTitle = document.querySelector('#movie-modal-title')
    const movieImage = document.querySelector('#movie-modal-image')
    const movieDate = document.querySelector('#movie-modal-date')
    const movieDescription = document.querySelector('#movie-modal-description')

    axios.get(INDEX_URL + id ).then(response =>{
        // console.log(response)
        const data = response.data.results
        console.log(data)
        movieTitle.innerText = data.title
        movieDate.innerText = `Release Date: ${data.release_date}`
        movieDescription.innerText = data.description
        movieImage.innerHTML = `
        <img src="${POSTER_URL+data.image}" class="img-fluid" alt="movie-poster">
        `
    })
}


//Remove From Favorite List
removeFromFav=(id) =>{
    if(!favList) return

    const movieIndex = favList.findIndex((movie) => movie.id === id)
    // console.log(movieIndex)
    if(movieIndex === -1) return

    favList.splice(movieIndex,1)
    console.log(favList)
    localStorage.setItem('FavoriteMovies',JSON.stringify(favList))
    RenderMovieList(favList)
}



dataPanel.addEventListener('click',function onPanelClick(event){
    if(event.target.matches('.btn-show-movie')){
        // console.log(event.target.dataset)
        showMovieModal(Number(event.target.dataset.id))
    }else if(event.target.matches('.btn-remove')){
        removeFromFav(Number(event.target.dataset.id))
    }
})





