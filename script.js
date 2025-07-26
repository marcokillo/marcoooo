const puzzle = document.getElementById('puzzle');
const message = document.getElementById('message');
const nextStageBtn = document.getElementById("nextStageBtn");

let dragSrcEl = null;
let selectedTile = null;

function initPuzzle() {
  puzzle.innerHTML = "";
  message.innerHTML = "";
  nextStageBtn.style.display = "none";

  const indices = [...Array(12).keys()];
  shuffle(indices);

  indices.forEach((imgIndex) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.draggable = true;

    const img = document.createElement("img");
   img.src = "tiles/tile-" + String(imgIndex).padStart(2, '0') + ".jpg";
   img.alt = "Tile " + imgIndex
    img.dataset.index = imgIndex;

    tile.appendChild(img);
    puzzle.appendChild(tile);
  });

  addEvents();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function addEvents() {
  const tiles = document.querySelectorAll(".tile");

  tiles.forEach(tile => {
    tile.addEventListener("dragstart", function () {
      dragSrcEl = this;
      this.classList.add("dragging");
    });

    tile.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("over");
    });

    tile.addEventListener("dragleave", function () {
      this.classList.remove("over");
    });

    tile.addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("over");

      if (dragSrcEl !== this) {
        swapTiles(dragSrcEl, this);
        checkWin();
      }

      dragSrcEl.classList.remove("dragging");
    });

    tile.addEventListener("dragend", function () {
      this.classList.remove("dragging");
    });

    tile.addEventListener("touchstart", function (e) {
      e.preventDefault();
      if (!selectedTile) {
        selectedTile = this;
        this.classList.add("selected");
      } else {
        swapTiles(selectedTile, this);
        selectedTile.classList.remove("selected");
        selectedTile = null;
        checkWin();
      }
    });
  });
}

function swapTiles(tile1, tile2) {
  const img1 = tile1.querySelector("img");
  const img2 = tile2.querySelector("img");

  const src1 = img1.src;
  const index1 = img1.dataset.index;

  img1.src = img2.src;
  img1.dataset.index = img2.dataset.index;

  img2.src = src1;
  img2.dataset.index = index1;
}

function checkWin() {
  const images = Array.from(document.querySelectorAll(".tile img"));
  const correct = images.every((img, index) => Number(img.dataset.index) === index);

  if (correct) {
    message.innerHTML = "🎉 تبریک! پازل با موفقیت حل شد!";
    nextStageBtn.style.display = "inline-block";

    // ✅ انتقال خودکار به مرحله بعد (اختیاری)
    setTimeout(() => {
      window.location.href = "next.html";
    }, 3000); // ۳ ثانیه تأخیر
  } else {
    nextStageBtn.style.display = "none";
  }
}

// انتقال به مرحله بعد با دکمه
nextStageBtn.addEventListener("click", () => {
  window.location.href = "next.html";
});

window.onload = initPuzzle;
