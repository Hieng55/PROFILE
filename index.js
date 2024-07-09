function $(name) {
  return document.querySelector(name);
}
function $$(name) {
  return document.querySelectorAll(name);
}
function $id(name) {
  return document.getElementById(name);
}

let banner = $("body");
let canvas = $id("dotsCanvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let ctx = canvas.getContext("2d");
let dots = [];
const arrayColors = ["#eee", "#545454", "#596d91", "#bb5a68", "#696541"];

for (let index = 0; index < 100; index++) {
  dots.push({
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height),
    size: Math.random() * 3 + 5,
    color: arrayColors[Math.floor(Math.random() * 5)],
  });
}

const updateDotPositions = () => {
  dots.forEach((dot) => {
    // Tạo một hướng di chuyển ngẫu nhiên
    let dx = Math.random() * 2 - 1; // giá trị từ -1 đến 1
    let dy = Math.random() * 2 - 1;

    // Nhân với một hệ số nhỏ để tạo ra di chuyển mượt mà hơn
    dx *= 0.5;
    dy *= 0.5;

    // Cập nhật vị trí mới cho dot
    dot.x += dx;
    dot.y += dy;

    // Đảm bảo các dot không ra khỏi giới hạn của canvas
    dot.x = Math.max(0, Math.min(canvas.width, dot.x));
    dot.y = Math.max(0, Math.min(canvas.height, dot.y));
  });
};

const drawDots = () => {
  dots.forEach((dot) => {
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  });
};

drawDots();

banner.addEventListener("mousemove", (event) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateDotPositions(); // Update dot positions
  drawDots();

  let mouse = {
    x: event.clientX - canvas.getBoundingClientRect().left,
    y: event.clientY - canvas.getBoundingClientRect().top,
  };

  dots.forEach((dot) => {
    let distance = Math.sqrt((mouse.x - dot.x) ** 2 + (mouse.y - dot.y) ** 2);
    if (distance < 300) {
      ctx.strokeStyle = dot.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dot.x, dot.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  });
});

banner.addEventListener("mouseout", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots();
});

const track = $id("image-track");

track.onmousedown = (e) => {
  track.dataset.mouseDownAt = e.clientX;
  track.style.cursor = "grabbing";
};
track.onmouseup = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
  track.style.cursor = "grab";
};

track.onmousemove = (e) => {
  if (track.dataset.mouseDownAt === "0") return;

  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
    maxDelta = window.innerWidth / 2;

  const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  track.dataset.percentage = nextPercentage;

  track.animate(
    {
      transform: `translate(${nextPercentage}%, -50%)`,
    },
    { duration: 1200, fill: "forwards" }
  );

  for (const image of track.getElementsByClassName("image")) {
    image.animate(
      {
        objectPosition: `${100 + nextPercentage}% center`,
      },
      { duration: 1200, fill: "forwards" }
    );
  }
};

// let slider = $(".slider");
// let isMouseDown = false;

// slider.onmousedown = function (e) {
//   e.preventDefault();
//   isMouseDown = true;
// };

// slider.onmouseup = function () {
//   isMouseDown = false;
// };

// slider.onmousemove = function (e) {
//   if (isMouseDown) {
//     let x = e.clientX / 3;
//     console.log(x);
//     slider.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${x}deg)`;
//   }
// };

let count = 0;
let loading = document.getElementById("loading");
let valueShow = document.getElementById("value-show");

loading.onclick = function () {
  if (count != 0) {
    return;
  }
  count = 0;
  startLoading();
};
function startLoading() {
  if (count == 100) {
    valueShow.innerHTML = "Finish";
    count = 0;
    return;
  } else {
    count = count + 1;
    valueShow.innerHTML = count + "%";
    loading.style.setProperty("--loading-value", count + "%");

    setTimeout(startLoading, 50);
  }
}

$id("next").onclick = function () {
  let lists = $$(".slide-image .item");
  $id("slide").appendChild(lists[0]);
};
$id("prev").onclick = function () {
  let lists = $$(".slide-image .item");
  $id("slide").prepend(lists[lists.length - 1]);
};
