import { movieList } from './movies';

export default class App {
    constructor() {
        this.listToBeDisplayed = null;
        this.searchElem = document.getElementById('searchInput');
        this.rootElem = document.getElementById('root');
        this.sortByTitle = document.getElementById('sortTitle');
        this.sortByYear = document.getElementById('sortYear');
        this.toaster = document.getElementById('toaster');
        this.addMovieElem = document.getElementById('addMovie');
        this.modal = document.getElementById("myModal");
        this.cancelBtn = document.getElementsByClassName("close")[0];

    }
    generateList(list) {
        this.listToBeDisplayed = list;
        let html = ''
        if (list.length === 0) {
            html = "<h3 class='no-result-found'>No Result Found<h3>"
        } else {
            html = list.map(function (v, i) {
                return `<div class="thumbnail">
            <a href="javascript:void(0);">
                <img class="img-responsive lazy-img"  data-src="${v.posterurl}" alt="" />
                <div class="overlay-thumbnail">
                    <div class="overlay-deletebtn">
                             <button class="delete-btn" data-title="${v.title}">
                              Delete
                             </button>
                    </div>
                </div>
                <div class="movi-desc">
                        <span class="desc-left">${v.title}</span>
                        <span class="desc-right">${v.year}</span>
                    </div>
            </a>
        </div> `
            }).join('');
        }
        this.rootElem.innerHTML = html;
        let deletedBtns = document.getElementsByClassName('delete-btn');
        for (let i = 0; i < deletedBtns.length; i++) {
            deletedBtns[i].addEventListener('click', (event) => {
                this.deleteMovie(event.target.getAttribute('data-title'));
            })
        }
        this.lazyloadImage()
    }
    lazyloadImage() {
        var lazyImages = [].slice.call(document.querySelectorAll(".lazy-img"));;
        if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
            let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove("lazy-img");
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });

            lazyImages.forEach(function (lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        }
    }
    showToaster(message) {
        this.toaster.innerHTML = message;
        this.toaster.style.display = "block";
        setTimeout(() => {
            this.toaster.style.display = "none"
        }, 3000)
    }
    deleteMovie(title) {
        let index = this.listToBeDisplayed.findIndex((movie) => {
            return movie.title === title;
        })
        this.listToBeDisplayed.splice(index, 1);
        index = movieList.findIndex((movie) => {
            return movie.title === title;
        })
        movieList.splice(index, 1);
        this.generateList(this.listToBeDisplayed);
        this.showToaster('Movie deleted successfully')
    }
    init() {
        this.generateList(movieList);
        this._initializeSearch();
        this._initializeSort();
        this._initializeAdd();
    }
    _initializeSort() {
        this.sortByTitle.addEventListener('click', () => {
            this.listToBeDisplayed.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
            this.generateList(this.listToBeDisplayed)
        })
        this.sortByYear.addEventListener('click', () => {
            this.listToBeDisplayed.sort((a, b) => (parseInt(a.year) > parseInt(b.year)) ? 1 : ((parseInt(b.year) > parseInt(a.year)) ? -1 : 0))
            this.generateList(this.listToBeDisplayed)
        })
    }
    _initializeSearch() {
        this.searchElem.addEventListener('keyup', (event) => {
            let searchString = event.target.value;
            if (searchString) {
                var filteredMovie = movieList.filter(function (v, i) {
                    if (v.title.toLowerCase().includes(searchString.toLowerCase())) {
                        return v
                    }
                });
                this.generateList(filteredMovie);
            } else {
                this.generateList(movieList);
            }
        })
    }
    _initializeAdd() {
        this.addMovieElem.addEventListener('click', () => {
            this.modal.style.display = "block";
        })
        this.cancelBtn.onclick = ()=> {
            this.modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == this.modal) {
                this.modal.style.display = "none";
            }
        }
        document.querySelector('#submitBtn').addEventListener('click', (event) => {
            let title = document.getElementById("titleField");
            let year = document.getElementById("yearField");
            let posterurl = document.getElementById("posterURLField");
            if(!title.value || !year.value || !posterurl.value ){
                return
            }
            movieList.unshift({ title:title.value, year:year.value, posterurl:posterurl.value });
            this.showToaster('Movie Added Successfully')
            this.modal.style.display = "none";
            this.generateList(movieList);
            title.value='';
            year.value='';
            posterurl.value='';
            event.preventDefault();
            return false;
        })
    }
}