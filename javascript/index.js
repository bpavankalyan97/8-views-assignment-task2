const formContainerElement = document.getElementById("formContainer");
const searchInputElement = document.getElementById("searchInput");
const clearButtonElement = document.getElementById("clearButton");

const loaderSpinnerElement = document.getElementById("loaderSpinner");
const searchTextDisplayElement = document.getElementById("searchTextDisplay");
const usersContainerElement = document.getElementById("usersContainer");

// A view that will be displayed when there are no search results
const displayNoResultsView = () => {
    const noResultsContainer = document.createElement("div");
    noResultsContainer.classList.add("col-12", "text-center", "mt-3");
    usersContainerElement.appendChild(noResultsContainer);

    const noResultsCard = document.createElement("div");
    noResultsCard.classList.add("user-card");
    noResultsContainer.appendChild(noResultsCard);

    const noResultsHeading = document.createElement("h2");
    noResultsHeading.textContent = "No Results Found";
    noResultsCard.appendChild(noResultsHeading);

    const noResultsPara = document.createElement("p");
    noResultsPara.classList.add("mb-0");
    noResultsPara.textContent = "Please try again with different search input.";
    noResultsCard.appendChild(noResultsPara);
};

const toggleLoadingView = () => {
    loaderSpinnerElement.classList.toggle("d-none");
};

// Creates and appends user container element
const appendUserElement = userObject => {
    const userContainerElement = document.createElement("div");
    userContainerElement.classList.add("col-12", "col-md-6", "col-lg-4", "user-container");
    usersContainerElement.appendChild(userContainerElement);

    const userCardElement = document.createElement("div");
    userCardElement.classList.add("user-card");
    userContainerElement.appendChild(userCardElement);

    const userImageElement = document.createElement("img");
    userImageElement.classList.add("user-image");
    userImageElement.src = userObject.avatar_url;
    userImageElement.alt = userObject.login;
    userCardElement.appendChild(userImageElement);

    const userNameElement = document.createElement("h3");
    userNameElement.classList.add("user-name");
    userNameElement.textContent = userObject.login;
    userCardElement.appendChild(userNameElement);

    const moreButton = document.createElement("button");
    moreButton.classList.add("more-button");
    moreButton.type = "button";
    moreButton.textContent = "More";

    moreButton.onclick = () => {
        alert(`User ID: ${userObject.id}\nUser GitHub Link: ${userObject.html_url}`);
    };

    userCardElement.appendChild(moreButton);
};

const displayUsers = usersList => {
    toggleLoadingView();
    if (usersList.length === 0) {
        displayNoResultsView();
        return;
    }
    usersList.forEach(userObject => appendUserElement(userObject));
};

// Fetches user list array based on search input value
const fetchUsersList = async searchInput => {
    usersContainerElement.textContent = "";
    toggleLoadingView();
    const usersApiUrl = searchInput === null ? "https://api.github.com/users" :
        `https://api.github.com/search/users?q=${searchInput}`;

    try {
        const response = await fetch(usersApiUrl);
        const responseJsonObject = await response.json();

        const usersList = searchInput === null ? responseJsonObject : responseJsonObject.items;
        displayUsers(usersList);
    } catch (error) {
        console.log(error.message);
    }
};

const onFormSubmitEvent = event => {
    event.preventDefault();
    let searchInput = searchInputElement.value;
    searchInput = searchInput.trim();
    if (searchInput === "") {
        clearSearchInputValue();
        alert("Please enter a valid input");
        return;
    }
    searchTextDisplayElement.textContent = searchInput;
    clearSearchInputValue();
    fetchUsersList(searchInput);
};

const clearSearchInputValue = () => {
    searchInputElement.value = "";
};

formContainerElement.addEventListener("submit", onFormSubmitEvent);
clearButtonElement.addEventListener("click", clearSearchInputValue);

// Initial fetch api call to get all users
fetchUsersList(null);