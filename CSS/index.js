// Function to search for country information
async function searchCountry() {
    const input = document.getElementById("countryInput").value;
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
        iframe.src = `https://yandex.com/map-widget/v1/-/CCUaFLRW5A/?lang=en&ll=${country.latlng[1]},${country.latlng[0]}&z=5`;
        mapContainer.appendChild(iframe);
    } catch (error) {
        console.error("Error fetching country data:", error);
        alert("Country not found or data unavailable. Please try again.");
    }
}

// Function to clear country information
function clearCountryInfo() {
    const countryInfoContainer = document.getElementById("countryInfo");
    countryInfoContainer.innerHTML = ''; // Clear country information

    const mapContainer = document.getElementById("map");
    mapContainer.innerHTML = ''; // Clear map
}

// Function to focus the country input field
function focusCountryInput() {
    const inputField = document.getElementById("countryInput");
    inputField.focus(); // Focus on the country input field
}

// Add event listener for 'Enter' key press on input field
document.getElementById("countryInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior of 'Enter' key (e.g., form submission)
        searchCountry(); // Call searchCountry function when 'Enter' key is pressed
    }
});

// Add event listener to a "Clear" button
document.getElementById("clearButton").addEventListener("click", function(event) {
    clearCountryInfo(); // Call clearCountryInfo function when button is clicked
});

// Add event listener to a "Focus Input" button (optional)
document.getElementById("focusButton").addEventListener("click", function(event) {
    focusCountryInput(); // Call focusCountryInput function when button is clicked
});

// Automatically focus input field when the page is loaded
window.addEventListener("load", function(event) {
    focusCountryInput(); // Call focusCountryInput function when the page is loaded
});

