import { ref } from "vue"
import { Line } from "@/models/Line.js"
import { buttons, preventClick } from "./useButtons.js"

export const lines = ref([])
export const previewLine = ref(null)


export function handleButtonClick(event, button) {
    if (preventClick.value) return // якщо був drag — ігноруємо click
    clickButtonToDrawLine(button)
}

function clickButtonToDrawLine(button) {
    const selectedButton = buttons.value.find(b => b.selected);

    if (!selectedButton) {
        button.switchSelection(true)
        return
    }

    if (selectedButton.id === button.id) {
        button.switchSelection(false)
        previewLine.value = null
        return;
    }

    const lineExists = lines.value.some(
        line => (line.fromButton.id === selectedButton.id && line.toButton.id === button.id) ||
            (line.toButton.id === selectedButton.id && line.fromButton.id === button.id)
    );

    if (lineExists) {
        selectedButton.switchSelection(false)
        previewLine.value = null
        return;
    }
    console.log('1')
    lines.value.push(new Line(selectedButton, button))
    console.log('2')

    selectedButton.switchSelection(false)
    previewLine.value = null;
}

export function onMouseMovePreview(event) {

    const selectedButtons = buttons.value.filter(b => b.selected)

    if (selectedButtons.length === 1) {
        const btn = selectedButtons[0];
        previewLine.value = {
            fromButton: btn,
            x: event.clientX,
            y: event.clientY
        };
    } else {
        previewLine.value = null
    }
    }