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

function baseTemplate(ctx: string) {}

export function parseHTML(html) {
  let t = document.createElement("template");
  t.innerHTML = html;
  return t.content.cloneNode(true);
}
