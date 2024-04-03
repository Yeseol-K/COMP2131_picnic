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
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // current date
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    // OpenWeatherMap API free version only get current date weather...???
    const weatherData = {
      date: formattedDate,
      weather: data.weather[0].main,
      temperature: data.main.temp,
      icon: data.weather[0].icon,
    };

    console.log("weatherData", weatherData); //today weather only
    return { success: true, data: weatherData };
  } catch (error) {
    return { success: false, error: "Error fetching weather data: " + error.message };
  }
}

async function updateWeather() {
  try {
    const { success, data, error } = await getWeather();
    if (success) {
      //add weather info to html
      const temperatureElement = document.querySelector(".temp");
      const iconElement = document.querySelector(".weatherImg img");
      //kevin to change to celsius
      temperatureElement.textContent = `${Math.round(data.temperature - 273.15)}°C`;
      iconElement.src = `http://openweathermap.org/img/wn/${data.icon}.png`;
      iconElement.alt = "Weather Icon";
    } else {
      console.error("Error fetching weather data:", error);
    }
  } catch (error) {
    console.error("Error displaying weather:", error);
  }
}
