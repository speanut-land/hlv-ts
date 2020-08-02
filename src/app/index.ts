import { parseHTML } from "./parseHtml";
let template = `
<canvas id="canvas"></canvas>
<div class="tools">
  <div class="container">
    <button class="save" id="save" title="保存"></button>
    <button class="brush active" id="brush" title="画笔"></button>
    <button class="eraser" id="eraser" title="橡皮擦"></button>
    <button class="clear" id="clear" title="清屏"></button>
    <button class="undo" id="undo" title="撤销"></button>
    <button class="redo" id="redo" title="再做"></button>
  </div>
</div>
<div class="pen-detail" id="penDetail">
  <i class="closeBtn"></i>
  <p>笔大小</p>
  <span class="circle-box"><i id="thickness"></i></span>
  <input type="range" id="range1" min="1" max="10" value="1" />
  <p>笔颜色</p>
  <ul class="pen-color clearfix">
    <li class="color-item active" style="background-color: black;"></li>
    <li class="color-item" style="background-color: #ff3333;"></li>
    <li class="color-item" style="background-color: #99cc00;"></li>
    <li class="color-item" style="background-color: #0066ff;"></li>
    <li class="color-item" style="background-color: #ffff33;"></li>
    <li class="color-item" style="background-color: #33cc66;"></li>
  </ul>
  <p>不透明度</p>
  <i class="showOpacity"></i>
  <input type="range" id="range2" min="1" max="10" value="1" />
</div>`;
document.getElementById("app").appendChild(parseHTML(template));
let canvas = <HTMLCanvasElement>document.getElementById("canvas");
let context = canvas.getContext("2d");
let eraser = document.getElementById("eraser");
let brush = document.getElementById("brush");
let reSetCanvas = document.getElementById("clear");
let save = document.getElementById("save");
let penDetail = document.getElementById("penDetail");
let aColorBtn = document.getElementsByClassName("color-item");
let undo = document.getElementById("undo");
let redo = document.getElementById("redo");

let closeBtn = document.querySelectorAll(".closeBtn");
let eraserEnabled = false;
let ifPop = false;
let lWidth = 2;
let radius = 5;

autoSetSize();

setCanvasBg("white");

listenToUser();
// 改变画笔颜色
getColor();
function autoSetSize() {
  let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  let pageWidth = document.documentElement.clientWidth;
  let pageHeight = document.documentElement.clientHeight;
  canvas.width = pageWidth;
  canvas.height = pageHeight;
  context.putImageData(imgData, 0, 0);
}
let initalY;

// 监听用户鼠标事件
function listenToUser() {
  // 定义一个变量初始化画笔状态
  let painting = false;
  // 记录画笔最后一次的位置
  let lastPoint = { x: undefined, y: undefined };
  // 鼠标按下事件
  canvas.onmousedown = function (e) {
    painting = true;
    let x1 = e.clientX;
    let y1 = e.clientY;
    initalY = e.clientY;
    if (eraserEnabled) {
      //要使用eraser
      //鼠标第一次点下的时候擦除一个圆形区域，同时记录第一个坐标点
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      radius = lWidth / 2 > 5 ? lWidth / 2 : 5;
      context.arc(x1, y1, radius, 0, 2 * Math.PI);
      context.clip();
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();
      lastPoint = { x: x1, y: y1 };
    } else {
      lastPoint = { x: x1, y: y1 };
    }
  };

  // 鼠标移动事件
  canvas.onmousemove = function (e) {
    let x1 = lastPoint.x;
    let y1 = lastPoint.y;
    let x2 = e.clientX;
    let y2 = e.clientY;
    if (!painting) {
      return;
    }
    if (eraserEnabled) {
      moveHandler(x1, y1, x2, y2);
      //记录最后坐标
      lastPoint.x = x2;
      lastPoint.y = y2;
    } else {
      let newPoint = { x: x2, y: y2 };
      drawLine(lastPoint.x, initalY, newPoint.x, newPoint.y);
      lastPoint = newPoint;
    }
  };

  // 鼠标松开事件
  canvas.onmouseup = function () {
    painting = false;
    canvasDraw();
  };
}

//
function moveHandler(x1, y1, x2, y2) {
  //获取两个点之间的剪辑区域四个端点
  var asin = radius * Math.sin(Math.atan((y2 - y1) / (x2 - x1)));
  var acos = radius * Math.cos(Math.atan((y2 - y1) / (x2 - x1)));
  var x3 = x1 + asin;
  var y3 = y1 - acos;
  var x4 = x1 - asin;
  var y4 = y1 + acos;
  var x5 = x2 + asin;
  var y5 = y2 - acos;
  var x6 = x2 - asin;
  var y6 = y2 + acos; //保证线条的连贯，所以在矩形一端画圆

  context.save();
  context.beginPath();
  context.globalCompositeOperation = "destination-out";
  radius = lWidth / 2 > 5 ? lWidth / 2 : 5;
  context.arc(x2, y2, radius, 0, 2 * Math.PI);
  context.clip();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore(); //清除矩形剪辑区域里的像素

  context.save();
  context.beginPath();
  context.globalCompositeOperation = "destination-out";
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.closePath();
  context.clip();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

// 画线函数
function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.lineWidth = lWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.moveTo(x1, initalY);
  context.lineTo(x2, initalY);
  context.stroke();
  context.closePath();
}

// 点击橡皮檫
eraser.onclick = function () {
  eraserEnabled = true;
  eraser.classList.add("active");
  brush.classList.remove("active");
};
// 点击画笔
brush.onclick = function () {
  eraserEnabled = false;
  brush.classList.add("active");
  eraser.classList.remove("active");
  if (!ifPop) {
    // 弹出框
    penDetail.classList.add("active");
  } else {
    penDetail.classList.remove("active");
  }
  ifPop = !ifPop;
};

// 实现清屏
reSetCanvas.onclick = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBg("white");
  canvasHistory = [];
  undo.classList.remove("active");
  redo.classList.remove("active");
};

// 重新设置canvas背景颜色
function setCanvasBg(color) {
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// 下载图片
save.onclick = function () {
  let imgUrl = canvas.toDataURL("image/png");
  let saveA = document.createElement("a");
  document.body.appendChild(saveA);
  saveA.href = imgUrl;
  saveA.download = "mypic" + new Date().getTime();
  saveA.target = "_blank";
  saveA.click();
};

function getColor() {
  Array.from(aColorBtn).forEach((item) => {
    item.addEventListener("click", function () {
      for (let i = 0; i < aColorBtn.length; i++) {
        aColorBtn[i].classList.remove("active");
        this.classList.add("active");
        let activeColor = this.style.backgroundColor;
        context.fillStyle = activeColor;
        context.strokeStyle = activeColor;
      }
      penDetail.classList.remove("active");
      ifPop = false;
    });
  });
}

// 实现撤销和重做的功能
let canvasHistory = [];
let step = -1;

// 绘制方法
function canvasDraw() {
  step++;
  if (step < canvasHistory.length) {
    canvasHistory.length = step; // 截断数组
  }
  // 添加新的绘制到历史记录
  canvasHistory.push(canvas.toDataURL());
  if (step > 0) {
    undo.classList.add("active");
  }
}

// 撤销方法
function canvasUndo() {
  if (step > 0) {
    step--;
    let canvasPic = new Image();
    canvasPic.src = canvasHistory[step];
    canvasPic.onload = function () {
      context.drawImage(canvasPic, 0, 0);
    };
    undo.classList.add("active");
    redo.classList.add("active");
  } else {
    undo.classList.remove("active");
    alert("不能再继续撤销了");
  }
}
// 重做方法
function canvasRedo() {
  if (step < canvasHistory.length - 1) {
    step++;
    let canvasPic = new Image();
    canvasPic.src = canvasHistory[step];
    canvasPic.onload = function () {
      context.drawImage(canvasPic, 0, 0);
    };
    // redo.classList.add('active');
  } else {
    redo.classList.remove("active");
    alert("已经是最新的记录了");
  }
}
undo.onclick = function () {
  canvasUndo();
};
redo.onclick = function () {
  canvasRedo();
};

closeBtn.forEach((item) => {
  item.addEventListener("click", function (e: any) {
    let btnParent = e.target.parentElement;
    btnParent.classList.remove("active");
  });
});
