async function fetchAPI(param) {
    const API_KEY = 'XXX';
    const API_URL = 'http://www.omdbapi.com/';
    const URL = `${API_URL}?apikey=${API_KEY}&${param}`;

    const res = await fetch(URL);
    const result = await res.json();

    if (param[0] === 's') {
        if (result.Response == 'True') {
            return result.Search;
        } else {
            return;
        }
    }
    return result;
}

let right, left;

async function displayInfo(movieID, tile, side) {
    tile.innerHTML = '';
    const movie = await fetchAPI(`i=${movieID}`);

    const boxOffice = parseInt(movie.BoxOffice.replace(/[$,]/g, ''));
    const metaScore = parseInt(movie.Metascore);
    const imdbRating = parseFloat(movie.imdbRating);
    const imdbVotes = parseInt(movie.imdbVotes.replace(/[,]/g, ''));
    const awards = movie.Awards.split(/\D+/).reduce((accumulator, award) => {
        const value = parseInt(award);
        if (isNaN(value)) {
            return accumulator;
        } else {
            return accumulator + value;
        }
    }, 0);

    const div = document.createElement('div');
    div.className = 'container my-2 w-sm lg:w-md rounded-md bg-gray-100 py-4 pr-4 pl-2';
    div.innerHTML = `
            <div class="flex mb-4">
                <div class="">
                    ${movie.Poster != 'N/A' ? `<img src="${movie.Poster}" class="aspect-square h-40 max-w-30 rounded-md md:h-60 md:max-w-40" />` : `<div class="size-40 h-60 bg-gray-200"></div>`}    
                </div>
                <div class="ml-6 space-y-1">
                    <h2 class="text-3xl font-semibold">${movie.Title}</h2>
                    <h4 class="mb-2 text-lg">${movie.Genre}</h4>
                    <p class="text-sm">${movie.Plot}</p>
                </div>
            </div>
            <dl class="space-y-4 text-left">
                <div data-value="${awards}" class="metrics flex max-w-xl flex-col rounded-md bg-white py-2 pl-2">
                    <dt class="text-base/7 text-gray-600">Awards</dt>
                    <dd class="order-first text-xl font-semibold tracking-tight text-gray-900">${movie.Awards}</dd>
                </div>
                <div data-value="${boxOffice}" class="metrics flex max-w-xl flex-col rounded-md bg-white py-2 pl-2">
                    <dt class="text-base/7 text-gray-600">Box Office</dt>
                    <dd class="order-first text-xl font-semibold tracking-tight text-gray-900">${movie.BoxOffice}</dd>
                </div>
                <div data-value="${metaScore}" class="metrics flex max-w-xl flex-col rounded-md bg-white py-2 pl-2">
                    <dt class="text-base/7 text-gray-600">Metascore</dt>
                    <dd class="order-first text-xl font-semibold tracking-tight text-gray-900">${movie.Metascore}</dd>
                </div>
                <div data-value="${imdbRating}" class="metrics flex max-w-xl flex-col rounded-md bg-white py-2 pl-2">
                    <dt class="text-base/7 text-gray-600">IMDB Rating</dt>
                    <dd class="order-first text-xl font-semibold tracking-tight text-gray-900">${movie.imdbRating}</dd>
                </div>
                <div data-value="${imdbVotes}" class="metrics flex max-w-xl flex-col rounded-md bg-white py-2 pl-2">
                    <dt class="text-base/7 text-gray-600">IMDB Votes</dt>
                    <dd class="order-first text-xl font-semibold tracking-tight text-gray-900">${movie.imdbVotes}</dd>
                </div>
            </dl>`;

    tile.appendChild(div);

    if (side == 'left') {
        left = side;
    } else if (side == 'right') {
        right = side;
    }

    if (right && left) {
        compareMovie();
    }
}

function compareMovie() {
    const leftMetrics = document.querySelectorAll('#left-info .metrics');
    const rightMetrics = document.querySelectorAll('#right-info .metrics');

    leftMetrics.forEach((leftMetric, index) => {
        const rightMetric = rightMetrics[index];

        leftMetric.classList.remove('bg-gray-900');
        leftMetric.firstElementChild.classList.remove('text-white');
        leftMetric.lastElementChild.classList.remove('text-white');
        rightMetric.firstElementChild.classList.remove('text-white');
        rightMetric.lastElementChild.classList.remove('text-white');
        rightMetric.classList.remove('bg-gray-900');

        leftMetric.classList.add('bg-white');
        leftMetric.firstElementChild.classList.add('text-gray-600');
        leftMetric.lastElementChild.classList.add('text-gray-900');
        rightMetric.classList.add('bg-white');
        rightMetric.firstElementChild.classList.add('text-gray-600');
        rightMetric.lastElementChild.classList.add('text-gray-900');
    });

    leftMetrics.forEach((leftMetric, index) => {
        const rightMetric = rightMetrics[index];

        const leftDataValue = parseFloat(leftMetric.dataset.value);
        const rightDataValue = parseFloat(rightMetric.dataset.value);

        if (leftDataValue > rightDataValue) {
            leftMetric.classList.remove('bg-white');
            leftMetric.classList.add('bg-gray-900');
            leftMetric.firstElementChild.classList.remove('text-gray-600');
            leftMetric.firstElementChild.classList.add('text-white');
            leftMetric.lastElementChild.classList.remove('text-gray-900');
            leftMetric.lastElementChild.classList.add('text-white');
        } else if (leftDataValue < rightDataValue) {
            rightMetric.classList.remove('bg-white');
            rightMetric.classList.add('bg-gray-900');
            rightMetric.firstElementChild.classList.remove('text-gray-600');
            rightMetric.firstElementChild.classList.add('text-white');
            rightMetric.lastElementChild.classList.remove('text-gray-900');
            rightMetric.lastElementChild.classList.add('text-white');
        }
    });
}

function displayDOM() {
    document.body.innerHTML = `
        <section class="header max-h-auto min-h-20 max-w-auto bg-linear-65 from-gray-900 to-blue-600 p-6 pt-6">
            <div class="text-4xl font-bold text-white uppercase">
                <h1>Movie Versus<i class="fas fa-film ml-3"></i></h1>
            </div>
        </section>

        <div class="container mx-6 mb-auto flex max-w-full flex-col md:flex-row md:justify-center md:space-x-8 lg:mx-0 lg:space-x-16">
            <div class="left-tile">
                <div class="left-autocomplete"></div>
                <div id="left-info"></div>
            </div>

            <div class="right-tile">
                <div class="right-autocomplete"></div>
                <div id="right-info"></div>
            </div>
            
        </div>

        <div id="message" class="flex mx-auto items-center w-full max-w-xs p-4 rounded-lg shadow-sm text-white bg-blue-900" role="alert">
            <div class="inline-flex items-center justify-center shrink-0 w-8 h-8  rounded-lg bg-blue-950 text-blue-200">
                <i class="fas fa-film"></i>
            </div>
            <div class="ms-3 text-sm font-normal">Search for movie on both sides</div>
        </div>`;
}

/* <footer class="relative bottom-0 mt-6 h-18 w-full bg-linear-65 from-blue-600 to-gray-900  p-6 py-4">
<div class="flex items-center justify-between">
    <div class="logo text-3xl font-bold text-white uppercase">
        <span>Movie Versus<i class="fas fa-film ml-3"></i></span>
    </div>
    <div class="social-links flex text-sm text-white">
        <a class="ml-3" href="https://www.facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
        <a class="ml-3" href="https://www.twitter.com" target="_blank"><i class="fab fa-twitter"></i></a>
        <a class="ml-3" href="https://www.instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
    </div>
</div>
</footer> */

function init() {
    displayDOM();

    const autocompleteConfig = {
        optionTemplate(movie) {
            return `<div>
                    ${movie.Poster != 'N/A' ? `<img src="${movie.Poster}" class="h-15" />` : `<div class="size-10 h-15 bg-gray-200"></div>`}
                </div>
                <div class="flex flex-col ml-2 space-y-2">
                    <span>${movie.Title}</span>
                    <small>Year: ${movie.Year}</small>
                </div>`;
        },
        loadingTemplate: `<div class="animate-pulse flex px-4 py-2 text-sm text-gray-700">
                            <div class="size-10 h-15 bg-gray-200"></div>
                            <div class="ml-2 flex-1 space-y-4 py-1">
                                <div class="h-2 rounded bg-gray-200"></div>
                                <div class="space-y-2">
                                    <div class="grid grid-cols-3 gap-4">
                                        <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>`,
    };

    createAutocomplete({
        ...autocompleteConfig,
        root: document.querySelector('.left-autocomplete'),
        onOptionSelect(movie) {
            document.querySelector('#message').classList.add('hidden');
            displayInfo(movie.imdbID, document.querySelector('#left-info'), 'left');
        },
    });

    createAutocomplete({
        ...autocompleteConfig,
        root: document.querySelector('.right-autocomplete'),
        onOptionSelect(movie) {
            document.querySelector('#message').classList.add('hidden');
            displayInfo(movie.imdbID, document.querySelector('#right-info'), 'right');
        },
    });
}

document.addEventListener('DOMContentLoaded', init());
