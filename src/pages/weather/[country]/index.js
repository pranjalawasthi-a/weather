import { useEffect, useState } from "react";
import { fetchWeather } from "@/utils/basicUtils.js";
import { useRouter } from "next/router";

const WeatherPage = () => {
    const router = useRouter();
    const { country } = router.query; 
    const [weather, setWeather] = useState(null);
    const [unit, setUnit] = useState("metric");
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (country) {
            const decodedCountry = decodeURIComponent(country); 
            setLoading(true);
            setError(null);

            fetchWeather(decodedCountry)
                .then((data) => {
                    if (data.cod && data.cod !== 200) {
                        setError(data.message || "Unable to fetch weather data.");
                        setWeather(null);
                    } else {
                        setWeather(data);
                    }
                })
                .catch(() => setError("Failed to fetch data. Please try again."))
                .finally(() => setLoading(false));
        }
    }, [country]);

   

    return (
        <div>
            <h2>Weather in {country}</h2>

            <button onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}>
                Switch to {unit === "metric" ? "Imperial" : "Metric"}
            </button>


            {error ? (
                <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
            ) : weather ? (
                <div>
                    <p>Temperature: {weather.main.temp}°{unit === "metric" ? "C" : "F"}</p>
                    <p>Precipitation: {weather.weather[0].description}</p>
                    <p>Wind Speed: {weather.wind.speed} {unit === "metric" ? "m/s" : "mph"}</p>
                    <p>Cloud Coverage: {weather.clouds.all}%</p>
                </div>
            ) : null}
        </div>
    );
};

export default WeatherPage;