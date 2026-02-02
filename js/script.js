// List of available countries with their timezones
const countriesData = [
  { name: 'Bangladesh', timeZone: 'Asia/Dhaka', shortTZ: 'BST' },
  { name: 'China', timeZone: 'Asia/Shanghai', shortTZ: 'CST' },
  { name: 'United States', timeZone: 'America/New_York', shortTZ: 'EST' },
  { name: 'United Kingdom', timeZone: 'Europe/London', shortTZ: 'GMT' },
  { name: 'India', timeZone: 'Asia/Kolkata', shortTZ: 'IST' },
  { name: 'Japan', timeZone: 'Asia/Tokyo', shortTZ: 'JST' },
  { name: 'Germany', timeZone: 'Europe/Berlin', shortTZ: 'CET' },
  { name: 'France', timeZone: 'Europe/Paris', shortTZ: 'CET' },
  { name: 'Canada', timeZone: 'America/Toronto', shortTZ: 'EST' },
  { name: 'Australia', timeZone: 'Australia/Sydney', shortTZ: 'AEST' },
  { name: 'Brazil', timeZone: 'America/Sao_Paulo', shortTZ: 'BRT' },
  { name: 'Russia', timeZone: 'Europe/Moscow', shortTZ: 'MSK' },
  { name: 'South Korea', timeZone: 'Asia/Seoul', shortTZ: 'KST' },
  { name: 'Mexico', timeZone: 'America/Mexico_City', shortTZ: 'CST' },
  { name: 'Italy', timeZone: 'Europe/Rome', shortTZ: 'CET' },
  { name: 'Spain', timeZone: 'Europe/Madrid', shortTZ: 'CET' },
  { name: 'Netherlands', timeZone: 'Europe/Amsterdam', shortTZ: 'CET' },
  { name: 'Sweden', timeZone: 'Europe/Stockholm', shortTZ: 'CET' },
  { name: 'Norway', timeZone: 'Europe/Oslo', shortTZ: 'CET' },
  { name: 'Denmark', timeZone: 'Europe/Copenhagen', shortTZ: 'CET' }
];

// Currently displayed countries (start with the three original)
let displayedCountries = [
  { id: 'bangladesh', ...countriesData.find(c => c.name === 'Bangladesh') },
  { id: 'china', ...countriesData.find(c => c.name === 'China') },
  { id: 'usa', ...countriesData.find(c => c.name === 'United States') }
];

// DOM elements
const cardsGrid = document.querySelector('.cards-grid');
const searchInput = document.getElementById('search-input');
const dropdown = document.querySelector('.dropdown');

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

    const card = document.getElementById(country.id);
    if (card) {
      card.innerHTML = `
        <div class="card-country">${country.name}</div>
        <div class="card-date">${date}</div>
        <div class="card-period">${timeOfDay}</div>
        <div class="card-time">${time}</div>
        <div class="card-timezone">${country.shortTZ}</div>
        ${displayedCountries.length > 3 ? '<button class="remove-btn" onclick="removeCountry(\'' + country.id + '\')">×</button>' : ''}
      `;
    }
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

// Handle search input
function handleSearch() {
  const query = searchInput.value.toLowerCase();
  const filteredCountries = countriesData.filter(country =>
    country.name.toLowerCase().includes(query) &&
    !displayedCountries.some(dc => dc.name === country.name)
  );

  dropdown.innerHTML = '';
  if (query && filteredCountries.length > 0) {
    filteredCountries.forEach(country => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.textContent = country.name;
      item.onclick = () => selectCountry(country);
      dropdown.appendChild(item);
    });
    dropdown.classList.add('show');
  } else {
    dropdown.classList.remove('show');
  }
}

// Select a country from dropdown
function selectCountry(country) {
  if (displayedCountries.length >= 8) {
    alert('Maximum 8 countries allowed. Remove some to add more.');
    return;
  }

  const newCountry = {
    id: `country-${Date.now()}`,
    ...country
  };
  displayedCountries.push(newCountry);
  updateCards();
  searchInput.value = '';
  dropdown.classList.remove('show');
}

// Event listeners
searchInput.addEventListener('input', handleSearch);
searchInput.addEventListener('focus', handleSearch);
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createCards();
  detectUserCountry().then(() => {
    updateTime();
    setInterval(updateTime, 1000);
  });
});
