const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const movies = []
let filterMovies = []
const dataPanel = document.querySelector('#data-panel')
const MOVIE_PER_PAGE = 12
const paginator  = document.querySelector('#paginator')

//Render Movie List
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
                        <button class="btn btn-info btn-add-fav" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
        </div>    
        `
    })
    dataPanel.innerHTML = rawHtml
}

//Get Movies By Page 分割出每頁顯示的電影數。綁定頁面點擊事件，傳入點擊的li的data-page
getMoviesByPage=(page) =>{
    const data = filterMovies.length ? filterMovies : movies  //若有搜尋就回傳搜尋結果
    const startIndex = (page - 1) * MOVIE_PER_PAGE
    return movies.slice(startIndex, startIndex + MOVIE_PER_PAGE)
}

//Render Paginator 將傳入的電影數量分割多頁
renderPaginator=(amount) =>{
    const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGE)
    let rawHTML = ''

    for(i=1;i<=numberOfPages;i++){
        rawHTML += `
        <li class="page-item"><a class="page-link" href="#" data-page=${i}>${i}</a></li>
        `
    }
    paginator.innerHTML = rawHTML
}

//畫面初始
axios.get(INDEX_URL).then(response =>{
    // console.log(response.data.results)
    movies.push(...response.data.results)
    // console.log(movies)
    renderPaginator(movies.length)
    RenderMovieList(getMoviesByPage(1))
})


//Paginator Click  頁面點擊
paginator.addEventListener('click',onPageClick=(e) =>{
    if(e.target.tagName === 'A'){
        // console.log(e.target.dataset.page)
        const pageClick = Number(e.target.dataset.page)
        RenderMovieList(getMoviesByPage(pageClick))
    }
})



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

//Add To Favorite
addToFavorite=(id) =>{
    const favList = JSON.parse(localStorage.getItem('FavoriteMovies')) || []
    const favMovie = movies.find((movie) => movie.id === id)
    

    // if(favList.some((movie) => movie.id === id)){
    //     return alert('此電影已收藏在最愛')
    // }

    favList.push(favMovie)
    console.log(favList)
    localStorage.setItem('FavoriteMovies',JSON.stringify(favList))
}

//顯示movie modal與加入最愛點擊事件
dataPanel.addEventListener('click',function onPanelClick(event){
    if(event.target.matches('.btn-show-movie')){
        // console.log(event.target.dataset)
        showMovieModal(Number(event.target.dataset.id))
    }else if(event.target.matches('.btn-add-fav')){
        // console.log(event.target.dataset)
        addToFavorite(Number(event.target.dataset.id))
    }
})


//search bar
searchForm.addEventListener('submit',onFormSubmitted=(e) =>{
    e.preventDefault()    
    // console.log(searchInput.value)
    const keyword = searchInput.value.trim().toLowerCase()

    // let filterMovies = []
    // for(const movie of movies){
    //     if(movie.title.toLowerCase().includes(keyword)){
    //         filterMovies.push(movie)
    //         RenderMovieList(filterMovies)
    //     }
    // }

    filterMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(keyword)
    )
    if(filterMovies.length === 0){
        alert(`Sorry, we can't find the results suits "${keyword}"`)
    }

    renderPaginator(filterMovies.length)
    RenderMovieList(filterMovies)
    searchInput.value = ''
})


//Search Bar Keyup Event
// searchInput.addEventListener('keyup',onFormSubmitted=(e) =>{
//     // console.log(searchInput.value)
//     const keyword = searchInput.value.trim().toLowerCase()

//     filterMovies = movies.filter(function(movie){
//         return movie.title.toLowerCase().includes(keyword)
//     })
//     // console.log(filterMovies)
//     RenderMovieList(filterMovies)
// })




