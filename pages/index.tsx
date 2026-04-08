import Head from "next/head";
import { GetServerSideProps } from "next";

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

interface Props {
  weather: WeatherData;
}

const weatherEmoji: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌧️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "🌨️",
  80: "🌦️",
  81: "🌧️",
  82: "🌧️",
  95: "⛈️",
};

const weatherLabel: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Light showers",
  81: "Showers",
  82: "Heavy showers",
  95: "Thunderstorm",
};

export default function Home({ weather }: Props) {
  const emoji = weatherEmoji[weather.weathercode] ?? "🌈";
  const label = weatherLabel[weather.weathercode] ?? "Unknown";
  const tempF = Math.round(weather.temperature * 9 / 5 + 32);

  return (
    <>
      <Head>
        <title>Seattle Weather</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}>
        <p style={{ fontSize: "1rem", opacity: 0.8, margin: 0 }}>Right now in</p>
        <h1 style={{ fontSize: "3rem", margin: "0.25rem 0" }}>Seattle, WA</h1>
        <div style={{ fontSize: "8rem", lineHeight: 1 }}>{emoji}</div>
        <p style={{ fontSize: "4rem", fontWeight: 700, margin: "0.5rem 0" }}>
          {tempF}°F
        </p>
        <p style={{ fontSize: "1.5rem", margin: 0 }}>{label}</p>
        <p style={{ fontSize: "1rem", opacity: 0.7, marginTop: "1rem" }}>
          Wind: {Math.round(weather.windspeed)} km/h
        </p>
        <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "2rem" }}>
          Server-rendered at {new Date(weather.time).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}
        </p>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current_weather=true&timezone=America/Los_Angeles"
  );
  const data = await res.json();
  return {
    props: {
      weather: {
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
        time: data.current_weather.time,
      },
    },
  };
};
