const rootEl = document.createElement("div")
rootEl.style.position = "fixed"
rootEl.style.top = "0"
rootEl.style.left = "0"
rootEl.className = "dev"
rootEl.innerHTML = `
<div>
    <strong>Guide</strong>
    <p>
        Use \`1\` - \`3\` keys to switch between modes. <br> 
        Keep in mind once you switch to mode \`3\` you cannot switch back. <br>
    </p>
    <p>
        Use mouse wheel while hovering the layer to rotate the image.
    </p>
    <br>
    <strong>State</strong>
</div>
<table>
    <tr>
        <td>FPS</td>
        <td align="right"><span class="fps"/></td>
    </tr>
    <tr>
        <td>MODE</td>
        <td align="center"><span class="mode"/></td>
    </tr>
    <tr>
        <td>ROTATION</td>
        <td align="right"><span class="rotation"/></td>
    </tr>
</table>
`
document.body.prepend(rootEl)

const fpsEl = rootEl.querySelector(".fps")
const modeEl = rootEl.querySelector(".mode")
const rotationEl = rootEl.querySelector(".rotation")
modeEl.textContent = "Locked Scaling"
rotationEl.textContent = "0.00°"

let previousTick = 0
let frameCount = 0
function frame() {
    const tick = Date.now()
    frameCount++;
    if (tick > previousTick + 1000) {
        let fps = Math.round( ( frameCount * 1000 ) / ( tick - previousTick ) );
        previousTick = tick;
        frameCount = 0;

        fpsEl.textContent = String(fps)
    }

    requestAnimationFrame(frame)

}

frame()