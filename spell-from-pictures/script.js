      const team1Name = document.getElementById("team1Name");
      const team2Name = document.getElementById("team2Name");
      const correctScore1 = document.getElementById("correct1");
      const correctScore2 = document.getElementById("correct2");
      const incorrectScore1 = document.getElementById("incorrect1");
      const incorrectScore2 = document.getElementById("incorrect2");
      const bonusScore1 = document.getElementById("bonus1");
      const bonusScore2 = document.getElementById("bonus2");
      const luckyBoxScore1 = document.getElementById("luckyBox1");
      const luckyBoxScore2 = document.getElementById("luckyBox2");
      const luckyBoxImg1 = document.getElementById("luckyBoxImg1");
      const luckyBoxImg2 = document.getElementById("luckyBoxImg2");
      const totalScore1 = document.getElementById("totalScore1");
      const totalScore2 = document.getElementById("totalScore2");
      const letterBox1 = document.getElementById("letterBox1");
      const letterBox2 = document.getElementById("letterBox2");
      const imageSection1 = document.getElementById("imageSection1");
      const checkBtn1 = document.getElementById("checkBtn1");
      const checkBtn2 = document.getElementById("checkBtn2");
      let wordIndex1 = Math.floor(Math.random() * 10);
      let wordIndex2 = Math.floor(Math.random() * 10);
      let correctScoreValue1 = 0;
      let correctScoreValue2 = 0;
      let incorrectScoreValue1 = 0;
      let incorrectScoreValue2 = 0;
      let bonusScoreValue1 = 0;
      let bonusScoreValue2 = 0;
      let luckyBoxScoreValue1 = 0;
      let luckyBoxScoreValue2 = 0;
      let totalScoreValue1 = 0;
      let totalScoreValue2 = 0;

      const boxList = [
        {value: 5, imageUrl: "./images/lucky-box-5.png"}, 
        {value: 10, imageUrl: "./images/lucky-box-10.png"},
        {value: 15, imageUrl: "./images/lucky-box-15.png"}
      ];

      // --- MULTI-TOUCH TRACKING ---
      const touchDrags = new Map();

      function startDrag(e) {
        e.preventDefault();
        const isTouch = e.type === 'touchstart';
        const touches = isTouch ? e.changedTouches : [e];

        for (const touch of touches) {
          const clientX = isTouch ? touch.clientX : touch.clientX;
          const clientY = isTouch ? touch.clientY : touch.clientY;
          const id = isTouch ? touch.identifier : 'mouse';
          const target = e.currentTarget;
          const rect = target.getBoundingClientRect();
          const offsetX = clientX - rect.left;
          const offsetY = clientY - rect.top;

          target.classList.add('dragging');
          target.style.width = rect.width + "px";
          target.style.height = rect.height + "px";
          target.style.position = 'absolute';
          target.style.zIndex = '1000';
          target.dataset.team = target.closest('.letter-box').id;
          target.textContent = target.textContent;

          moveAt(clientX, clientY, target, offsetX, offsetY);
          touchDrags.set(id, { letter: target, offsetX, offsetY }); // setting the tracking data for each touch

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

          moveAt(touch.clientX, touch.clientY, dragData.letter, dragData.offsetX, dragData.offsetY);
        }
      }

      function moveAt(x, y, letter, offsetX, offsetY) {
        letter.style.left = x - offsetX + 'px';
        letter.style.top = y - offsetY + 'px';
      }

      // --- DRAG DROP ---
      function onDrop(e) {
        const isTouch = e.type === 'touchend';
        const touches = isTouch ? e.changedTouches : [e];

        for (const touch of touches) {
          const id = isTouch ? touch.identifier : 'mouse';
          const dragData = touchDrags.get(id);
          if (!dragData) continue;

          const letter = dragData.letter;
          const clientX = touch.clientX;
          const clientY = touch.clientY;
          const target = document.elementFromPoint(clientX, clientY);
          const dropzone = target.parentElement;

          if (dropzone && dropzone.id === letter.dataset.team) {
            const newBubble = document.createElement('div');
            newBubble.className = 'scrumbled-letter';
            newBubble.textContent = letter.textContent;
            newBubble.dataset.team = letter.dataset.team;
            newBubble.style.cursor = 'pointer';

            newBubble.addEventListener('touchstart', startDrag, { passive: false });
            newBubble.addEventListener('mousedown', startDrag);

            const all = Array.from(dropzone.querySelectorAll('.scrumbled-letter'));
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

          letter.remove(); // to remove the dragged letter visually
          touchDrags.delete(id); // to remove its tracking data

          if (touchDrags.size === 0) {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onDrop);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onDrop);
            console.log("remove all");
          }
        }
      }

      let box1Clicked = false;
      let box2Clicked = false;

      function luckyDraw(box) {
        const magicSound = new Audio('./sounds/magic-sound.mp3');
        if (box === luckyBoxImg1) {
          magicSound.play();
          const luckyIndex1 = Math.floor((Math.random() * boxList.length));
          setTimeout(() => {
            luckyBoxImg1.src = boxList[luckyIndex1].imageUrl;
            luckyBoxScoreValue1 = boxList[luckyIndex1].value;
            luckyBoxScore1.textContent = luckyBoxScoreValue1;
            totalScoreValue1 += luckyBoxScoreValue1;
            totalScore1.textContent = totalScoreValue1;
            totalScore1.style.color = totalScoreValue1 > 0 ? "greenyellow" : "red";

            box1Clicked = true;
            if (box1Clicked === true && box2Clicked === true) {
              setTimeout(() => gameSummary(), 2000);
            } else {
              return
            }
          }, 1000);
        } else {
          magicSound.play();
          const luckyIndex2 = Math.floor((Math.random() * boxList.length));
          setTimeout(() => {
            luckyBoxImg2.src = boxList[luckyIndex2].imageUrl;
            luckyBoxScoreValue2 = boxList[luckyIndex2].value;
            luckyBoxScore2.textContent = luckyBoxScoreValue2;
            totalScoreValue2 += luckyBoxScoreValue2;
            totalScore2.textContent = totalScoreValue2;
            totalScore2.style.color = totalScoreValue2 > 0 ? "greenyellow" : "red";
            box2Clicked = true;
            if (box1Clicked === true && box2Clicked === true) {
              setTimeout(() => gameSummary(), 2000);
            } else {
              return
            }
          }, 1000);
        } 

      };

      luckyBoxImg1.addEventListener("click", () => {luckyDraw(luckyBoxImg1)}, {once: true});
      luckyBoxImg2.addEventListener("click", () => {luckyDraw(luckyBoxImg2)}, {once: true});

      function gameSummary() {
        imageSection1.innerHTML = "";
        imageSection2.innerHTML = "";
        const img1 = document.createElement('img');
        const img2 = document.createElement('img');
        const img3 = document.createElement('img');
        img1.className = "vocabulary-img";
        img2.className = "vocabulary-img";
        img3.className = "vocabulary-img";
        img1.src = "./images/first-winner.jpg";
        img2.src = "./images/second-winner.jpg";
        img3.src = "./images/handshake.png";
        const victorySound = new Audio('./sounds/victory.mp3');
        victorySound.play();

        document.querySelectorAll('.check-btn').forEach(btn => btn.style.display = "none");
        document.querySelectorAll('.letter-box').forEach(box => {
          box.style.width = "100%";
          box.innerHTML = "";
        });

        if (totalScoreValue1 > totalScoreValue2) {
          imageSection1.appendChild(img1);
          letterBox1.innerHTML = `The first Winner: <span style="color: green">${team1Name.value}</span>`;
          imageSection2.appendChild(img2);
          letterBox2.innerHTML = `The second Winner: <span style="color: green">${team2Name.value}</span>`;
        } else if (totalScoreValue2 > totalScoreValue1) {
          imageSection1.appendChild(img2);
          letterBox1.innerHTML = `The second Winner: <span style="color: green">${team1Name.value}</span>`;
          imageSection2.appendChild(img1);
          letterBox2.innerHTML = `The first Winner: <span style="color: green">${team2Name.value}</span>`;
        } else {
          imageSection1.appendChild(img3);
          imageSection2.appendChild(img3.cloneNode(true));
          document.querySelectorAll('.letter-box').forEach(box => box.textContent = "It's a tie!");
        }

      }

      function generateQuestion(letterBox, imageSection) {
        letterBox.innerHTML = "";
        imageSection.innerHTML = "";
        let wordIndex;

        if (letterBox.id === letterBox1.id) {
          wordIndex1 = (wordIndex1 + 1) % wordList.length;
          wordIndex = wordIndex1;
        } else {
          wordIndex2 = (wordIndex2 + 1) % wordList.length;
          wordIndex = wordIndex2;
        }

        const currentWord = wordList[wordIndex].word;
        const scrumbledWord = scrumbling(currentWord);

        scrumbledWord.split('').forEach(letter => {
          const letterSpan = document.createElement("span");
          letterSpan.textContent = letter;
          letterSpan.className = "scrumbled-letter";
          letterSpan.draggable = true;

          letterSpan.addEventListener("dragstart", startDrag);
          letterSpan.addEventListener("touchstart", startDrag);
          letterBox.appendChild(letterSpan);
        });

        const currentImage = document.createElement("img");
        currentImage.src = wordList[wordIndex].imageUrl;
        currentImage.className = "vocabulary-img";

        imageSection.appendChild(currentImage);

        let unscrumbledWord = "";
        const letters = Array.from(letterBox.querySelectorAll('.scrumbled-letter'));
        for (letter of letters) {
          unscrumbledWord += letter.textContent;
        }
        
      }
      generateQuestion(letterBox1, imageSection1); // Execute the function for the first time
      generateQuestion(letterBox2, imageSection2); // Execute the function for the first time

      function scrumbling(word) {
        const scrumbled = word.split('').sort(() => Math.random() - 0.5).join('');
        return scrumbled;
      }

      // To check the answer
      let hits1 = 0;
      let hits2 = 0;
      const correctSound = new Audio('./sounds/correct.mp3');
      const incorrectSound = new Audio('./sounds/incorrect.mp3');

      function checkAnswer(letterBox, Index) {
        const unscrumbledWord = Array.from(letterBox.children).map(child => child.textContent).join('');
        const originalWord = wordList[Index].word;
        const longWord = unscrumbledWord.length > 5 ? true : false;

        // checking the correct and incorrect answers
        if (unscrumbledWord === originalWord) {
          correctSound.play();
          if (letterBox === letterBox1) {
            hits1 += 1;
            longWord ? correctScoreValue1 += 8 : correctScoreValue1 += 5;
            correctScore1.textContent = correctScoreValue1;
            Array.from(letterBox1.children).forEach(letter => letter.style.backgroundColor = "rgb(7, 175, 7)");
          } else {
            hits2 += 1;
            longWord ? correctScoreValue2 += 8 : correctScoreValue2 += 5;
            correctScore2.textContent = correctScoreValue2;
            Array.from(letterBox2.children).forEach(letter => letter.style.backgroundColor = "rgb(7, 175, 7)");
          }
        } else {
          incorrectSound.play();
          if (letterBox === letterBox1) {
            incorrectScoreValue1 -= 2;
            incorrectScore1.textContent = incorrectScoreValue1;
            Array.from(letterBox1.children).forEach(letter => letter.style.backgroundColor = "rgb(240, 52, 52)");
          } else {
            incorrectScoreValue2 -= 2;
            incorrectScore2.textContent = incorrectScoreValue2;
            Array.from(letterBox2.children).forEach(letter => letter.style.backgroundColor = "rgb(240, 52, 52)");
          }     
        }

        // updating the bonus score and total score
        if (letterBox === letterBox1) {
          totalScoreValue1 = correctScoreValue1 + incorrectScoreValue1 + bonusScoreValue1 + luckyBoxScoreValue1;
          totalScore1.textContent = totalScoreValue1;
          totalScore1.style.color = totalScoreValue1 > 0 ? "greenyellow" : "red";

          if (hits1 > 0 && hits1 % 5 === 0) {
            bonusScoreValue1 += 10;
            bonusScore1.textContent = bonusScoreValue1;
          }
        } else {
            totalScoreValue2 = correctScoreValue2 + incorrectScoreValue2 + bonusScoreValue2 + luckyBoxScoreValue2;
            totalScore2.textContent = totalScoreValue2;
            totalScore2.style.color = totalScoreValue2 > 0 ? "greenyellow" : "red";

            if (hits2 > 0 && hits2 % 5 === 0) {
              bonusScoreValue2 += 10;
              bonusScore2.textContent = bonusScoreValue2;
            }
        }
      }

      checkBtn1.addEventListener("click", () => {
        checkBtn1.disabled = true;
        checkAnswer(letterBox1, wordIndex1);
        setTimeout(() => {
          generateQuestion(letterBox1, imageSection1);
          checkBtn1.disabled = false;
        }, 1000);
      })

      checkBtn2.addEventListener("click", () => {
        checkBtn2.disabled = true;
        checkAnswer(letterBox2, wordIndex2);
        setTimeout(() => {
          generateQuestion(letterBox2, imageSection2);
          checkBtn2.disabled = false;
        }, 1000);
      })
