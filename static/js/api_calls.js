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
  const response = await fetch("/api/v1/getToken/openweathermap", {
    method: "GET",
  });
  return response.json();
}

async function setMyVote(day, vote) {
  // this is a placeholder.  rewrite it completely.  (you can ignore this for Pass tier)
  const res = await fetch("/api/v1/votes/set", {
    method: "POST",
    body: JSON.stringify({ day, vote }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

async function refreshVotesRandom() {
  try {
    const response = await fetch("/api/v1/votes/refresh", {
      method: "POST",
    });
    const data = await response.json();

    if (data.success) {
      console.log("Votes refreshed with random values successfully.");
    } else {
      console.error("Error refreshing votes with random values:", data.error);
    }
  } catch (error) {
    console.error("Error refreshing votes with random values:", error.message);
  }
}
