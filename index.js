// Function to clear all displayed country information
function clearCountryInfo() {
    // Clear country input field
    const inputField = document.getElementById("countryInput");
    inputField.value = ''; // Clear the value of the input field

    // Clear country information container
    const countryInfoContainer = document.getElementById("countryInfo");
    countryInfoContainer.innerHTML = ''; // Clear country information

    // Clear map container
    const mapContainer = document.getElementById("map");
    mapContainer.innerHTML = ''; // Clear map
}

// Function to focus the country input field
function focusCountryInput() {
    const inputField = document.getElementById("countryInput");
    inputField.focus(); // Focus on the country input field
}

// Function to search for country information
async function searchCountry(countryName) {
    const input = countryName || document.getElementById("countryInput").value;
    if (!input) {
        alert("Please enter a country name.");
        return;
    }

    try {
        // Fetch country data from REST Countries API
        const response = await fetch(`https://restcountries.com/v3.1/name/${input}`);
        if (!response.ok) {
            throw new Error('Country not found.');
        }
        const data = await response.json();
        const country = data[0]; // Assuming first result is the desired country

        // Extract currency details
        let currencyInfo = "Currency Data Not Available";
        if (country.currencies && Object.keys(country.currencies).length > 0) {
            const currency = country.currencies[Object.keys(country.currencies)[0]];
            if (currency && currency.name && currency.code) {
                currencyInfo = `${currency.name} (${currency.code})`;
            }
        }

        // Display country information
        const countryInfoContainer = document.getElementById("countryInfo");
        countryInfoContainer.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital || "Unknown Capital"}</p>
            <p>Population: ${country.population || "Unknown Population"}</p>
            <p>Area: ${country.area ? `${country.area} km²` : "Unknown Area"}</p>
            <p>Currency: ${currencyInfo}</p>
            <p>Languages: ${Object.values(country.languages).join(", ") || "Unknown Languages"}</p>
            <img src="${country.flags.svg}" alt="Flag" width="100">
        `;

        // Display map using Yandex Maps API
        const mapContainer = document.getElementById("map");
        mapContainer.innerHTML = ''; // Clear previous map if any
        const iframe = document.createElement('iframe');
        iframe.width = "100%";
        iframe.height = "300";
        iframe.frameBorder = "0";
        iframe.allowFullscreen = "true";

        // Construct the map iframe URL with additional parameters to customize map display
        const mapUrl = `https://yandex.com/map-widget/v1/-/CCUaFLRW5A/?lang=en&ll=${country.latlng[1]},${country.latlng[0]}&z=5&l=map&disableMapOpenBlock=true`;

        iframe.src = mapUrl;
        mapContainer.appendChild(iframe);
    } catch (error) {
        console.error("Error fetching country data:", error);
        alert("Country not found or data unavailable. Please try again.");
    }
}

// Add event listener for 'Enter' key press on input field
document.getElementById("countryInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior of 'Enter' key (e.g., form submission)
        searchCountry(); // Call searchCountry function when 'Enter' key is pressed
    }
});

// Add event listener to "Clear" button for click event
document.getElementById("clearButton").addEventListener("click", function(event) {
    clearCountryInfo(); // Call clearCountryInfo function when "Clear" button is clicked
});

// Add event listener to each image container for click event
document.querySelectorAll('.saige, .japan, .emirates, .paris').forEach(container => {
    container.addEventListener('click', () => {
        const imageCaption = container.querySelector('.image-caption').textContent;
        document.getElementById("countryInput").value = imageCaption; // Set input value to image caption
        searchCountry(imageCaption); // Call searchCountry function with image caption as parameter
    });
});

// Add event listener to automatically focus input field when the page is loaded
window.addEventListener("load", function(event) {
    focusCountryInput(); // Call focusCountryInput function when the page is loaded
});
