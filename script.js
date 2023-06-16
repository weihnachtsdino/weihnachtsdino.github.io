import { setupGround, updateGround } from "./ground.js"
import { setupDino, updateDino, getDinoRect, setDinoLose } from "./dino.js"
import { setupCactus, updateCactus, getCactusRects } from "./cactus.js"
import { setupCloud, updateCloud } from "./cloud.js"

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const highScoreElem = document.querySelector("[data-high-score]")
const startScreenElem = document.querySelector("[data-start-screen]")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })
document.addEventListener("mousedown", handleStart, { once: true })


let lastTime
let speedScale
var score
var highScore = 0
var endScreen = document.createElement("div")
function update(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime

    updateGround(delta, speedScale)
    updateDino(delta, speedScale)
    updateCactus(delta, speedScale)
    updateCloud(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    updateHighScore()
    if (checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

function checkLose() {
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, dinoRect) {
    let dinoWidth = dinoRect.right - dinoRect.left
    let dinoHeight = dinoRect.bottom - dinoRect.top
    let dinoRight = dinoRect.right - 0.25 * dinoWidth
    let dinoLeft = dinoRect.left + 0.25 * dinoWidth
    let dinoTop = dinoRect.top + 0.25 * dinoHeight
    let dinoBottom = dinoRect.bottom - 0.25 * dinoHeight

    let rect1Width = rect1.right - rect1.left
    let rect1Height = rect1.bottom - rect1.top
    let rect1Right = rect1.right - 0.25 * rect1Width
    let rect1Left = rect1.left + 0.25 * rect1Width
    let rect1Top = rect1.top + 0.25 * rect1Height
    let rect1Bottom = rect1.bottom - 0.25 * rect1Height

    return (
        rect1Left < dinoRight &&
        rect1Top < dinoBottom &&
        rect1Right > dinoLeft &&
        rect1Bottom > dinoTop
    )
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
    score += delta * 0.01
    var numb = Math.floor(score) / 100
    scoreElem.textContent = numb.toFixed(2) + " €"
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score
    }
    var numb = Math.floor(highScore) / 100
    highScoreElem.textContent = "Hi " + numb.toFixed(2) + " €";
}

function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupDino()
    setupCactus()
    setupCloud()
    startScreenElem.classList.add("hide")
    endScreen.classList.add("hide")
    window.requestAnimationFrame(update)
}

function handleLose() {
    setDinoLose()
    //startScreenElem.classList.remove("hide")
    setupEndScreen()
    endScreen.classList.remove("hide")
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true })
        document.addEventListener("mousedown", handleStart, { once: true })
    }, 800)
}

function setupEndScreen() {
    var numb = Math.floor(highScore) / 100
    endScreen.textContent = "Glückwunsch! \r\n Deine Spende beträgt \r\n" + numb.toFixed(2) + " € !"
    endScreen.classList.add("end-screen")
    document.body.append(endScreen)
}

function setPixelToWorldScale() {
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT
    }

    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}