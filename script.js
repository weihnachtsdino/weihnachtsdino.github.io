import { setupGround, updateGround } from "./ground.js"
import { setupDino, updateDino, getDinoRect, setDinoLose } from "./dino.js"
import { setupCactus, updateCactus, getCactusRects } from "./cactus.js"

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })


let lastTime
let speedScale
let score
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
    updateSpeedScale(delta)
    updateScore(delta)
    if (checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

function checkLose() {
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

let dinoRight
let dinoLeft
let dinoTop
let dinoBottom
let dinoWidth
let dinoHeight

let rect1Width 
let rect1Height
let rect1Right 
let rect1Left
let rect1Top
let rect1Bottom
function isCollision(rect1, dinoRect) {
    dinoWidth = dinoRect.right - dinoRect.left
    dinoHeight = dinoRect.bottom - dinoRect.top
    dinoRight = dinoRect.right - 0.25 * dinoWidth
    dinoLeft = dinoRect.left + 0.25 * dinoWidth
    dinoTop = dinoRect.top + 0.25 * dinoHeight
    dinoBottom = dinoRect.bottom - 0.25 * dinoHeight

    rect1Width = rect1.right - rect1.left
    rect1Height = rect1.bottom - rect1.top
    rect1Right = rect1.right - 0.25 * rect1Width
    rect1Left = rect1.left + 0.25 * rect1Width
    rect1Top = rect1.top + 0.25 * rect1Height
    rect1Bottom = rect1.bottom - 0.25 * rect1Height
    
    return (
        rect1Left < dinoRight &&
        rect1Top < dinoBottom  &&
        rect1Right > dinoLeft  &&
        rect1Bottom > dinoTop 
    )
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
    score += delta * 0.01
    scoreElem.textContent = Math.floor(score) + " €"
}

function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupDino()
    setupCactus()
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
}

function handleLose() {
    setDinoLose()
    startScreenElem.classList.remove("hide")
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true })
    }, 1000)
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