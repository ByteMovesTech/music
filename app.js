const state = {
  tournament: null,
  size: 16,
  currentRound: 0,
  currentMatch: 0,
  rounds: [],
  showBracket: true
};

const $ = id => document.getElementById(id);

const screens = {
  home: $("homeScreen"),
  create: $("createScreen"),
  tournament: $("tournamentScreen"),
  champion: $("championScreen")
};


/* =========================================
   SCREEN MANAGEMENT
========================================= */

function showScreen(name) {

  Object.values(screens).forEach(screen => {
    screen.classList.remove("active");
  });

  screens[name].classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================
   HOME
========================================= */

$("createBtn").addEventListener("click", () => {

  showScreen("create");

  $("tournamentName").focus();

});


$("backFromCreate").addEventListener(
  "click",
  () => showScreen("home")
);


$("quitBtn").addEventListener("click", () => {

  if (
    confirm(
      "Exit this tournament? Your current progress will be lost unless you saved it."
    )
  ) {
    showScreen("home");
  }

});


/* =========================================
   TOURNAMENT SIZE
========================================= */

document
  .querySelectorAll(".size-choice")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".size-choice")
        .forEach(btn => {
          btn.classList.remove("selected");
        });

      button.classList.add("selected");

      state.size =
        Number(button.dataset.size);

      updateSongCount();

    });

  });


/* =========================================
   SONG PARSING
========================================= */

$("songText").addEventListener(
  "input",
  updateSongCount
);


function parseSongs(text) {

  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => {

      const parts = line.split("|");

      return {

        id:
          `song-${Date.now()}-${index}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,

        title:
          parts[0].trim(),

        youtube:
          (parts.slice(1).join("|") || "").trim()

      };

    })
    .filter(song => song.title);

}


function updateSongCount() {

  const count =
    parseSongs($("songText").value).length;

  $("songCount").textContent =
    `${count} song${count === 1 ? "" : "s"} entered`;

}


/* =========================================
   DEMO SONGS
========================================= */

$("demoBtn").addEventListener("click", () => {

  const songs16 = [

    "Stellar | https://www.youtube.com/",
    "Drive | https://www.youtube.com/",
    "Wish You Were Here | https://www.youtube.com/",
    "Anna Molly | https://www.youtube.com/",
    "Megalomaniac | https://www.youtube.com/",
    "Pardon Me | https://www.youtube.com/",
    "Warning | https://www.youtube.com/",
    "Nice to Know You | https://www.youtube.com/",
    "Talk Shows on Mute | https://www.youtube.com/",
    "Aqueous Transmission | https://www.youtube.com/",
    "Dig | https://www.youtube.com/",
    "Love Hurts | https://www.youtube.com/",
    "Are You In? | https://www.youtube.com/",
    "Privilege | https://www.youtube.com/",
    "Make Yourself | https://www.youtube.com/",
    "Megalomaniac (Live) | https://www.youtube.com/"

  ];

  $("tournamentName").value =
    "Demo Tournament of Tunes";

  $("songText").value =
    songs16.join("\n");

  state.size = 16;

  document
    .querySelectorAll(".size-choice")
    .forEach(button => {

      button.classList.toggle(
        "selected",
        Number(button.dataset.size) === 16
      );

    });

  updateSongCount();

});


/* =========================================
   BUILD TOURNAMENT
========================================= */

$("buildBtn").addEventListener("click", () => {

  const name =
    $("tournamentName").value.trim() ||
    "Mike & Jaclyn's Tournament of Tunes";

  const songs =
    parseSongs($("songText").value);

  const error =
    $("createError");


  if (songs.length !== state.size) {

    error.textContent =
      `You selected ${state.size} songs. Please enter exactly ${state.size}.`;

    return;

  }


  error.textContent = "";


  startTournament({

    title: name,

    size: state.size,

    songs: songs

  });

});


/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {

  const a = [...array];

  for (
    let i = a.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      a[i],
      a[j]
    ] =
      [
        a[j],
        a[i]
      ];

  }

  return a;
}


/* =========================================
   START TOURNAMENT
========================================= */

function startTournament(tournament) {

  state.tournament =
    tournament;

  state.currentRound = 0;

  state.currentMatch = 0;

  state.showBracket = true;


  const seeded =
    shuffle(tournament.songs);


  state.rounds = [

    {

      name:
        roundName(tournament.size),

      matches:
        seeded.reduce(
          (arr, song, i) => {

            if (i % 2 === 0) {

              arr.push({
                songs: [song],
                winner: null
              });

            } else {

              arr[arr.length - 1]
                .songs
                .push(song);

            }

            return arr;

          },
          []
        )

    }

  ];


  buildEmptyFutureRounds();


  showScreen("tournament");

  renderTournament();

}


/* =========================================
   CREATE FUTURE ROUNDS
========================================= */

function buildEmptyFutureRounds() {

  let matchCount =
    state.rounds[0].matches.length / 2;


  while (matchCount >= 1) {

    const names =
      roundNames(state.tournament.size);

    const nextIndex =
      state.rounds.length;


    state.rounds.push({

      name:
        names[nextIndex] ||
        "Final",

      matches:
        Array.from(
          {
            length: matchCount
          },
          () => ({
            songs: [],
            winner: null
          })
        )

    });


    matchCount =
      Math.floor(matchCount / 2);

    if (matchCount === 0) {
      break;
    }

  }

}


/* =========================================
   ROUND NAMES
========================================= */

function roundNames(size) {

  const names = [];

  let count = size;


  while (count >= 2) {

    if (count === 2) {

      names.push("Final");

    }

    else if (count === 4) {

      names.push("Semifinals");

    }

    else if (count === 8) {

      names.push("Quarterfinals");

    }

    else if (count === 16) {

      names.push("Round of 16");

    }

    else if (count === 32) {

      names.push("Round of 32");

    }

    else {

      names.push(
        `Round of ${count}`
      );

    }

    count /= 2;

  }

  return names;
}


function roundName(size) {

  return roundNames(size)[0];

}


/* =========================================
   RENDER TOURNAMENT
========================================= */

function renderTournament() {

  const tournament =
    state.tournament;


  $("tournamentTitle").textContent =
    tournament.title;


  $("roundLabel").textContent =
    state.rounds[
      state.currentRound
    ].name;


  renderMatchup();

  renderBracket();

}


/* =========================================
   RENDER CURRENT MATCH
========================================= */

function renderMatchup() {

  const round =
    state.rounds[
      state.currentRound
    ];

  const match =
    round.matches[
      state.currentMatch
    ];


  const totalMatches =
    state.rounds.reduce(
      (sum, round) =>
        sum + round.matches.length,
      0
    );


  const completedMatches =
    state.rounds
      .slice(
        0,
        state.currentRound
      )
      .reduce(
        (sum, round) =>
          sum + round.matches.length,
        0
      )
      +
      state.currentMatch;


  $("progressText").textContent =
    `Matchup ${completedMatches + 1} of ${totalMatches}`;


  $("progressBar").style.width =
    `${(completedMatches / totalMatches) * 100}%`;


  if (
    !match ||
    match.songs.length < 2
  ) {
    return;
  }


  $("matchupArea").innerHTML = `

    <div class="matchup">

      ${songCard(match.songs[0], 0)}

      <div class="vs">
        VS
      </div>

      ${songCard(match.songs[1], 1)}

    </div>

  `;


  document
    .querySelectorAll(".pick")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          chooseWinner(
            Number(
              button.dataset.index
            )
          );

        }
      );

    });

}


/* =========================================
   SONG CARD
========================================= */

function songCard(song, index) {

  const youtube =
    song.youtube

      ? `
        <a
          class="youtube-link"
          href="${escapeAttr(song.youtube)}"
          target="_blank"
          rel="noopener"
        >
          ▶ Listen on YouTube
        </a>
      `

      : `
        <span
          class="youtube-link"
          style="visibility:hidden"
        >
          No link
        </span>
      `;


  return `

    <div class="song-card">

      <h4>
        ${escapeHtml(song.title)}
      </h4>

      ${youtube}

      <button
        class="primary pick"
        data-index="${index}"
      >
        Choose
        ${escapeHtml(song.title)}
      </button>

    </div>

  `;

}


/* =========================================
   CHOOSE WINNER
========================================= */

function chooseWinner(index) {

  const round =
    state.rounds[
      state.currentRound
    ];

  const match =
    round.matches[
      state.currentMatch
    ];


  const winner =
    match.songs[index];


  match.winner =
    winner;


  match.songs.forEach(song => {

    song.eliminated =
      song.id !== winner.id;

  });


  const nextRound =
    state.rounds[
      state.currentRound + 1
    ];


  if (!nextRound) {

    finishTournament(winner);

    return;

  }


  const nextMatchIndex =
    Math.floor(
      state.currentMatch / 2
    );


  if (
    !nextRound.matches[
      nextMatchIndex
    ].songs
  ) {

    nextRound.matches[
      nextMatchIndex
    ].songs = [];

  }


  nextRound.matches[
    nextMatchIndex
  ].songs[
    state.currentMatch % 2
  ] = winner;


  advanceToNextMatch();

}


/* =========================================
   ADVANCE
========================================= */

function advanceToNextMatch() {

  const currentRound =
    state.rounds[
      state.currentRound
    ];


  if (
    state.currentMatch <
    currentRound.matches.length - 1
  ) {

    state.currentMatch++;

  }

  else {

    state.currentRound++;

    state.currentMatch = 0;

  }


  renderTournament();

}


/* =========================================
   CHAMPION
========================================= */

function finishTournament(winner) {

  $("championName").textContent =
    winner.title;


  const link =
    $("championYoutube");


  if (winner.youtube) {

    link.href =
      winner.youtube;

    link.style.display =
      "inline-block";

  }

  else {

    link.style.display =
      "none";

  }


  showScreen("champion");

}


$("restartBtn").addEventListener(
  "click",
  () => startTournament(
    state.tournament
  )
);


$("newTournamentBtn").addEventListener(
  "click",
  () => showScreen("create")
);


/* =========================================
   BRACKET TOGGLE
========================================= */

$("toggleBracketBtn")
  .addEventListener(
    "click",
    () => {

      state.showBracket =
        !state.showBracket;


      $("bracket").style.display =
        state.showBracket
          ? "block"
          : "none";


      $("toggleBracketBtn")
        .textContent =
          state.showBracket
            ? "Hide"
            : "Show";

    }
  );


/* =========================================
   RENDER BRACKET
========================================= */

function renderBracket() {

  $("bracket").innerHTML = `

    <div class="bracket-grid">

      ${state.rounds
        .map(
          (round, roundIndex) => `

            <div class="bracket-round">

              <h4>
                ${escapeHtml(
                  round.name
                )}
              </h4>

              <div class="bracket-matches">

                ${round.matches
                  .map(
                    (
                      match,
                      matchIndex
                    ) => `

                      <div
                        class="bracket-match"
                      >

                        ${bracketSong(
                          match.songs[0],
                          match.winner,
                          roundIndex,
                          matchIndex
                        )}

                        ${bracketSong(
                          match.songs[1],
                          match.winner,
                          roundIndex,
                          matchIndex
                        )}

                      </div>

                    `
                  )
                  .join("")}

              </div>

            </div>

          `
        )
        .join("")}

    </div>

  `;

}


function bracketSong(
  song,
  winner,
  roundIndex,
  matchIndex
) {

  if (!song) {

    return `
      <div class="bracket-song">
        &nbsp;
      </div>
    `;

  }


  let classes =
    "bracket-song";


  if (
    winner &&
    winner.id === song.id
  ) {

    classes +=
      " winner";

  }

  else if (
    winner &&
    winner.id !== song.id
  ) {

    classes +=
      " eliminated";

  }


  if (
    roundIndex ===
      state.currentRound &&
    matchIndex ===
      state.currentMatch
  ) {

    classes +=
      " current";

  }


  return `

    <div class="${classes}">

      ${escapeHtml(song.title)}

    </div>

  `;

}


/* =========================================
   SAVE JSON
========================================= */

$("saveBtn").addEventListener(
  "click",
  () => {

    const cleanTournament = {

      title:
        state.tournament.title,

      size:
        state.tournament.size,

      songs:
        state.tournament.songs.map(
          ({
            id,
            title,
            youtube
          }) => ({
            id,
            title,
            youtube
          })
        )

    };


    const blob =
      new Blob(
        [
          JSON.stringify(
            cleanTournament,
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );


    const url =
      URL.createObjectURL(blob);


    const a =
      document.createElement("a");


    a.href = url;

    a.download =
      `${safeFilename(
        state.tournament.title
      )}.json`;


    a.click();


    URL.revokeObjectURL(url);

  }
);


/* =========================================
   LOAD JSON
========================================= */

$("loadBtn").addEventListener(
  "click",
  () => $("fileInput").click()
);


$("fileInput").addEventListener(
  "change",
  async event => {

    const file =
      event.target.files[0];


    if (!file) {
      return;
    }


    try {

      const data =
        JSON.parse(
          await file.text()
        );


      if (
        !Array.isArray(data.songs) ||
        ![16, 32].includes(
          data.songs.length
        )
      ) {

        throw new Error(
          "A tournament must contain exactly 16 or 32 songs."
        );

      }


      data.size =
        data.songs.length;


      startTournament(data);

    }

    catch (error) {

      alert(
        `Couldn't load that tournament: ${error.message}`
      );

    }

    finally {

      event.target.value = "";

    }

  }
);


/* =========================================
   HELPERS
========================================= */

function safeFilename(name) {

  return name
    .replace(
      /[^a-z0-9]+/gi,
      "_"
    )
    .replace(
      /^_|_$/g,
      ""
    )
    ||
    "tournament";

}


function escapeHtml(str) {

  return String(str).replace(
    /[&<>"']/g,
    character => ({

      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"

    }[character])
  );

}


function escapeAttr(str) {

  return escapeHtml(str);

                              }
