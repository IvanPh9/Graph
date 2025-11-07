// /models/Button.js
import { ref, computed, reactive } from "vue" // <-- Імпортуємо інструменти Vue

export class Button {

    constructor(id, label, size, relativePos, externalRefs) {

        const {
            width, height, center,
            centerChangeable, magnit, buttons
        } = externalRefs

        this.id = id
        this.label = label

        this.color = ref("white")
        this.selected = ref(false)

        this.relativePos = reactive({ ...relativePos })

        this.baseSize = ref(size)

        this.computedSize = computed(() => {
            const containerHalfWidth = width.value / 2
            const containerCenterOffset = centerChangeable.value.x
            const elementCenterX = this.relativePos.x
            const defaultHalfSize = this.baseSize.value / 2

            const rightEdge = containerHalfWidth - containerCenterOffset
            const leftEdge = -containerHalfWidth - containerCenterOffset

            const spaceToRight = Math.max(0, rightEdge - elementCenterX)
            const spaceToLeft = Math.max(0, elementCenterX - leftEdge)

            const actualHalfSize = Math.min(defaultHalfSize, spaceToRight, spaceToLeft)

            return actualHalfSize * 2
        })

        this.isShowed = computed(() => {
            const containerHalfWidth = width.value / 2
            const containerCenterOffset = centerChangeable.value.x
            const rightEdge = containerHalfWidth - containerCenterOffset
            const leftEdge = -containerHalfWidth - containerCenterOffset

            const isFullyOutsideRight = (this.relativePos.x > rightEdge)
            const isFullyOutsideLeft = (this.relativePos.x  < leftEdge)

            return !(isFullyOutsideLeft || isFullyOutsideRight)
        })

        this.hovered = ref(false)

        this.position = computed(() => {
            return {
                x: center.value.x + this.relativePos.x,
                y: center.value.y - this.relativePos.y
            }
        })


        this.switchSelection = (bool) => {
            this.selected.value = bool
            this.color.value = this.selected.value ? "blue" : "white"
        }

        this.setPositionFromAbsolute = (x, y) => {
            let relX = - (center.value.x - x)
            let relY = center.value.y - y

            relX = Math.round(relX / magnit.value) * magnit.value
            relY = Math.round(relY / magnit.value) * magnit.value

            // Використовуємо базовий розмір для розрахунку меж
            const mySize = this.baseSize.value
            const halfWidth = (width.value / 2 - mySize / 2)
            const halfHeight = (height.value / 2 - mySize / 2)

            relX = Math.min(Math.max(relX, -halfWidth - centerChangeable.value.x), halfWidth - centerChangeable.value.x)
            relY = Math.min(Math.max(relY, -halfHeight + centerChangeable.value.y), halfHeight + centerChangeable.value.y)

            // Логіка зіткнень
            for (const b of buttons.value) { // 'buttons' прийшов з externalRefs
                // Переконуємось, що інша кнопка 'b' має baseSize
                if (!b.baseSize) continue

                const distance = Math.hypot(b.relativePos.x - relX, b.relativePos.y - relY)
                const otherButtonSize = b.baseSize.value

                if (b.id !== this.id && distance < (otherButtonSize / 2 + mySize / 2)) {
                    return // Зіткнення, не рухаємо
                }
            }

            this.relativePos.x = relX
            this.relativePos.y = relY
        }
    }

    // Старі методи видалені, оскільки вони тепер визначені в конструкторі
    // resizeButton() -> this.computedSize
    // switchSeletcion() -> this.switchSeletcion
    // get position() -> this.position
    // setPositionFromAbsolute() -> this.setPositionFromAbsolute
}