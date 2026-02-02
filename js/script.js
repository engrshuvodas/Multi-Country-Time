// List of available countries with their timezones
const countriesData = [
  { name: 'Argentina', timeZone: 'America/Argentina/Buenos_Aires', shortTZ: 'ART' },
  { name: 'Austria', timeZone: 'Europe/Vienna', shortTZ: 'CET' },
  { name: 'Bahrain', timeZone: 'Asia/Bahrain', shortTZ: 'AST' },
  { name: 'Bangladesh', timeZone: 'Asia/Dhaka', shortTZ: 'BST' },
  { name: 'Belgium', timeZone: 'Europe/Brussels', shortTZ: 'CET' },
  { name: 'Brazil', timeZone: 'America/Sao_Paulo', shortTZ: 'BRT' },
  { name: 'Cambodia', timeZone: 'Asia/Phnom_Penh', shortTZ: 'ICT' },
  { name: 'Cameroon', timeZone: 'Africa/Douala', shortTZ: 'WAT' },
  { name: 'Canada', timeZone: 'America/Toronto', shortTZ: 'EST' },
  { name: 'China', timeZone: 'Asia/Shanghai', shortTZ: 'CST' },
  { name: 'Colombia', timeZone: 'America/Bogota', shortTZ: 'COT' },
  { name: 'Denmark', timeZone: 'Europe/Copenhagen', shortTZ: 'CET' },
  { name: 'Dominican Republic', timeZone: 'America/Santo_Domingo', shortTZ: 'AST' },
  { name: 'Estonia', timeZone: 'Europe/Tallinn', shortTZ: 'EET' },
  { name: 'France', timeZone: 'Europe/Paris', shortTZ: 'CET' },
  { name: 'Georgia', timeZone: 'Asia/Tbilisi', shortTZ: 'GET' },
  { name: 'Germany', timeZone: 'Europe/Berlin', shortTZ: 'CET' },
  { name: 'Hong Kong', timeZone: 'Asia/Hong_Kong', shortTZ: 'HKT' },
  { name: 'India', timeZone: 'Asia/Kolkata', shortTZ: 'IST' },
  { name: 'Israel', timeZone: 'Asia/Jerusalem', shortTZ: 'IST' },
  { name: 'Italy', timeZone: 'Europe/Rome', shortTZ: 'CET' },
  { name: 'Ivory Coast', timeZone: 'Africa/Abidjan', shortTZ: 'GMT' },
  { name: 'Kazakhstan', timeZone: 'Asia/Almaty', shortTZ: 'ALMT' },
  { name: 'Kenya', timeZone: 'Africa/Nairobi', shortTZ: 'EAT' },
  { name: 'Laos', timeZone: 'Asia/Vientiane', shortTZ: 'ICT' },
  { name: 'Malaysia', timeZone: 'Asia/Kuala_Lumpur', shortTZ: 'MYT' },
  { name: 'Mexico', timeZone: 'America/Mexico_City', shortTZ: 'CST' },
  { name: 'Moldova', timeZone: 'Europe/Chisinau', shortTZ: 'EET' },
  { name: 'Morocco', timeZone: 'Africa/Casablanca', shortTZ: 'WET' },
  { name: 'Mozambique', timeZone: 'Africa/Maputo', shortTZ: 'CAT' },
  { name: 'Netherlands', timeZone: 'Europe/Amsterdam', shortTZ: 'CET' },
  { name: 'Nigeria', timeZone: 'Africa/Lagos', shortTZ: 'WAT' },
  { name: 'Norway', timeZone: 'Europe/Oslo', shortTZ: 'CET' },
  { name: 'Pakistan', timeZone: 'Asia/Karachi', shortTZ: 'PKT' },
  { name: 'Panama', timeZone: 'America/Panama', shortTZ: 'EST' },
  { name: 'Portugal', timeZone: 'Europe/Lisbon', shortTZ: 'WET' },
  { name: 'Qatar', timeZone: 'Asia/Qatar', shortTZ: 'AST' },
  { name: 'Saudi Arabia', timeZone: 'Asia/Riyadh', shortTZ: 'AST' },
  { name: 'Singapore', timeZone: 'Asia/Singapore', shortTZ: 'SGT' },
  { name: 'South Africa', timeZone: 'Africa/Johannesburg', shortTZ: 'SAST' },
  { name: 'Spain', timeZone: 'Europe/Madrid', shortTZ: 'CET' },
  { name: 'Sri Lanka', timeZone: 'Asia/Colombo', shortTZ: 'SLST' },
  { name: 'Switzerland', timeZone: 'Europe/Zurich', shortTZ: 'CET' },
  { name: 'Ukraine', timeZone: 'Europe/Kiev', shortTZ: 'EET' },
  { name: 'United Arab Emirates', timeZone: 'Asia/Dubai', shortTZ: 'GST' },
  { name: 'United Kingdom', timeZone: 'Europe/London', shortTZ: 'GMT' },
  { name: 'United States', timeZone: 'America/New_York', shortTZ: 'EST' },
  { name: 'Venezuela', timeZone: 'America/Caracas', shortTZ: 'VET' },
  { name: 'Zimbabwe', timeZone: 'Africa/Harare', shortTZ: 'CAT' }
];

// Original countries (always start with these)
const originalCountries = [
  { id: 'bangladesh', ...countriesData.find(c => c.name === 'Bangladesh') },
  { id: 'china', ...countriesData.find(c => c.name === 'China') },
  { id: 'usa', ...countriesData.find(c => c.name === 'United States') }
];

// Currently displayed countries (filtered based on search)
let displayedCountries = [...originalCountries];

// DOM elements
const cardsGrid = document.querySelector('.cards-grid');
const searchInput = document.getElementById('search-input');

// Detect user's country on load
async function detectUserCountry() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const userCountry = countriesData.find(c =>
      c.name.toLowerCase().includes(data.country_name.toLowerCase()) ||
      data.country_name.toLowerCase().includes(c.name.toLowerCase())
    );

    if (userCountry && !displayedCountries.some(dc => dc.name === userCountry.name)) {
      // Add detected country as first card if not already displayed
      displayedCountries.unshift({ id: `country-${Date.now()}`, ...userCountry });
      updateCards();
    }
  } catch (error) {
    console.log('Could not detect user country:', error);
    // Fallback: do nothing, keep original cards
  }
}

// Filter countries based on search query (FOUND-style logic)
function filterCountries(query) {
  if (!query.trim()) {
    // If no query, show all original countries
    displayedCountries = [...originalCountries];
  } else {
    // Find the first matching country (case-insensitive, partial match)
    const foundCountry = countriesData.find(country =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );

    if (foundCountry) {
      // If found, show only that country
      displayedCountries = [{ id: `search-${foundCountry.name.toLowerCase().replace(/\s+/g, '-')}`, ...foundCountry }];
    } else {
      // If not found, show "No data found" state
      displayedCountries = [{ id: 'no-data', name: 'No data found', timeZone: '', shortTZ: '' }];
    }
  }
  updateCards();
}

// Get time of day in English
function getTimeOfDay(hour, minute) {
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 300 && totalMinutes <= 719) {
    return "Morning"; // 5:00 AM - 11:59 AM
  } else if (totalMinutes >= 720 && totalMinutes <= 779) {
    return "Noon"; // 12:00 PM - 12:59 PM
  } else if (totalMinutes >= 780 && totalMinutes <= 1079) {
    return "Afternoon"; // 1:00 PM - 5:59 PM
  } else {
    return "Night"; // 6:00 PM - 4:59 AM
  }
}

// Update time for all displayed countries
function updateTime() {
  displayedCountries.forEach(country => {
    const card = document.getElementById(country.id);
    if (!card) return;

    if (country.id === 'no-data') {
      // Special case for "No data found"
      card.innerHTML = `
        <div class="card-country">${country.name}</div>
        <div class="card-date">--</div>
        <div class="card-period">--</div>
        <div class="card-time">--</div>
        <div class="card-timezone">--</div>
      `;
      return;
    }

    const now = new Date();

    // Get time in target timezone
    const localeTime = new Date(now.toLocaleString("en-US", { timeZone: country.timeZone }));
    const hour = localeTime.getHours();
    const minute = localeTime.getMinutes();
    const second = localeTime.getSeconds();

    const timeOfDay = getTimeOfDay(hour, minute);

    const optionsDate = {
      timeZone: country.timeZone,
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    const optionsTime = {
      timeZone: country.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    const date = new Intl.DateTimeFormat('en-US', optionsDate).format(now);
    const time = new Intl.DateTimeFormat('en-US', optionsTime).format(now);

    card.innerHTML = `
      <div class="card-country">${country.name}</div>
      <div class="card-date">${date}</div>
      <div class="card-period">${timeOfDay}</div>
      <div class="card-time">${time}</div>
      <div class="card-timezone">${country.shortTZ}</div>
      ${displayedCountries.length > 3 && country.id !== 'no-data' ? '<button class="remove-btn" onclick="removeCountry(\'' + country.id + '\')">×</button>' : ''}
    `;
  });
}

// Create initial cards
function createCards() {
  cardsGrid.innerHTML = '';
  displayedCountries.forEach((country, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = country.id;
    card.style.animationDelay = `${index * 0.1}s`;
    cardsGrid.appendChild(card);
  });
}

// Update cards (for adding/removing)
function updateCards() {
  createCards();
  updateTime();
}

// Remove a country card
function removeCountry(countryId) {
  displayedCountries = displayedCountries.filter(c => c.id !== countryId);
  updateCards();
}

// Event listeners
searchInput.addEventListener('input', (e) => {
  filterCountries(e.target.value);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createCards();
  detectUserCountry().then(() => {
    updateTime();
    setInterval(updateTime, 1000);
  });
});
