var gCanvas;
var gCtx;
var gImg;
var gCurrShape = "line";
var gCurrColor = document.querySelector("#color-select");
var gFlag = false;
var loX;
var loY;
function init() {
  gCanvas = document.querySelector(".canvas");
  gCtx = gCanvas.getContext("2d");
  // drawLine(100, 100, 130, 540);
  resize();
  window.addEventListener("resize", () => {
    // console.log("resized");
    resize();
  });
}
// function shareCanvas(ev) {

// }

function shareCanvas() {
  const imgDataUrl = gCanvas.toDataURL("image/jpeg");

  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);
    console.log(encodedUploadedImgUrl);
    document.querySelector(".share-container").innerHTML = `
      <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
         Share   
      </a>`;
  }

  doShareCanvas(imgDataUrl, onSuccess);
}

function doShareCanvas(imgDataUrl, onSuccess) {
  const formData = new FormData();
  formData.append("img", imgDataUrl);

  fetch("//ca-upload.com/here/upload.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then((url) => {
      console.log("Got back live url:", url);
      onSuccess(url);
    })
    .catch((err) => {
      console.error(err);
    });
}
function uploadImage(ev) {
  loadImageFromInput(ev, drawImg);
}
function loadImageFromInput(ev, onImageReady) {
  var reader = new FileReader();
  reader.readAsDataURL(ev.target.files[0]);

  reader.onload = (ev) => {
    console.log("onload");
    var img = new Image();
    // Render on canvas
    img.onload = onImageReady.bind(null, img);
    img.src = ev.target.result;
    gImg = img;
  };
}
function drawImg() {
  gCtx.drawImage(gImg, 0, 0, gCanvas.width, gCanvas.height);
}
function downloadCanvas(elImg) {
  console.log(elImg);
  var imgUrl = gCanvas.toDataURL("image/jpeg");
  elImg.href = imgUrl;
}

function drawLine(x, y, loX = 250, loY = 250) {
  // console.log("line2");

  gCtx.strokeStyle = gCurrColor.value;
  gCtx.lineWidth = 3;
  gCtx.beginPath();
  gCtx.moveTo(x, y);
  gCtx.lineTo(loX, loY);
  gCtx.stroke();
  gCtx.closePath();
}
function drawRect(x, y) {
  gCtx.beginPath();
  gCtx.rect(x, y, 30, 30);
  gCtx.fillStyle = "white";
  gCtx.fillRect(x, y, 30, 30);
  gCtx.strokeStyle = gCurrColor.value;
  gCtx.stroke();
}
function drawArc(x, y) {
  gCtx.beginPath();
  gCtx.lineWidth = 6;
  gCtx.arc(x, y, 20, 0, 2 * Math.PI);
  gCtx.fillStyle = "white";
  gCtx.stroke();
  gCtx.strokeStyle = gCurrColor.value;
  gCtx.fill();
}
function resize() {
  var elContainer = document.querySelector(".main-container");
  // Note: changing the canvas dimension this way clears the canvas
  gCanvas.width = elContainer.offsetWidth - 20;
  // console.log((gCanvas.width = elContainer.offsetWidth - 20));
  // Unless needed, better keep height fixed.
  //   gCanvas.height = elContainer.offsetHeight
}
function clearCanvas() {
  // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  // You may clear part of the canvas
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function startDraw(ev) {
  ev.preventDefault();
  gFlag = true;
  loX = ev.offsetX ? ev.offsetX : ev.touches[0].clientX - gCanvas.offsetLeft;
  loY = ev.offsetY ? ev.offsetY : ev.touches[0].clientY - gCanvas.offsetTop;
}
function endDraw(ev) {
  ev.preventDefault();
  gFlag = false;
}
function setShape() {
  console.log(gCurrShape);
  var elSelectShape = document.querySelector("#shape-select");
  gCurrShape = elSelectShape.value;
}
function draw(ev) {
  // console.dir(ev);
  // console.log(ev);

  var offsetX = ev.offsetX
    ? ev.offsetX
    : ev.touches[0].clientX - gCanvas.offsetLeft;
  var offsetY = ev.offsetY
    ? ev.offsetY
    : ev.touches[0].clientY - gCanvas.offsetTop;
  if (gFlag) {
    // loX = offsetX;
    // loY = offsetY;
    // console.log(offsetX, offsetY);
    switch (gCurrShape) {
      case "triangle":
        drawTriangle(offsetX, offsetY, loX, loY);
        break;
      case "square":
        drawRect(offsetX, offsetY);
        break;
      case "text":
        drawText("שלום", offsetX, offsetY);
        break;
      case "line":
        // console.log("line");
        drawLine(offsetX, offsetY, loX, loY);
        break;
      case "circle":
        drawArc(offsetX, offsetY);
        break;
    }
  }
  loX = ev.offsetX ? ev.offsetX : ev.touches[0].clientX - gCanvas.offsetLeft;
  loY = ev.offsetY ? ev.offsetY : ev.touches[0].clientY - gCanvas.offsetTop;
}
