import "./dev"
import OverlayEditor from "./OverlayEditor"
import LockedScalingStrategy from "./Strategy/LockedScalingStrategy"
import ImageSubject from "./Subject/ImageSubject"



export function main() {
    const canvas = document.querySelector<HTMLElement>(".preview")

    const subject = new ImageSubject()
    const editor = new OverlayEditor(canvas, subject)
}








// const canvas = document.querySelector<HTMLElement>(".preview")
// const pointA = new Point(0, 0)
// const pointAB = new Point(160, 0)
// const pointB = new Point(320, 0)
// const pointBC = new Point(320, 120)
// const pointC = new Point(320, 240)
// const pointCD = new Point(160, 240)
// const pointD = new Point(0, 240)
// const pointDA = new Point(0, 120)
// const polygon = new Polygon(pointA, pointAB, pointB, pointBC, pointC, pointCD, pointD, pointDA)
// const line = new Line(pointA, pointC)
//
// // canvas.append(pointA.element)
// // canvas.append(pointB.element)
// // canvas.append(pointC.element)
// // canvas.append(pointD.element)
// // canvas.append(polygon.element)
// // canvas.append(line.element)
// // line.prepare(canvas)
// polygon.prepare(canvas)
// polygon.position = { x: 250, y: 250 }
// // line.direction = 1.5 * Math.PI
//
// function tick() {
//     // line.position = { x: 150, y: 150 }
//     // line.x += 1
//     // line.y += 1
//     // line.direction += 0.0015 * Math.PI
//     // pointA.direction += 0.0025 * Math.PI
//     // pointC.direction -= 0.0025 * Math.PI
//     // pointA.x = pointA.x + 2
//     // pointA.y = pointA.y + 1
//     // pointB.x = pointB.x + 1
//     // pointB.y = pointB.y + 2
//     // point.y = point.y + 3
//
//     // line.draw()
//     polygon.draw()
//     // polygon.x += .25
//     // polygon.y += .25
//     // polygon.direction += Math.PI * 0.01
//     // console.log(polygon.direction)
//     requestAnimationFrame(tick)
// }
//
// tick()