class WeatherForecastClient {
  constructor(location, apiKey) {
    this.appId = apiKey || '50a34e070dd5c09a99554b57ab7ea7e2';
    this.url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${this.appId}`;
  }

  async getWeather() {
    try {
      const res = await fetch(this.url);
      const data = await res.json();

      if (!data || !data.main || !data.weather || !data.weather[0]) {
        throw new Error('Invalid weather response');
      }

      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main.toLowerCase()
      };
    } catch (err) {
      console.warn('Weather API returned an error:', err);
      return { temperature: 0, condition: 'clear' };
    }
  }
}
