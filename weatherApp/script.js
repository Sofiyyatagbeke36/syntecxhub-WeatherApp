const apiKey = "YOUR_API_KEY_HERE"; // <-- PUT YOUR KEY HERE
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const error = document.getElementById("error");

// Ghana mock data for demo if API fails
const mockGhana = {
  accra: {temp: 30.5, humidity: 82, wind: 3.5, desc: "broken clouds", icon: "04d", main: "Clouds"},
  kumasi: {temp: 28.2, humidity: 85, wind: 2.1, desc: "light rain", icon: "10d", main: "Rain"},
  tamale: {temp: 35.1, humidity: 60, wind: 4.2, desc: "clear sky", icon: "01d", main: "Clear"},
  takoradi: {temp: 29.0, humidity: 78, wind: 3.8, desc: "scattered clouds", icon: "03d", main: "Clouds"},
  cape: {temp: 27.8, humidity: 80, wind: 3.0, desc: "overcast clouds", icon: "04d", main: "Clouds"}
};

const backgrounds = {
  Clear: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600",
  Clouds: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=1470",
  Rain: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1600",
  Default: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=1470"
};

function updateUI(data, cityName){
  document.getElementById("location").textContent = cityName + ", Ghana";
  document.getElementById("title").textContent = `Weather in ${cityName}`;
  document.getElementById("temp").textContent = `${data.temp.toFixed(1)}°C`;
  document.getElementById("desc").textContent = data.desc;
  document.getElementById("humidity").textContent = `Humidity: ${data.humidity}%`;
  document.getElementById("wind").textContent = `Wind speed: ${data.wind} km/h`;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
  document.getElementById("bg").style.backgroundImage = `url('${backgrounds[data.main] || backgrounds.Default}')`;
  error.style.display = "none";
}

async function getWeather(city){
  const cityLower = city.toLowerCase();
  let key = "accra";
  if(cityLower.includes("kumasi")) key = "kumasi";
  if(cityLower.includes("tamale")) key = "tamale";
  if(cityLower.includes("takoradi")) key = "takoradi";
  if(cityLower.includes("cape")) key = "cape";

  // If no API key, use mock immediately
  if(apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 20){
    console.log("Using mock data - add API key for live data");
    updateUI(mockGhana[key], city.charAt(0).toUpperCase() + city.slice(1));
    return;
  }

  try{
    const response = await fetch(apiUrl + city + ",GH" + `&appid=${apiKey}`);
    if(!response.ok) throw new Error("Not found");
    const data = await response.json();

    updateUI({
      temp: data.main.temp,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      desc: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main
    }, data.name);

  } catch(err){
    // Fallback to mock so something ALWAYS shows
    updateUI(mockGhana[key] || mockGhana.accra, city.charAt(0).toUpperCase() + city.slice(1));
    console.log("API failed, showing mock Ghana data");
  }
}

searchBtn.addEventListener("click", ()=>{
  if(cityInput.value.trim()!== "") getWeather(cityInput.value.trim());
});
cityInput.addEventListener("keydown", (e)=>{
  if(e.key === "Enter" && cityInput.value.trim()!== "") getWeather(cityInput.value.trim());
});

// Initial load
getWeather("Accra");