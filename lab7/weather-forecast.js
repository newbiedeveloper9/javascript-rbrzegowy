var timeoutId;
var cities = JSON.parse(localStorage.getItem('cities')) ?? []
var citiesData = [];

document.addEventListener('DOMContentLoaded', async () => {
    await refreshWeather();
    const interval = setInterval(async () => {
        await refreshWeather();
    }, 1000 * 60 * 5)();
    clearInterval(interval);
})

document.getElementById("cityInput").addEventListener("input", async function () {
    let city = this.value;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(async function () {
        await fetch("http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=" + city + "&types=CITY&sort=name", {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        })
            .then(async (response) => await response.json())
            .then(cities => {
                let cityList = document.getElementById("cityList");
                cityList.innerHTML = "";

                let cityPoland = cities.data.filter(x => x.country == 'Poland')[0]?.city;
                if (cityPoland != 'undefined' && cityPoland != null) {
                    let option = document.createElement("option");
                    option.text = cityPoland
                    cityList.appendChild(option);
                }
                else {
                    for (let i = 0; i < cities.data.length; i++) {
                        let option = document.createElement("option");
                        option.text = cities.data[i].city;
                        cityList.appendChild(option);
                    }
                }
            });
    }, 800);
});

document.getElementById("deleteWeatherBtn").addEventListener("click", async () => {
    let city = document.getElementById("cityList").value;
    cities = cities.filter(x => x !== city);
    localStorage.setItem('cities', JSON.stringify(cities));
    await refreshWeather();
});

document.getElementById("getWeatherBtn").addEventListener("click", async () => {
    let city = document.getElementById("cityList").value;
    if (cities.some(x => x == city) || city == 'undefined' || city == '' || city == null)
        return;
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
    await refreshWeather();
});

async function refreshWeather() {
    citiesData = []
    var fetchingTask = new Promise((resolve, reject) => {
        cities.forEach(async (city) => {
            await fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=33a861c82d591ab52c21fb63bd0a30f7")
                .then(async function (response) {
                    return await response.json();
                })
                .then(function (weather) {
                    let hours = [];
                    let temperatures = [];

                    for (let i = 0; i < weather.list.length; i++) {
                        hours.push(weather.list[i].dt_txt);
                        temperatures.push(temperatureConverter(weather.list[i].main.temp));
                    }
                    citiesData.push({
                        icon: "http://openweathermap.org/img/wn/" + weather.list[0].weather[0].icon + "@2x.png",
                        weather: weather.list[0].weather[0].main,
                        temperatures: temperatures,
                        hours: hours,
                        city: city,
                        rgba: random_rgba()
                    })

                    if (citiesData.length >= cities.length) {
                        resolve();
                    }
                });
        });
    });

    fetchingTask.then(function () {
        citiesData.sort((a, b) => {
            const nameA = a.city.toUpperCase();
            const nameB = b.city.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        setChart();
        setStats();
    });
}

function setChart() {
    dataset = citiesData.map(x => {
        return {
            label: x.city,
            data: x.temperatures,
            backgroundColor: x.rgba,
            borderColor: x.rgba,
            borderWidth: 1
        }
    });

    let ctx = document.getElementById("weatherChart").getContext("2d");
    let chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: citiesData.find(x => x !== undefined).hours,
            datasets: dataset
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function setStats() {
    var blocks = citiesData.map(x => {
        return `<div style="margin: 50px">
        <img class="icon" src="${x.icon}" height="128" width="128">
        <p id="iconWeather">${x.city}: ${x.weather} ${x.temperatures[0]}C</p>
    </div>`;
    });

    let data = document.getElementById("data");
    data.innerHTML = blocks.join('');
}

//https://stackoverflow.com/questions/23095637/how-do-you-get-random-rgb-in-javascript
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.25 + ')';
}

//https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_temp_converter_kelvin_to_celsius
function temperatureConverter(valNum) {
    return parseInt(valNum - 273.15)
}