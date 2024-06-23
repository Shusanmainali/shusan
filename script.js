document.addEventListener('DOMContentLoaded', function() {
    getWeatherData('Jamshedpur, IN');
    loadStoredWeatherData();

    document.getElementById('weatherForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const city = document.getElementById('city').value.trim();
        if (city) {
            getWeatherData(city);
        } else {
            alert('Please enter a valid city name.');
        }
    });
});

function getWeatherData(city) {
    const apiKey = 'd0c23fea1640e4b22986ae67ce4d1ed4';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const weatherResult = document.getElementById('weatherResult');
            const date = new Date().toLocaleDateString();
            weatherResult.innerHTML = `
                <p class="date">${date}</p>
                <h2>${data.name}</h2>
                <p>${data.weather[0].description}</p>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
            `;
            saveWeatherData(city, data.main.temp, data.weather[0].description, data.main.humidity, date);
            loadStoredWeatherData();  // Refresh the stored data after saving new data
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = '<p>City not found. Please try again.</p>';
            console.error('Error:', error);
        });
}

function saveWeatherData(city, temp, description, humidity, date) {
    fetch('save_weather.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ city, temp, description, humidity, date })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

function loadStoredWeatherData() {
    fetch('fetch_weather.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch stored data');
            }
            return response.json();
        })
        .then(data => {
            const storedWeatherData = document.getElementById('storedWeatherData');
            if (data.length > 0) {
                const table = document.createElement('table');
                table.innerHTML = `
                    <tr>
                        <th>Date</th>
                        <th>City</th>
                        <th>Temperature</th>
                        <th>Description</th>
                        <th>Humidity</th>
                    </tr>
                `;
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.date}</td>
                        <td>${row.city}</td>
                        <td>${row.temperature}°C</td>
                        <td>${row.description}</td>
                        <td>${row.humidity}%</td>
                    `;
                    table.appendChild(tr);
                });
                storedWeatherData.innerHTML = '';
                storedWeatherData.appendChild(table);
            } else {
                storedWeatherData.innerHTML = '<p>No stored weather data found.</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}
