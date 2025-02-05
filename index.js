const form = document.getElementById("weatherForm");
const resultDiv = document.getElementById("weatherResult");

let weatherChart;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cities = document.getElementById("cityInput").value.trim();
  resultDiv.innerHTML = ""; // Limpiar resultados previos

  if (!cities) {
    resultDiv.innerHTML =
      '<div class="alert alert-danger">Please enter at least one city name!</div>';
    return;
  }

  const apiKey = "d49f768bd5ea4f249972455f214cadfe";
  const cityList = cities.split(",").map((city) => city.trim());

  const temperatures = [];
  const cityNames = [];

  for (const city of cityList) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`City "${city}" not found`);
      }

      const data = await response.json();
      cityNames.push(data.name);
      temperatures.push(data.main.temp);

      resultDiv.innerHTML += `
        <div class="card result-card p-3 mt-3">
          <div class="card-body text-center">
            <h5 class="card-title">${data.name}, ${data.sys.country} <i class="fas fa-map-marker-alt text-info"></i></h5>
            <p class="mb-2"><i class="fas fa-temperature-high text-danger"></i> <strong>${data.main.temp}°C</strong></p>
            <p class="mb-2"><i class="fas fa-cloud text-primary"></i> ${data.weather[0].description}</p>
            <p class="mb-0"><i class="fas fa-tint text-info"></i> Humidity: ${data.main.humidity}%</p>
          </div>
        </div>
      `;
    } catch (error) {
      resultDiv.innerHTML += `<div class="alert alert-danger">${error.message}</div>`;
    }
  }

  if (cityNames.length === 0) return;

  const chartContainer = document.createElement("div");
  chartContainer.classList.add("mt-4");
  chartContainer.innerHTML = '<canvas id="weatherChart"></canvas>';
  resultDiv.appendChild(chartContainer);
  const ctx = document.getElementById("weatherChart").getContext("2d");
  if (weatherChart) {
    weatherChart.destroy();
  }

  weatherChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: cityNames,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperatures,
          backgroundColor: "rgba(54, 162, 100, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
});
