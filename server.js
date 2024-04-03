const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const db = require("./pass_db.js");
db.users_init_fixed();
db.vote_init_random(5); // you COULD change this, but you could also leave it alone?

const app = express();

const PORT = 8000;
app.use(express.static("static"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(cookieSession({ name: "session", keys: ["every_student_will_change_this_key_because_it_would_be_embarrassing_to_leave_it"] }));

const apiRouter = require("./routers/api");
app.use("/api/v1", apiRouter);

app.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`));
