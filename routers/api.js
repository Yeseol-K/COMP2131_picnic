let express = require("express");
let db = require("../pass_db");

const router = express.Router();



router.get("/test", (req, res) => {
  res.send("tested")
})



module.exports = router;



