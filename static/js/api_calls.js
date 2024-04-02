let fake_local_session = { username: 'nobody' };

let fake_local_votesdata = [
  {
    date: "2024-04-01",
    votes: {
      'who': "yes",
      'what': "no",
    },
  },
  {
    date: "2024-04-02",
    votes: {
      'what': "no",
      'when': "yes",
      'where': "yes",
    },
  },
  {
    date: "2024-04-03",
    votes: {
      'how': "no",
      'random': Math.random() < 0.5 ? "no" : "yes",
    },
  },
]


//////  This line, and everything above this line, should be deleted when you get the AJAX working.  Really.






async function getSessionFromBackend() {
  // this is a placeholder.  rewrite it completely.  (for Pass tier)
  return { success: true, data: fake_local_session };
}

async function getVotesFromBackend() {
  // this is a placeholder.  rewrite it completely.  (for Pass tier)
  return { success: true, data: fake_local_votesdata };
}






async function setMyVote(day, vote) {
  // this is a placeholder.  rewrite it completely.  (you can ignore this for Pass tier)
  if (!fake_local_session) return false;
  let me = fake_local_session.username;
  let dayofvotes = fake_local_votesdata.filter(vd => vd.date === day)[0];
  if (!me || !dayofvotes) return false;
  if (vote === 'maybe') {
    delete dayofvotes.votes[me];
  } else {
    dayofvotes.votes[me] = vote;
  }
  return { success: true };
}






async function ajaxSignup(username, password) {
  fake_local_session = { username };
  // Above here is a placeholder.  Delete it and use AJAX.

  // The next part is fake-but-the-correct-format.
  return {
    success: true,
    data: fake_local_session,
  }
}


async function ajaxLogin(username, password) {
  fake_local_session = { username };
  // Above here is a placeholder.  Delete it and use AJAX.

  // The next part is fake-but-the-correct-format.
  return {
    success: true,
    data: fake_local_session,
  }

}

async function ajaxLogout(username, password) {
  fake_local_session = undefined;
  // Above here is a placeholder.  Delete it and use AJAX.

  // The next part is fake-but-the-correct-format.
  return {
    success: true,
    data: fake_local_session,
  }

}


