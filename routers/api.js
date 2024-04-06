let express = require("express");
let db = require("../pass_db");

const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

router.get("/test", (req, res) => {
  res.send("tested");
});

router.get("/getSession", (req, res) => {
  if (req.session.user === undefined) {
    res.status(200).json({
      success: true,
      data: null,
    });
  } else {
    res.status(200).json({
      success: true,
      data: {
        username: req.session.user,
      },
    });
  }
});

router.post("/signup", (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === "" || password === "") {
      throw new Error("Username or password cannot be empty");
    }

    const newUser = db.createUser(username, password);
    console.log = { newUser };

    if (!newUser) {
      throw new Error("Username is already taken");
    }

    req.session.user = { username: username, password: password };
    res.status(200).json({
      success: true,
      data: {
        username: username,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.authenticateUser(username, password);
  if (user !== null) {
    req.session.user = user;

    res.status(200).json({
      success: true,
      data: {
        username: username,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      error: "Invalid Username or Password",
    });
  }
});

router.post("/logout", (req, res) => {
  req.session = null;
  res.status(200).json({ success: true, message: "Logout successful" });
});

router.get("/votes/list", (req, res) => {
  try {
    const votesData = db.getVotesAllDays();
    res.status(200).json({ success: true, data: votesData });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/getToken/openweathermap", async (req, res) => {
  try {
    const apiKey = process.env.APIKEY;
    const latitude = process.env.LATITUDE;
    const longitude = process.env.LONGITUDE;

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

    res.status(200).json({
      success: true,
      data: weatherByDate,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

router.post("/votes/set", async (req, res) => {
  try {
    const username = req.session.user.username;
    const { day, vote } = req.body;

    await db.placeVote(username, day, vote);
    const getDayVote = await db.getVotesOneDay(day);
    console.log(getDayVote);
    res.status(200).json({
      success: true,
      TheDayVote: username,
    });
  } catch (error) {
    console.error("Error setting vote:", error);
    res.status(500).json({ success: false, error: "Error setting vote" });
  }
});

router.post("/votes/refresh", (req, res) => {
  try {
    db.vote_init_empty();
    const numDays = 5;
    db.vote_init_random(numDays);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error refreshing votes with random values:", error);
    res.status(500).json({ success: false, error: "Error refreshing votes with random values" });
  }
});

module.exports = router;
