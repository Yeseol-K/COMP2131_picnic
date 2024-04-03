function showError(error) {
  let errorMessage = document.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.innerText = error;
    errorMessage.style.display = "inline-block";
  }
}

function clearError() {
  let errorMessage = document.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.innerText = "";
    errorMessage.style.display = "none";
  }
}

function setLoggedIn(loggedInBoolean) {
  let body = document.body;
  body.dataset.loggedIn = loggedInBoolean ? "true" : "false";
}

function createExistingVote(voter, vote) {
  let voteDiv = document.createElement("div");
  voteDiv.innerHTML = "";
  if (vote === "yes") {
    voteDiv.classList.add("vote-yes");
  } else if (vote === "no") {
    voteDiv.classList.add("vote-no");
  }
  voteDiv.innerText = voter;
  return voteDiv;
}

function createOneDayCard(dayData, currentSession, weather) {
  let date = new Date(dayData.date + "T00:00:00");
  let card = document.createElement("div");
  card.innerHTML = `
      <div class="cardtop">
      <div class="date">
      <div class="dow">${date.toLocaleString("en-CA", { weekday: "long" })}</div>
      <div class="dom">${date.toLocaleString("en-CA", { month: "short", day: "numeric" })}</div>
      </div>
      <div class="weather">
      <div class="temp">
      </div>
      <div class="weatherImg">
      <img>
      </div>
      </div>
      </div>
      <div class="make-vote">
      <div class="satis-tier forloggedin">
      Can you attend?
      <div class="">
      <button class="vote yes" data-vote="yes">
      Yes ✔️
      </button>
      <button class="vote maybe" data-vote="">
      ??
      </button>
      <button class="vote no" data-vote="no">
              No ❌
              </button>
              </div>
              </div>
              </div>
              <div class="existing-votes">
              </div>
              `;
  card.classList.add("card");
  const day = dayData.date;
  card.dataset.date = day;

  //해당 날에 맞는 날씨 가져오기 근데 api는 현재 날씨만 보여줌 뭐지????
  if (weather && weather[day]) {
    let temp = weather[day].temp;
    let icon = weather[day].icon;
    updateWeather(day, temp, icon);
  }
  let existingVotesDiv = card.querySelector(".existing-votes");
  for (let [voter, vote] of Object.entries(dayData.votes)) {
    existingVotesDiv.append(createExistingVote(voter, vote));
  }
  updateWeather(weather); //update the weather info to card.
  return card;
}

function updateVotableDays(daysWithVotes, currentSession, weatherForecasts) {
  let daysView = document.querySelector(".days-view");
  if (!daysView) {
    console.error("could not find element to put days into");
    return;
  }

  daysView.innerHTML = "";
  for (let date in daysWithVotes) {
    let votes = daysWithVotes[date];
    let weather = weatherForecasts?.[date];
    daysView.append(createOneDayCard({ date, votes }, currentSession, weather));
  }
}

class FrontendState {
  constructor() {
    this.currentSession = undefined;
    this.daysWithVotes = [];
    this.weatherForecasts = {};
  }

  async refreshAllState(updateView = true) {
    await Promise.all([this.refreshVotesState(false), this.refreshWeatherState(false), this.refreshSessionState(false)]);
    if (updateView) {
      this.updateView();
    }
  }

  async refreshVotesState(updateView = true) {
    let { success, data, error } = await getVotesFromBackend();
    if (success) {
      this.daysWithVotes = data;
    } else {
      showError(error);
    }
    if (updateView) {
      this.updateView();
    }
  }

  async refreshWeatherState(updateView = true) {
    try {
      const { success, data, error } = await getWeather();
      if (success) {
        this.weatherForecasts = data.days; // 날씨 정보를 저장
      } else {
        showError(error);
      }
      if (updateView) {
        this.updateView();
      }
    } catch (error) {
      showError("Error refreshing weather state: " + error.message);
    }
  }

  async refreshSessionState(updateView = true) {
    let { success, data, error } = await getSessionFromBackend();
    if (success) {
      this.currentSession = data;
    } else {
      showError(error);
    }
    if (updateView) {
      this.updateView();
    }
  }

  async updateView() {
    setLoggedIn(!!this.currentSession);
    let loggedInSpan = document.querySelector(".forloggedin span");
    if (loggedInSpan) {
      loggedInSpan.innerText = this.currentSession ? `Logged in as ${this.currentSession.username.username}` : "";
    }
    updateVotableDays(this.daysWithVotes, this.currentSession, this.weatherForecasts);
  }
}

const fes = new FrontendState();
fes.refreshAllState();

async function handleAuthEvent(event) {
  event.preventDefault();
  // console.log(event.currentTarget, event.target)
  let usernameInput = event.currentTarget.querySelector("#headerusername");
  let usernameValue = usernameInput.value;
  let passwordInput = event.currentTarget.querySelector("#headerpassword");
  let passwordValue = passwordInput.value;
  let button = event.target.closest("button");
  if (button) {
    let authActionName = button?.dataset?.authAction;
    let authActionFunction = {
      signup: ajaxSignup,
      login: ajaxLogin,
      logout: ajaxLogout,
    }[authActionName];
    if (authActionFunction) {
      clearError();
    }
    let authResult = await authActionFunction(usernameValue, passwordValue);
    if (authResult && authResult.success) {
      await fes.refreshSessionState();
      usernameInput.value = passwordInput.value = "";
    } else if (authResult) {
      showError(authResult.error);
    } else {
      showError("unknown network error");
    }
  }
}

const authform = document.querySelector("form.authform");
authform.addEventListener("click", handleAuthEvent);
authform.addEventListener("load", setLoggedIn(false));

async function handleVoteEvent(event) {
  event.preventDefault();
  let button = event.target.closest("button.vote");
  // console.log(button)

  if (button) {
    let voteVal;
    if (button.classList.contains("yes")) {
      voteVal = "yes";
    }
    if (button.classList.contains("no")) {
      voteVal = "no";
    }
    if (button.classList.contains("maybe")) {
      voteVal = "maybe";
    }
    let cardDiv = button.closest("div.card");
    if (!voteVal || !cardDiv) {
      // console.log({ voteVal, cardDiv })
      return;
    }
    let cardDate = cardDiv.dataset.date;
    let voteActionResult = await setMyVote(cardDate, voteVal);

    if (voteActionResult) {
      await fes.refreshVotesState();
    }
  }
}

const daysViewDiv = document.querySelector("section.days-view");
daysViewDiv.addEventListener("click", handleVoteEvent);
