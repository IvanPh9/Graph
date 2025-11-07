// useButtons.js
import { ref } from "vue"
import { Button } from "@/models/Button.js"
import { magnit, width, height, center, centerChangeable } from "./useConfig.js"

export const buttons = ref([])

// Функція-"фабрика" для створення нових кнопок
export function createNewButton(id, label, size, relativePos) {

    const externalRefs = {
        magnit,
        width,
        height,
        center,
        centerChangeable,
        buttons // Передаємо сам масив для логіки зіткнень
    }

    const buttonInstance = new Button(id, label, size, relativePos, externalRefs)

    // 3. Додаємо екземпляр до реактивного масиву
    buttons.value.push(buttonInstance)
}

createNewButton(1, "А", 50, { x: 50, y: 50 })
createNewButton(2, "B", 50, { x: -50, y: -50 })

let draggingButton = null
let offsetX = 0
let offsetY = 0
export const preventClick = ref(false) // <-- Змінено на ref та експортовано

export function startMoving(event, button) {
    const selectedButtons = buttons.value.filter(b => b.selected)
    if (selectedButtons.length > 0) {
        return
    }
    draggingButton = button
    preventClick.value = false
    const pos = button.position
    offsetX = event.clientX - pos.x
    offsetY = event.clientY - pos.y

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", stopMoving)
}

function onMouseMove(event) {
    if (!draggingButton) return
    preventClick.value = true // Був рух — не виконувати click
    draggingButton.setPositionFromAbsolute(event.clientX - offsetX, event.clientY - offsetY)
}

function stopMoving(event) {
    if (draggingButton) {
        draggingButton.switchSelection(false) // після drag завжди знімаємо виділення
    }
    draggingButton = null
    window.removeEventListener("mousemove", onMouseMove)
    window.removeEventListener("mouseup", stopMoving)
}