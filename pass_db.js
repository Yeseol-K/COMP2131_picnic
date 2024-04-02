const date_fns = require("date-fns");


let users = {}
let votes = {};





function users_init_fixed() {
  users = {
    'fry': {
      username: 'fry',
      password: 'f'
    },
    'leela': {
      username: 'leela',
      password: 'l'
    },
    'bender': {
      username: 'bender',
      password: 'b'
    },
    'farnsworth': {
      username: 'farnsworth',
      password: 'f'
    },
  }
}

function vote_init_fixed() {
  votes = {
    "2024-04-01": {
      "fry": "no",
      "leela": "no",
      "bender": "no",
      "farnsworth": "yes"
    },
    "2024-04-02": {},
    "2024-04-03": {
      "fry": "yes"
    },
    "2024-04-04": {
      "fry": "yes",
      "bender": "yes",
      "farnsworth": "no"
    },
  }
}

function vote_init_empty() {
  votes = {};
}

function vote_init_random(num_days) {
  let today = new Date();
  console.log("seeidng a bunch of false votes for", today);
  for (let i = 0; i < num_days; i++) {
    let d = date_fns.add(today, { days: i });
    let d_str = date_fns.format(d, "yyyy-MM-dd")
    if (votes[d_str] === undefined) {
      votes[d_str] = {}
    }
    for (let user in users) {
      let valence = Math.random();
      if (valence < 0.25) {
        placeVote(user, d_str, "no");
      } else if (valence > 0.75) {
        placeVote(user, d_str, "yes");
      }
    }
  }
  console.log(JSON.stringify(votes, null, 2))
}






function isUsernameTaken(username) {
  return !!users[username];
}

function createUser(username, password) {
  if (!isUsernameTaken(username)) {
    users[username] = {
      username,
      password,
    }
    return true;
  } else {
    return false;
  }
}

function authenticateUser(username, password) {
  if (users[username]) {
    let user = users[username];
    if (user.password === password) {
      return { username: user.username }
    }
  } else {
    return null;
  }
}






function getVotesAllDays() {
  return JSON.parse(JSON.stringify(votes))
}


function getVotesOneDay(date) {
  return JSON.parse(JSON.stringify(votes[date]))
}

function placeVote(username, date, vote) {
  if (votes[date] === undefined) {
    votes[date] = {};
  }
  if (!vote || vote === "maybe") {
    delete votes[date][username];
  } else {
    votes[date][username] = vote;
  }
}




module.exports = {
  // these are the actual useful methods
  isUsernameTaken,
  createUser,
  authenticateUser,
  getVotesAllDays,
  getVotesOneDay,
  placeVote,

  // I thought I'd try organizing my seed-data like this instead, is this helpful?
  users_init_fixed,
  vote_init_empty,
  vote_init_fixed,
  vote_init_random,
}