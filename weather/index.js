// Getting elements from document

let getBtn = document.getElementById('getBtn')
let weather = document.querySelector('.weather-now')
let seachInp = document.getElementById('search-inp')
let searchForm = document.getElementById('search-form')
let warning = document.getElementById('warning')
let suggestionBtn = document.querySelectorAll('.suggestion-btn')
let tempUnitDiv = document.querySelector('#temp-units')
let [ btn1, btn2] = document.querySelectorAll('.units-btn')

// Insert your API key

let apiKey = ''

// Temperature unit marker

let marker = 'C'

// Declation of local variables to hold the data from fetch

let mainTemp, feelsLike

// Function to get weather based on longitute and latitute parameters

let getWeather = (longitude, latitude) => {

    // API call

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
        .then(res => {
            return res.json()
        })
        .then(weatherData => {

            mainTemp = weatherData.main.temp;
            feelsLike = weatherData.main.feels_like;

            marker = 'C'

            btn1.classList.add('changeSpanColor')
            btn2.classList.remove('changeSpanColor')

            // Creating the element to show the data on the document

            weather.innerHTML = `
                    <div id="weatherData" class="degrees">
                        <div class="main-info" style="display: flex; flex-direction: column;">
                            <div>
                                <h1>${weatherData.name}, ${weatherData.sys.country}</h1>
                                <h3><span id="main-temp">${mainTemp}</span> <span class="markers">${marker}</span>°</h3>
                                <p>Feels like: <span id="feels-like">${feelsLike}</span> <span class="markers">${marker}</span>°</p>
                            </div>
                            
                            <figure>
                                <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="">
                            </figure>
                        </div>

                        <div class="additional-info">
                            <p>Pressure: ${weatherData.main.pressure} mbar</p>
                            <p>Humidity: ${weatherData.main.humidity}%</p>
                            <p>Wind: ${weatherData.wind.speed} m/h</p>
                        </div>

                    </div>
            `
        }
        )
        .catch(err => {
            throw err;
        })
}

// API call to get coordinates based on the locality name

let getPosition = (name) => {

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&appid=${apiKey}`)
    .then(res => {
        return res.json()
    })
    .then(data => {

        // Call get weather with the coordinates results

        getWeather(data[0].lon, data[0].lat)

    })
    .catch(err => {throw err})
}

// Calls the get position to get the coordinates and then the weather from the suggestion bts

suggestionBtn.forEach(btn => {
    btn.addEventListener('click', ({ target }) => {
        getPosition(target.innerText)
    })
})

// Apply the styles to the styles of change and covert the temperature units manually

tempUnitDiv.addEventListener('click', ({ target }) => {
    if(target.innerText == 'C') {
        btn1.classList.add('changeSpanColor')
        btn2.classList.remove('changeSpanColor')

        if(marker == 'F') {
            mainTemp = (Math.round(((mainTemp - 32) / 1.8) * 100) / 100).toFixed(2)
            feelsLike = (Math.round(((feelsLike - 32) / 1.8) * 100) / 100).toFixed(2)
        }

        marker = 'C'
    } else if(target.innerText == 'F') {
        btn1.classList.remove('changeSpanColor')
        btn2.classList.add('changeSpanColor')

        if(marker == 'C') {
            mainTemp = (Math.round(((mainTemp * 1.8) + 32) * 100) / 100).toFixed(2)
            feelsLike = (Math.round(((feelsLike * 1.8) + 32) * 100) / 100).toFixed(2)
        }

        marker = 'F'
    }

    // Put the result in the document

    document.getElementById('main-temp').innerText = `${mainTemp}`
    document.getElementById('feels-like').innerText = `${feelsLike}`
    document.querySelectorAll('.markers').forEach(element => {
        element.innerText = `${marker}`
    })
})

// Hold the submit adding the value as a parameter to get position function

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()

    getPosition(seachInp.value)

})

// Get the current location on the geolocation API and then get the weather

getBtn.addEventListener('click', () => {
    let location = navigator.geolocation

    location.getCurrentPosition((data) => {

        getWeather(data.coords.longitude, data.coords.latitude)

    }, err => {throw err})
})

//  On window load check if the location permission is accept

window.onload = () => {
    let location = navigator.geolocation

    navigator.permissions.query({ name: 'geolocation'})
    .then(res => {

        if(res.state == 'granted' || res.state == 'prompt') {
            // if granted, get the weather from current location
            
            location.getCurrentPosition((data) => {
                getWeather(data.coords.longitude, data.coords.latitude)
            
            }, err => {throw err})
        } else {

            // if not, get the weather from New York

            getPosition('New york')
            
        }
    })
    .catch(err => {throw err})
}