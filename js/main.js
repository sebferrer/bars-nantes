const map = L.map('map').setView([47.2184, -1.5536], 13);
const markers = [];

const BARS_FILE = 'data/sample.json';
let BARS_DATA;

async function init() {
    BARS_DATA = await fetchBarsData(BARS_FILE);

    if (BARS_DATA && BARS_DATA.length > 0) {
        addMarkers(BARS_DATA);
    } else {
        console.error('No data available or failed to load bars data.');
    }
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function fetchBarsData(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const bars = await response.json();
        return bars;
    } catch (error) {
        console.error('Erreur lors du chargement des données des bars:', error);
        return null;
    }
}

async function addMarkers(bars) {
    bars.forEach(bar => {
        const marker = L.marker([bar.lat, bar.lon]).addTo(map);
        markers.push({ name: bar.name.toLowerCase(), marker: marker });

        const address = `${bar['addr:housenumber'] || ''} ${bar['addr:street'] || ''}`;
        const openingHours = translateOpeningHours(bar.opening_hours, bar);

        const popupContent = `
            <h3>${bar.name}</h3>
            <p>${address}</p>
            <pre>${openingHours}</pre>
            ${bar.website ? `<a href="${bar.website}" target="_blank">Site Web</a>` : ''}
        `;

        marker.bindPopup(popupContent);
    });
}

function searchBar() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const foundMarker = markers.find(bar => bar.name.includes(searchTerm));

    if (foundMarker) {
        map.setView(foundMarker.marker.getLatLng(), 17);
        foundMarker.marker.openPopup();
    } else {
        alert("Bar non trouvé");
    }
}

function handleAutocomplete(inputValue) {
    showSuggestions(inputValue, BARS_DATA);
}

init();
