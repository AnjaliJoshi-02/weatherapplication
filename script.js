const warningBox = document.getElementById('warningBox');
const emoji = document.getElementById('emoji');
const locationText = document.getElementById('location');
const commentList = document.getElementById('commentList');

// Initialize map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Mock air quality data generator
function getAirQualityData() {
  return {
    pm25: Math.floor(Math.random() * 120), // µg/m³
    co2: 400 + Math.floor(Math.random() * 600),
    temp: 20 + Math.random() * 10,
    humidity: 40 + Math.random() * 30
  };
}

// Chart
const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: 'PM2.5', data: [], borderColor: 'red', fill: false },
      { label: 'CO₂', data: [], borderColor: 'blue', fill: false },
      { label: 'Temp (°C)', data: [], borderColor: 'orange', fill: false },
      { label: 'Humidity (%)', data: [], borderColor: 'green', fill: false },
    ]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// Simulate air data every 3 sec


setInterval(() => {
    const data = getAirQualityData();
    const time = new Date().toLocaleTimeString();
  
    // Add to chart
    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(data.pm25);
    chart.data.datasets[1].data.push(data.co2);
    chart.data.datasets[2].data.push(data.temp);
    chart.data.datasets[3].data.push(data.humidity);
  
    // Keep last 10 points
    if (chart.data.labels.length > 10) {
      chart.data.labels.shift();
      chart.data.datasets.forEach(ds => ds.data.shift());
    }
  
    chart.update();
  
    // 🌡️ Temperature-based Warning
    const temp = data.temp;
  
    if (temp < 15) {
      warningBox.textContent = "🥶 Cold Weather Warning!";
      warningBox.style.background = "#03A9F4";
      emoji.textContent = "🥶";
    } else if (temp > 30) {
      warningBox.textContent = "🥵 Hot Weather Warning!";
      warningBox.style.background = "#FF5722";
      emoji.textContent = "🥵";
    } else {
      warningBox.textContent = "😊 Comfortable Temperature";
      warningBox.style.background = "#8bc34a";
      emoji.textContent = "😊";
    }
  }, 3000);

  const stateCityMap = {
    "Maharashtra": {
      "Mumbai": [19.0760, 72.8777],
      "Pune": [18.5204, 73.8567]
    },
    "Karnataka": {
      "Bengaluru": [12.9716, 77.5946],
      "Mysuru": [12.2958, 76.6394]
    },
    "Delhi": {
      "New Delhi": [28.6139, 77.2090]
    },
    "Tamil Nadu": {
      "Chennai": [13.0827, 80.2707],
      "Coimbatore": [11.0168, 76.9558]
    }
  };
  
  // Populate states
  const stateSelect = document.getElementById("stateSelect");
  const citySelect = document.getElementById("citySelect");
  
  for (const state in stateCityMap) {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  }
  
  // Update cities when state changes
  function updateCities() {
    const selectedState = stateSelect.value;
    citySelect.innerHTML = '<option value="">--Select City--</option>';
  
    if (selectedState && stateCityMap[selectedState]) {
      const cities = stateCityMap[selectedState];
      for (const city in cities) {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      }
    }
  }
  
  // Zoom to city on map
  function selectCity() {
    const selectedState = stateSelect.value;
    const selectedCity = citySelect.value;
  
    if (selectedState && selectedCity) {
      const [lat, lon] = stateCityMap[selectedState][selectedCity];
      map.setView([lat, lon], 13);
      L.marker([lat, lon]).addTo(map).bindPopup(`${selectedCity}, ${selectedState}`).openPopup();
      locationText.textContent = `Location: ${selectedCity}, ${selectedState}`;
    }
  }
  