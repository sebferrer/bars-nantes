function showSuggestions(inputValue, bars) {
    const suggestionsList = document.getElementById("suggestionsList");
    const suggestionsContainer = document.getElementById("suggestionsContainer");
    suggestionsList.innerHTML = "";

    if (inputValue.length === 0) {
        suggestionsContainer.style.display = "none";
        return;
    }

    const suggestions = bars
        .filter(bar => bar.name.toLowerCase().includes(inputValue.toLowerCase()))
        .map(bar => bar.name);

    if (suggestions.length > 5) {
        suggestionsContainer.style.display = "none";
        return;
    }

    suggestions.forEach(name => {
        const suggestionItem = document.createElement("li");
        suggestionItem.textContent = name;
        suggestionItem.onclick = () => selectSuggestion(name, bars);
        suggestionsList.appendChild(suggestionItem);
    });

    if (suggestions.length > 0) {
        suggestionsContainer.style.display = "block";
    } else {
        suggestionsContainer.style.display = "none";
    }
}

function selectSuggestion(name, bars) {
    document.getElementById("searchBar").value = name;
    document.getElementById("suggestionsContainer").style.display = "none";
    focusOnBar(name, bars);
}

function focusOnBar(name, bars) {
    const bar = bars.find(bar => bar.name === name);
    if (bar) {
        map.setView([bar.lat, bar.lon], 16);
        const marker = markers.find(m => m.name === name.toLowerCase());
        if (marker) marker.marker.openPopup();
    }
}
