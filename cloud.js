import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const SPEED = 0.025
const CLOUD_INTERVAL_MIN = 500
const CLOUD_INTERVAL_MAX = 4000
const bgElem = document.querySelector("[data-bg]")

let nextCloudTime
let cloudYPos
export function setupCloud() {
    nextCloudTime = CLOUD_INTERVAL_MIN
    document.querySelectorAll("[data-cloud]").forEach(cloud => {
        cloud.remove()
    })
}

export function updateCloud(delta, speedScale) {
    document.querySelectorAll("[data-cloud]").forEach(cloud => {
        incrementCustomProperty(cloud, "--left", delta * speedScale * SPEED * -1)
        if (getCustomProperty(cloud, "--left") <= -100) {
            cloud.remove()
        }
    })

    if (nextCloudTime <= 0) {
        createCloud()
        nextCloudTime = randomNumberBetween(CLOUD_INTERVAL_MIN, CLOUD_INTERVAL_MAX) / speedScale
    }
    nextCloudTime -= delta
}

function createCloud() {
    const cloud = document.createElement("img")
    cloud.dataset.cloud = true
    cloud.src = "imgs/cloud.png"
    cloud.classList.add("cloud")
    setCustomProperty(cloud, "--left", 100)
    cloudYPos = randomNumberBetween(5, 45)
    setCustomProperty(cloud, "--top", cloudYPos)
    bgElem.append(cloud)
    //document.body.append(cloud)
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}