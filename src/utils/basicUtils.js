

const fetchCountries = async () => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  return response.json();
};

const fetchWeather = async (capital) => {
  const apiKey = "794ee95e63c5a32aaf88cd813fa2e425";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
  );
  return response.json();
};

export { fetchCountries, fetchWeather };
