import { ref, computed } from "vue"

export const width = ref(1300)
export const height = ref(700)
export const margin = ref(10)
export const magnit = ref(5)

export const centerChangeable = ref({ x: 0, y: 0 })

export function changeCenter(dx, dy) {
    // dx - це нова ЦІЛЬОВА X-координата (напр., mouse.x)
    // dy - це нова ЦІЛЬОВА Y-координата (напр., mouse.y)

    let currentX = centerChangeable.value.x;
    let currentY = centerChangeable.value.y;

    // Розраховуємо різницю (відстань до цілі)
    let distanceX = dx - currentX;
    let distanceY = dy - currentY;

    const smoothingFactor = 0.1;  // Чим менше значення, тим плавніше рух

    // Рухаємося на ЧАСТИНУ цієї відстані (на 10% в даному випадку)
    centerChangeable.value.x = currentX + distanceX * smoothingFactor;
    centerChangeable.value.y = currentY + distanceY * smoothingFactor;
}

export const center = computed(() => ({
    x: (width.value / 2) + centerChangeable.value.x,
    y: (height.value / 2) + centerChangeable.value.y
}))

export function increaseMagnit() {
    magnit.value += 5
}

export function decreaseMagnit() {
    magnit.value = Math.max(5, magnit.value - 5)
}
