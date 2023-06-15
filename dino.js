import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const dinoElem = document.querySelector("[data-dino]")
const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let isFalling
let dinoFrame
let currentFrameTime
let yVelocity
let jumpTime
let jumpStartTime
export function setupDino(){
    isJumping = false
    isFalling = false
    dinoFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(dinoElem, "--bottom", 0)
    document.removeEventListener("keydown", onJump)
    document.removeEventListener("keyup", stopJump)
    document.addEventListener("keydown", onJump)
    document.addEventListener("keyup", stopJump)
}

export function updateDino(delta, speedScale){
    handleRun(delta, speedScale)
    handleJump(delta)
    handleFall(delta)
}

export function getDinoRect() {
    return dinoElem.getBoundingClientRect()
}

export function setDinoLose(){
    dinoElem.src = "imgs/dino-lose.png"
}

function handleRun(delta, speedScale){
    if (isJumping) {
        dinoElem.src = `imgs/dino-stationary.png`
        return
    }

    if (currentFrameTime >= FRAME_TIME) {
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
        dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
        currentFrameTime -= FRAME_TIME
    }
    currentFrameTime += delta * speedScale
}

/* function onJump(){
    isGrounded = getCustomProperty(dinoElem, "--bottom")
    document.addEventListener("keyup", outJump)

    if (isGrounded <= 0 && e.code == "Space") {
        isJumping = true
        jumpTime = jumpStartTime
        yVelocity = JUMP_SPEED
    }

    if (e.code == "Space" && isJumping == true) {
        if (jumpTime > 0) {
            incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta) 
            yVelocity -= GRAVITY * delta
        } else {
            isJumping = false
        }
    }
}

function outJump(){
    isJumping = false
} */

function handleJump(delta){
    if (!isJumping) return

    incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)
    
    if (getCustomProperty(dinoElem, "--bottom") <= 0) {
        setCustomProperty(dinoElem, "--bottom", 0)
        isJumping = false
    }

    if (yVelocity <= 0) {
        isJumping = false
        isFalling = true
    }

    yVelocity -= GRAVITY * delta
}

function onJump(e) {
    if (e.code !== "Space" || isJumping || isFalling) return

    yVelocity = JUMP_SPEED
    isJumping = true
    isFalling = false
}

function stopJump() {
    if (isFalling) return

    yVelocity = 0
    isJumping = false
    isFalling = true
}

function handleFall(delta) {
    if (!isFalling) return

    incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)
    
    if (getCustomProperty(dinoElem, "--bottom") <= 0) {
        setCustomProperty(dinoElem, "--bottom", 0)
        isJumping = false
        isFalling = false
    }

    yVelocity -= GRAVITY * delta
}