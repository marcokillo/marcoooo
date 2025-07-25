const puzzle = document.getElementById('puzzle');
const message = document.getElementById('message');
let dragSrcEl = null;
let selectedTile = null;

function initPuzzle() {
  puzzle.innerHTML = "";
  message.innerHTML = "";

  const indices = [...Array(12).keys()];
  shuffle(indices);

  indices.forEach((imgIndex) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.draggable = true;
    tile.dataset.index = imgIndex;

    const img = document.createElement("img");
    img.src = `tiles/tile-${String(imgIndex).padStart(2, '0')}.jpg`;
    img.alt = `Tile ${imgIndex}`;

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
  const clone1 = tile1.cloneNode(true);
  const clone2 = tile2.cloneNode(true);

  tile1.replaceWith(clone2);
  tile2.replaceWith(clone1);

  addEvents(); // مجدد باید ایونت‌ها رو اعمال کنیم
}

function checkWin() {
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const correct = tiles.every((tile, index) => {
    const currentIndex = Number(tile.dataset.index);
    return currentIndex === index;
  });

  if (correct) {
    message.innerHTML = "🎉 تبریک! پازل با موفقیت حل شد!<br>⏳ در حال رفتن به مرحله بعد...";
    setTimeout(showNextStage, 2000);
  }
}

function showNextStage() {
  puzzle.innerHTML = "";
  message.innerHTML = `
    <div class="stage-text">
      <p>این‌بار، اجازه دادم سایه‌اش وارد بوم شود...<br>
      نه از روی ترس، بلکه از خستگی.<br>
      شاید اگر ردپایش را روی کاغذ ببیند، بفهمد که من مدت‌هاست او را دیده‌ام.<br>
      و شاید، فقط شاید، از تعقیبم دست بکشد.</p>
      <button onclick="initPuzzle()">🔁 بازگشت به پازل</button>
    </div>
  `;
}

window.onload = initPuzzle;
