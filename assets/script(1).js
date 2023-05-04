// Get date and time
function tnkTime() {
  var today = new Date();
  var month = today.toLocaleString("en-us", { month: "short" });
  var date = today.getDate() + " " + month + " " + (today.getFullYear() - 30);
  var hours = today.getHours();
  var minutes = today.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  var dateTime = date + " | " + strTime;

  var targetTimeText = document.getElementById("date-here");
  targetTimeText.innerHTML = dateTime;
}
tnkTime();
setInterval(tnkTime, 30 * 1000);

//Make the DIV element draggable:
$(document).ready(function () {
  $(".popup, .welcome-popup, .found-it").draggable({
    containment: ".page-wrapper",
    handle: ".popup-head",
    scroll: false,
    stack: "div",
  });
});

// Click on checkbox when clicked on tree

$(".tree").click(function () {
  var treeNo = $(this).attr("no");
  var checkBox = $("input[name=" + treeNo + "]");
  var treeGif = $("#gif-" + treeNo);
  checkBox.prop("checked", !checkBox.prop("checked"));
  $(".submit-1").click();
  $(this).addClass("w-condition-invisible");
  $(".success-gif").removeClass("visible");
  $(treeGif).addClass("visible");
  updateTreesNo();
});

// // Count trees
var allTrees = document.getElementsByClassName("tree w-condition-invisible");
var treesCount = document.getElementById("trees-count");

function updateTreesNo() {
  treesCount.innerHTML = allTrees.length;

  if (allTrees.length < 2) {
    $("#other-tree-text").css("display", "none");
    $("#first-tree-text").css("display", "block");
  } else {
    $("#other-tree-text").css("display", "block");
    $("#first-tree-text").css("display", "none");
  }
}
// Run on pagel load
updateTreesNo();

// Submit api form
$("#submit-api-btn").click(function () {
  document.getElementById("submit-api-form").click();
  $("#trees-counter-content").addClass("w-condition-invisible");
  document
    .getElementById("api-form-success")
    .classList.remove("w-condition-invisible");
});

// Update form field, so we have name
var currentName = document.getElementById("is--client-name").textContent;
var currentEmail = document.getElementById("is--client-email").textContent;
$('input[name="Name"]').val(currentName);
$('input[name="Name-API"]').val(currentName);
$('input[name="Email-API"]').val(currentEmail);

// Music player

(function () {
  // Globals
  // DOM elements
  const playerProgress = document.querySelector(".player__progress__bar");
  const timeFromEnd = document.querySelector(".time-from-end");

  // Data
  const tracks = [
    {
      name: "Xtal",
      artist: "Aphex Twin",
      url: "./assets/tracks/aphex-twin-xtal-hq-2tOutF8B3f8.mp3",
    },
    {
      name: "Ageispolis",
      artist: "Aphex Twin",
      url: "./assets/tracks/aphex-twin-ageispolis-CJsiDDI-7Xw.mp3",
    },
    {
      name: "Pulsewidth",
      artist: "Aphex Twin",
      url: "./assets/tracks/aphex-twin-pulsewidth-wQyZ0Rn3xRI.mp3",
    },
    {
      name: "Flaphead",
      artist: "Aphex Twin",
      url: "./assets/tracks/tha-N3G7JPTVVEQ.mp3",
    },
  ];

  // State
  const playerState = {
    audioElement: new Audio(),
    audioSource: tracks,
    progressElement: playerProgress,
    currentTime: 0,
    trackNumber: 0,
    duration: 0,
  };

  // Functions
  // Helper functions
  function leadingZero(num) {
    if (num < 10) {
      return `0${num}`;
    }
    return num;
  }

  function readableTime(seconds) {
    const secs = Math.floor(seconds);
    const mins = leadingZero(Math.floor(secs / 60));
    const minsSecs = leadingZero(secs % 60);
    const hours = leadingZero(Math.floor(mins / 60));

    if (hours > 0) {
      return `${hours}:${mins}:${minsSecs}`;
    }
    if (mins > 0) {
      return `${mins}:${minsSecs}`;
    }
    return `:${minsSecs}`;
  }

  // Audio functions
  function playTrack(stateObj) {
    stateObj.audioElement.src = stateObj.audioSource[stateObj.trackNumber].url;
    stateObj.audioElement.currentTime = stateObj.currentTime;
    // Wait until file metadata is loaded to parse values
    stateObj.audioElement.addEventListener("loadedmetadata", (event) => {
      stateObj.audioElement.play();
      stateObj.progressElement.max = stateObj.audioElement.duration;
    });
    // Update progress bar and timestamps
    stateObj.audioElement.addEventListener("timeupdate", (event) => {
      // Calculate ending time
      let endTime = readableTime(
        stateObj.audioElement.duration - stateObj.audioElement.currentTime
      );
      stateObj.progressElement.value = stateObj.audioElement.currentTime;

      // Update state with dynamic current time
      stateObj.currentTime = stateObj.audioElement.currentTime;
      // Update names
      document.querySelector("#songName").innerHTML =
        stateObj.audioSource[stateObj.trackNumber].name;
      document.querySelector("#artistName").innerHTML =
        stateObj.audioSource[stateObj.trackNumber].artist;
    });
  }
  function pauseTrack(stateObj) {
    stateObj.audioElement.pause();
    // Update state with paused current time
    stateObj.currentTime = stateObj.audioElement.currentTime;
  }
  function scrubTrack(stateObj, scrubTo) {
    stateObj.audioElement.currentTime = scrubTo;
    stateObj.progressElement.value = scrubTo;
    stateObj.audioElement.play();
  }

  // Events
  document.addEventListener("click", (event) => {
    if (event.target.matches(".player__play")) {
      event.target.classList.add("hide");
      document
        .querySelector(".player__eq-img")
        .classList.add("play-eq-animation");
      document.querySelector(".player__pause").classList.remove("hide");
      playTrack(playerState);
      event.preventDefault();
    }
    if (event.target.matches(".player__pause")) {
      event.target.classList.add("hide");
      document
        .querySelector(".player__eq-img")
        .classList.remove("play-eq-animation");
      document.querySelector(".player__play").classList.remove("hide");
      pauseTrack(playerState);
      event.preventDefault();
    }
    if (event.target.matches(".player__forward")) {
      pauseTrack(playerState);
      // Update state for next track
      playerState.currentTime = 0;
      if (playerState.trackNumber + 1 < playerState.audioSource.length) {
        playerState.trackNumber++;
        return playTrack(playerState);
      } else {
        pauseTrack(playerState);
        document.querySelector(".player__pause").classList.add("hide");
        document.querySelector(".player__play").classList.remove("hide");
      }

      event.preventDefault();
    }
    if (event.target.matches(".player__back")) {
      // Update state for previous track
      if (playerState.currentTime > 2) {
        playerState.currentTime = 0;
        document.querySelector(".player__pause").classList.remove("hide");
        document.querySelector(".player__play").classList.add("hide");
        return playTrack(playerState);
      } else if (playerState.trackNumber > 0) {
        document.querySelector(".player__pause").classList.remove("hide");
        document.querySelector(".player__play").classList.add("hide");
        playerState.trackNumber--;
        playerState.currentTime = 0;
        return playTrack(playerState);
      } else {
        pauseTrack(playerState);
        document.querySelector(".player__pause").classList.add("hide");
        document.querySelector(".player__play").classList.remove("hide");
      }

      event.preventDefault();
    }
    if (event.target.matches(".player__progress__bar")) {
      const scrubTo =
        (event.offsetX / event.target.offsetWidth) *
        playerState.audioElement.duration;
      scrubTrack(playerState, scrubTo);
      event.preventDefault();
    }
    /*
    function logTrackLoaded(stateObj) {
      stateObj.audioElement.addEventListener("loadeddata", (event) => {
        console.log(
          `Track loaded: ${stateObj.audioSource[stateObj.trackNumber].name}`
        );
      });
    }

    function logTrackLoad(stateObj) {
      stateObj.audioElement.addEventListener("loadstart", (event) => {
        console.log(
          `Loading track: ${stateObj.audioSource[stateObj.trackNumber].name}`
        );
      });
    }

    logTrackLoad(playerState);
    logTrackLoaded(playerState);*/
  });
})();

// Video player

var tnkVideo = $("#video1");
var tnkVideo1 = document.getElementById("video1");

$("#btn-video-mute").click(function () {
  if (tnkVideo.prop("muted")) {
    tnkVideo.prop("muted", false);
    $("#btn-video-mute .on-video-icon").addClass("show");
    $("#btn-video-mute .off-video-icon").removeClass("show");
  } else {
    tnkVideo.prop("muted", true);
    $("#btn-video-mute .off-video-icon").addClass("show");
    $("#btn-video-mute .on-video-icon").removeClass("show");
  }
});

$("#video-close").click(function () {
  if (tnkVideo1.paused) {
  } else {
    tnkVideo1.pause();
    $("#btn-video-play .on-video-icon").addClass("show");
    $("#btn-video-play .off-video-icon").removeClass("show");
  }
});

$("#btn-video-play, video").click(function () {
  if (tnkVideo1.paused) {
    tnkVideo1.play();
    $("#btn-video-play .off-video-icon").addClass("show");
    $("#btn-video-play .on-video-icon").removeClass("show");
  } else {
    tnkVideo1.pause();
    $("#btn-video-play .on-video-icon").addClass("show");
    $("#btn-video-play .off-video-icon").removeClass("show");
  }
});

// Video player progress
const videoProgress = document.getElementById("video-progress");

function progressLoop() {
  setInterval(function () {
    videoProgress.value = Math.round(
      (tnkVideo1.currentTime / tnkVideo1.duration) * 100
    );
  });
}

// chat

// Add a click event listener to the progress bar
videoProgress.addEventListener("click", function (event) {
  // Calculate the new current time based on the click event's
  // position relative to the progress bar
  const newTime = (event.offsetX / this.offsetWidth) * tnkVideo1.duration;

  // Update the video's current time
  tnkVideo1.currentTime = newTime;
});

tnkVideo1.addEventListener("timeupdate", function () {
  videoProgress.value = (this.currentTime / this.duration) * 100;
});
// chat

tnkVideo1.addEventListener("play", progressLoop);

// send more wishes button

$("#send-more-wishes, #send-more-wishes-2").click(function () {
  $(".wishes-success").css("display", "none");
  $(".send-wishes").css("display", "flex");
  $("#wishes-field").val("");
  $("#nickname-field").val("");
});

// close dropdown on link click

$("a.dropdown-link").click(function () {
  $(".w-dropdown-list").removeClass("w--open");
  $(".w-dropdown-toggle").removeClass("w--open");
});

// preloader

var typed = new Typed("#typed-text", {
  strings: [
    "",
    "executing v4.5N0W_oldgold",
    "core memory array init",
    "time_machine system config",
    "bug_id.cfg file",
    "Machine is starting up...",
  ],
  typeSpeed: 7,
  showCursor: false,
  fadeOut: false,
  fadeOutClass: "typed-fade-out",
  fadeOutDelay: 0,
});

// popup to the top

var isZindex = 999;
$(".popup, .welcome-popup").click(function () {
  $(this).css("z-index", isZindex);
  isZindex++;
});

$(".icon, .dropdown-link").click(function () {
  let attrName = $(this).attr("popup-name");
  $('.popup[popup-is="' + attrName + '"]').click();
});

// Count trees
var allTrees = document.getElementsByClassName("tree w-condition-invisible");
var treesCount = document.getElementById("trees-count");

function updateTreesNo() {
  treesCount.innerHTML = allTrees.length;
  if (allTrees.length < 2) {
    $("#other-tree-text").css("display", "none");
    $("#first-tree-text").css("display", "block");
  } else if (allTrees.length == 9) {
    $("#other-tree-text").css("display", "none");
    $("#first-tree-text").css("display", "none");
    $("#all-tree-text").css("display", "block");
  } else {
    $("#other-tree-text").css("display", "block");
    $("#first-tree-text").css("display", "none");
  }
}
