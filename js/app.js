// ===============================
// ELEMENTS
// ===============================

const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");

const loading = document.getElementById("loading");
const apiError = document.getElementById("apiError");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const temperature = document.getElementById("temperature");
const statusLabel = document.getElementById("statusLabel");
const windSpeed = document.getElementById("windSpeed");
const updatedAt = document.getElementById("updatedAt");
const iconWrap = document.getElementById("iconWrap");

// ===============================
// WEATHER CODES (WMO)
// ===============================

const WEATHER_CODES = {
    0: ["Syèl klè", "☀️"],
    1: ["Prèske klè", "🌤️"],
    2: ["Ti nwaj", "⛅"],
    3: ["Nwaj", "☁️"],
    45: ["Bwouya", "🌫️"],
    48: ["Bwouya", "🌫️"],
    51: ["Ti lapli", "🌦️"],
    53: ["Lapli", "🌧️"],
    55: ["Gwo lapli", "🌧️"],
    61: ["Lapli", "🌧️"],
    63: ["Lapli", "🌧️"],
    65: ["Gwo lapli", "🌧️"],
    71: ["Nèj", "❄️"],
    73: ["Nèj", "❄️"],
    75: ["Gwo nèj", "❄️"],
    80: ["Avers", "🌦️"],
    81: ["Lapli", "🌧️"],
    82: ["Gwo avers", "⛈️"],
    95: ["Loraj", "⛈️"],
    96: ["Loraj", "⛈️"],
    99: ["Loraj", "⛈️"]
};

// ===============================
// FORM
// ===============================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        alert("Antre non yon vil.");
        return;
    }

    loading.hidden = false;
    apiError.hidden = true;
    weatherCard.hidden = true;

    try {

        // ==========================
        // RECHERCHE VILLE
        // ==========================

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Vil la pa jwenn.");
        }

        const place = geoData.results[0];

        // ==========================
        // METEO
        // ==========================

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code,wind_speed_10m`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        cityName.textContent = place.name;
        countryName.textContent = place.country;

        temperature.textContent =
            current.temperature_2m + "°C";

        windSpeed.textContent =
            current.wind_speed_10m + " km/h";

        updatedAt.textContent =
            current.time.replace("T", " ");

        const weather =
            WEATHER_CODES[current.weather_code] || ["Enkoni", "❔"];

        statusLabel.textContent = weather[0];
        iconWrap.textContent = weather[1];

        // ==========================
        // CHANGE BACKGROUND
        // ==========================

        const body = document.body;

        switch (weather[1]) {

            case "☀️":
                body.style.background =
                    "linear-gradient(135deg,#f59e0b,#facc15,#38bdf8)";
                break;

            case "☁️":
            case "⛅":
                body.style.background =
                    "linear-gradient(135deg,#64748b,#94a3b8,#cbd5e1)";
                break;

            case "🌧️":
            case "🌦️":
                body.style.background =
                    "linear-gradient(135deg,#0f172a,#2563eb,#38bdf8)";
                break;

            case "❄️":
                body.style.background =
                    "linear-gradient(135deg,#dbeafe,#bfdbfe,#93c5fd)";
                break;

            case "⛈️":
                body.style.background =
                    "linear-gradient(135deg,#111827,#312e81,#1e3a8a)";
                break;

            default:
                body.style.background =
                    "linear-gradient(135deg,#0f172a,#2563eb,#38bdf8)";
        }

        weatherCard.hidden = false;

    } catch (error) {

        apiError.hidden = false;
        apiError.textContent = error.message;

    } finally {

        loading.hidden = true;

    }

});