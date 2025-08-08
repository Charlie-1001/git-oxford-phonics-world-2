const dropZones = document.querySelectorAll('.dropzone');
const correctBtn1 = document.getElementById("correctBtn1");
const wrongBtn1= document.getElementById("wrongBtn1");
const correctBtn2 = document.getElementById("correctBtn2");
const wrongBtn2 = document.getElementById("wrongBtn2");
const dropZone1 = document.getElementById("dropzone1");
const dropZone2 = document.getElementById("dropzone2");
const summaryAnimation = document.getElementById("summaryAnimation");
const doneBtn = document.querySelectorAll(".done-btn");
const summaryPanel = document.querySelector(".summary-panel");
const gamePanel = document.querySelector(".container");
const letterPanel1 = document.getElementById("letterPanel1");
const letterPanel2 = document.getElementById("letterPanel2");
const teamName1 = document.getElementById("teamName1");
const teamName2 = document.getElementById("teamName2");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const summaryTeam = document.getElementById("summaryTeam");
const correctSound = new Audio('./sounds/correct.mp3');
const incorrectSound = new Audio('./sounds/incorrect.mp3');

// --- MULTI-TOUCH TRACKING ---
const touchDrags = new Map();

// --- BUBBLE CREATION ---
function createBubble(letter, teamId) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = letter;
  bubble.dataset.team = teamId;

  bubble.addEventListener('touchstart', startDrag, { passive: false });
  bubble.addEventListener('mousedown', startDrag);

  return bubble;
}

// --- DRAG START ---
function startDrag(e) {
  e.preventDefault();

  const isTouch = e.type === 'touchstart';
  const touches = isTouch ? e.changedTouches : [e];

  for (const touch of touches) {
    const clientX = isTouch ? touch.clientX : touch.clientX;
    const clientY = isTouch ? touch.clientY : touch.clientY;
    const id = isTouch ? touch.identifier : 'mouse';

    const target = e.currentTarget;
    const letterPanel = target.closest('.letter-panel');
    const rect = target.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    const dragged = letterPanel ? target.cloneNode(true) : target;
    if (!letterPanel) {
      target.parentElement.removeChild(target);
    }

    dragged.classList.add('dragging');
    dragged.style.position = 'absolute';
    dragged.style.zIndex = '1000';
    dragged.dataset.team = target.dataset.team;
    dragged.textContent = target.textContent;
    document.body.appendChild(dragged);

    moveAt(clientX, clientY, dragged, offsetX, offsetY);
    touchDrags.set(id, { bubble: dragged, offsetX, offsetY });

    if (isTouch) {
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onDrop);
    } else {
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onDrop);
    }
  }
}

// --- DRAG MOVE ---
function onMove(e) {
  const isTouch = e.type === 'touchmove';
  const touches = isTouch ? e.changedTouches : [e];

  for (const touch of touches) {
    const id = isTouch ? touch.identifier : 'mouse';
    const dragData = touchDrags.get(id);
    if (!dragData) continue;

    moveAt(touch.clientX, touch.clientY, dragData.bubble, dragData.offsetX, dragData.offsetY);
  }
}

function moveAt(x, y, bubble, offsetX, offsetY) {
  bubble.style.left = x - offsetX + 'px';
  bubble.style.top = y - offsetY + 'px';
}

// --- DRAG DROP ---
function onDrop(e) {
  const isTouch = e.type === 'touchend';
  const touches = isTouch ? e.changedTouches : [e];

  for (const touch of touches) {
    const id = isTouch ? touch.identifier : 'mouse';
    const dragData = touchDrags.get(id);
    if (!dragData) continue;

    const bubble = dragData.bubble;
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    const target = document.elementFromPoint(clientX, clientY);
    const dropzone = target?.closest('.dropzone');
    const letterPanel = target?.closest('.letter-panel');

    if (dropzone && dropzone.closest('.team').id === bubble.dataset.team) {
      const newBubble = document.createElement('div');
      newBubble.className = 'new-bubble';
      newBubble.textContent = bubble.textContent;
      newBubble.dataset.team = bubble.dataset.team;
      newBubble.style.cursor = 'pointer';

      newBubble.addEventListener('touchstart', startDrag, { passive: false });
      newBubble.addEventListener('mousedown', startDrag);

      const all = Array.from(dropzone.querySelectorAll('.new-bubble'));
      let inserted = false;
      for (let b of all) {
        const rect = b.getBoundingClientRect();
        if (clientX < rect.left + rect.width / 2) {
          dropzone.insertBefore(newBubble, b);
          inserted = true;
          break;
        }
      }
      if (!inserted) dropzone.appendChild(newBubble);
    }

    if (letterPanel) bubble.remove();

    bubble.remove();
    touchDrags.delete(id);

    if (touchDrags.size === 0) {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onDrop);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onDrop);
    }
  }
}

phonicsLetters.forEach(letter => {
  const bubble1 = createBubble(letter, 'team1');
  letterPanel1.appendChild(bubble1);

  const bubble2 = createBubble(letter, 'team2');
  letterPanel2.appendChild(bubble2);
});

// --- CHECK ANSWERS ---
function correctAnswer(score, dropzone) {
  correctSound.pause();
  correctSound.currentTime = 0;
  correctSound.play();
  score.innerText = parseInt(score.innerText) + 5;

  dropzone.querySelectorAll('.new-bubble').forEach(bubble => {
    bubble.style.backgroundColor = 'rgb(131, 245, 131)';
    bubble.style.color = 'white';
    setTimeout(() => bubble.remove(), 1000);
  });
}

function wrongAnswer(score, dropzone) {
  incorrectSound.pause();
  incorrectSound.currentTime = 0;
  incorrectSound.play();
  score.innerText = parseInt(score.innerText) - 2;

  dropzone.querySelectorAll('.new-bubble').forEach(bubble => {
    bubble.style.backgroundColor = 'rgb(245, 131, 131)';
    bubble.style.color = 'white';
    setTimeout(() => bubble.remove(), 1000);
  });
}

correctBtn1.addEventListener("click", () => correctAnswer(score1, dropZone1));
wrongBtn1.addEventListener("click", () => wrongAnswer(score1, dropZone1));
correctBtn2.addEventListener("click", () => correctAnswer(score2, dropZone2));
wrongBtn2.addEventListener("click", () => wrongAnswer(score2, dropZone2));

// --- SUMMARY SECTION ---
function summaryVideo() {
  const imgSources = [
    './memes/amazing1.gif',
    './memes/amazing2.gif',
    './memes/omg1.gif',
    './memes/well-done1.gif',
    './memes/wow1.gif',
    './memes/wow2.gif',
    './memes/wow3.gif'
  ];
  const randomIndex = Math.floor(Math.random() * imgSources.length);
  const img = document.createElement('img');
  img.className = 'summary-animation';
  img.src = imgSources[randomIndex];
  summaryAnimation.appendChild(img);
}

function determineWinners() {
  const score1Value = parseInt(score1.innerText);
  const score2Value = parseInt(score2.innerText);

  if (score1Value > score2Value) {
    summaryTeam.innerHTML = `🥇 ${teamName1.value}: Score: ${score1Value} <br> 🥈 ${teamName2.value}: Score: ${score2Value}`;
  } else if (score1Value === score2Value) {
    summaryTeam.innerHTML = `${teamName1.value}: Score: ${score1Value} 🤝 ${teamName2.value}: Score: ${score2Value}`;
  } else {
    summaryTeam.innerHTML = `🥇 ${teamName2.value}: Score: ${score2Value} <br> 🥈 ${teamName1.value}: Score: ${score1Value}`;
  }

  const victorySound = new Audio('./sounds/victory.mp3');
  victorySound.play();
  summaryVideo();
}

doneBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    gamePanel.style.display = 'none';
    summaryPanel.style.display = 'block';
    document.querySelector('.game-title').style.color = 'white';
    document.body.style.backgroundImage = "url('./images/victory-background.jpg')";
    determineWinners();
  });
});