const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movieGrid = document.getElementById('movieGrid');
const statusMessage = document.getElementById('statusMessage');

// Paste your OMDB API key here
const apiKey = "f470a16b"; 

searchBtn.addEventListener('click', searchMovies);

// Also search when pressing "Enter" key
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchMovies();
    }
});

function searchMovies() {
    const query = searchInput.value.trim();

    if (query === "") {
        statusMessage.innerText = "Please enter a movie title to search!";
        movieGrid.innerHTML = "";
        return;
    }

    statusMessage.innerText = "Searching movies...";
    movieGrid.innerHTML = "";

    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                statusMessage.innerText = "";
                displayMovies(data.Search);
            } else {
                statusMessage.innerText = `No movies found for "${query}". Try another search!`;
            }
        })
        .catch(error => {
            console.error("Error fetching movie data:", error);
            statusMessage.innerText = "Something went wrong. Please check your internet connection!";
        });
}

function displayMovies(movies) {
    movieGrid.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // Handle missing poster images
        const posterUrl = movie.Poster !== "N/A" 
            ? movie.Poster 
            : 'https://via.placeholder.com/300x450?text=No+Poster+Available';

        movieCard.innerHTML = `
            <img class="movie-poster" src="${posterUrl}" alt="${movie.Title}">
            <div class="movie-info">
                <div>
                    <div class="movie-title">${movie.Title}</div>
                </div>
                <div class="movie-meta">
                    <span>📅 ${movie.Year}</span>
                    <span class="type-badge">${movie.Type}</span>
                </div>
            </div>
        `;

        movieGrid.appendChild(movieCard);
    });
}
// Function to render movie cards
function displayMovies(movies) {
    const movieGrid = document.getElementById("movieGrid"); // Replace with your grid container ID
    movieGrid.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        
        const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster";

        card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p><span>📅 ${movie.Year}</span> <span class="type-tag">${movie.Type.toUpperCase()}</span></p>
        `;

        // Add Click Listener to Fetch Full Details by imdbID
        card.addEventListener("click", () => fetchMovieDetails(movie.imdbID));

        movieGrid.appendChild(card);
    });
}

// Function to fetch specific movie details
function fetchMovieDetails(imdbID) {
    const detailUrl = `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${apiKey}`;

    fetch(detailUrl)
        .then(res => res.json())
        .then(data => {
            const modal = document.getElementById("movieModal");
            const modalDetails = document.getElementById("modalDetails");

            const poster = data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300x450?text=No+Poster";

            modalDetails.innerHTML = `
                <div class="modal-body">
                    <img src="${poster}" alt="${data.Title}">
                    <div class="modal-info">
                        <h2>${data.Title} (${data.Year})</h2>
                        <p><strong>Genre:</strong> ${data.Genre}</p>
                        <p><strong>IMDb Rating:</strong> ⭐ ${data.imdbRating} / 10</p>
                        <p><strong>Actors:</strong> ${data.Actors}</p>
                        <p><strong>Plot:</strong> ${data.Plot}</p>
                    </div>
                </div>
            `;

            modal.style.display = "flex";
        })
        .catch(err => console.error("Error fetching details:", err));
}

// Close Modal Events
document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("movieModal").style.display = "none";
});

window.addEventListener("click", (event) => {
    const modal = document.getElementById("movieModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});