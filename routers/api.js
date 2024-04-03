let express = require("express");
let db = require("../pass_db");

const router = express.Router();

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

module.exports = router;
