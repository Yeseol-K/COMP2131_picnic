let fake_local_session = { username: "nobody" };

let fake_local_votesdata = [
  {
    date: "2024-04-01",
    votes: {
      who: "yes",
      what: "no",
    },
  },
  {
    date: "2024-04-02",
    votes: {
      what: "no",
      when: "yes",
      where: "yes",
    },
  },
  {
    date: "2024-04-03",
    votes: {
      how: "no",
      random: Math.random() < 0.5 ? "no" : "yes",
    },
  },
];

//////  This line, and everything above this line, should be deleted when you get the AJAX working.  Really.

async function getSessionFromBackend() {
  const res = await fetch("/api/v1/getSession", {
    method: "GET",
  });
  const data = await res.json();
  return data;
}

async function getVotesFromBackend() {
  try {
    const res = await fetch("/api/v1/votes/list", {
      method: "GET",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching votes:", error);
  }
}

async function setMyVote(day, vote) {
  // this is a placeholder.  rewrite it completely.  (you can ignore this for Pass tier)
  if (!fake_local_session) return false;
  let me = fake_local_session.username;
  let dayofvotes = fake_local_votesdata.filter((vd) => vd.date === day)[0];
  if (!me || !dayofvotes) return false;
  if (vote === "maybe") {
    delete dayofvotes.votes[me];
  } else {
    dayofvotes.votes[me] = vote;
  }
  return { success: true };
}

async function ajaxSignup(username, password) {
  const response = await fetch("/api/v1/signup", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

async function ajaxLogin(username, password) {
  const response = await fetch("/api/v1/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

async function ajaxLogout() {
  try {
    const response = await fetch("/api/v1/logout", {
      method: "POST",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

async function getWeather() {
  try {
    const apiKey = "fba94de11390c420fdbf3a4328a4c2e9";
    const latitude = 49.28419;
    const longitude = -123.11532;
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?id=524901&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const weatherByDate = {};

    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      const temperature = item.main.temp;

      if (!(date in weatherByDate) || temperature > weatherByDate[date].temperature) {
        weatherByDate[date] = {
          temperature: temperature,
          weather: item.weather[0].main,
          icon: item.weather[0].icon,
        };
      }
    });

    console.log("weatherData", weatherByDate);

    return { success: true, data: weatherByDate };
  } catch (error) {
    return { success: false, error: "Error fetching weather data: " + error.message };
  }
}

async function updateWeather() {
  try {
    const { success, data, error } = await getWeather();
    if (success) {
      const temperature = document.querySelectorAll(".temp");
      const icon = document.querySelectorAll(".weatherImg img");

      temperature.forEach((element, i) => {
        const date = Object.keys(data)[i];
        const temperatureData = data[date];

        const celsiusTemperature = Math.round(temperatureData.temperature - 273.15);
        element.textContent = `${celsiusTemperature}°C`;

        const iconUrl = `http://openweathermap.org/img/wn/${temperatureData.icon}.png`;
        const iconAlt = "Weather Icon";
        icon[i].src = iconUrl;
        icon[i].alt = iconAlt;
      });
    } else {
      console.error("Error fetching weather data:", error);
    }
  } catch (error) {
    console.error("Error displaying weather:", error);
  }
}
