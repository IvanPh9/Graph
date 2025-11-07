import { centerChangeable, magnit, changeCenter } from "./useConfig.js"

let offsetX = 0
let offsetY = 0

// Ціль, до якої "пливе" анімація
let targetPosition = { x: 0, y: 0 }

// ID нашого циклу анімації
let animationFrameId = null

export function startMovingCenter(event) {
    // 1. Розраховуємо зсув
    offsetX = event.clientX - centerChangeable.value.x
    offsetY = event.clientY - centerChangeable.value.y

    // 2. Встановлюємо початкову ціль (вона ж буде оновлюватися)
    targetPosition.x = event.clientX - offsetX
    targetPosition.y = event.clientY - offsetY

    // 3. Додаємо слухачів
    window.addEventListener("mousemove", onMouseMoveCenter)
    window.addEventListener("mouseup", stopMovingCenter)

    // 4. Якщо цикл анімації ще не запущений, запускаємо його
    //    (Ми перевіряємо, щоб не запускати 100 циклів одночасно)
    if (!animationFrameId) {
        animationLoop()
    }
}

function onMouseMoveCenter(event) {
    // Поки ми рухаємо мишу, ми просто оновлюємо ціль
    targetPosition.x = event.clientX - offsetX
    targetPosition.y = event.clientY - offsetY

    // (Важливо) Якщо анімація раптом зупинилася (допливла),
    // а ми знову посунули мишу, треба її "розбудити" і запустити знову.
    if (!animationFrameId) {
        animationLoop()
    }
}

function stopMovingCenter(event) {

    window.removeEventListener("mousemove", onMouseMoveCenter)
    window.removeEventListener("mouseup", stopMovingCenter)
}

// Цикл анімації
function animationLoop() {

    const currentX = centerChangeable.value.x
    const currentY = centerChangeable.value.y
    const targetX = targetPosition.x
    const targetY = targetPosition.y

    const stopCondition = 0.1
    if (Math.abs(targetX - currentX) < stopCondition &&
        Math.abs(targetY - currentY) < stopCondition)
    {

        centerChangeable.value.x = targetX
        centerChangeable.value.y = targetY

        animationFrameId = null // Скидаємо ID
        return // Виходимо з функції, не запитуючи наступний кадр
    }

    changeCenter(targetX, targetY)

    animationFrameId = requestAnimationFrame(animationLoop)
}