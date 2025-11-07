<script setup>
import { ref } from "vue"
import {
  margin, width, height, magnit, centerChangeable, center, changeCenter, increaseMagnit, decreaseMagnit,} from "@/composables/useConfig.js"
import { lines, previewLine } from "@/composables/useLines.js"
import { buttons, preventClick } from "@/composables/useButtons.js"

import {handleKeyPress} from "@/composables/useKeyboard.js";
import {onMouseMovePreview} from "@/composables/useLines.js";

import ButtonNode from "./ButtonNode.vue"
import ConnectionLine from "./ConnectionLine.vue"
import {startMovingCenter} from "@/composables/useCanvas.js";

window.addEventListener("mousemove", onMouseMovePreview)
window.addEventListener("keydown", handleKeyPress)

const isMouseDown = ref(false);

function handleMouseDown(event) {

  const hoveredButton = buttons.value.find(b => b.hovered)
  if (hoveredButton) {
    return
  }

  startMovingCenter(event)
}

</script>

<template>
  <div class="flex">
    <div class="relative border rounded-3xl"
         :style="{ width: width + 'px', height: height + 'px', margin: margin + 'px'}"
         @mousedown="e => handleMouseDown(e)">
      <svg :width="width" :height="height">
        <ConnectionLine v-for="(line, i) in lines" :key="i" :line="line" />
        <line v-if="previewLine"
              :x1="previewLine.fromButton.position.x"
              :y1="previewLine.fromButton.position.y"
              :x2="previewLine.x"
              :y2="previewLine.y"
              stroke="blue" stroke-width="1" stroke-dasharray="5,5"/>
      </svg>
      <div :style="{ position: 'absolute', top: center.y + 'px', left: center.x + 'px', width: '5px', height: '5px', backgroundColor: 'red', transform: 'translate(-50%, -50%)' }"></div>
      <ButtonNode v-for="b in buttons" :key="b.id" :button="b" />
    </div>
    <div class="flex-initial">
      <div>
        <table class="table-auto border-collapse border border-slate-400 mt-5">
          <thead>
          <tr>
            <th class="border border-slate-300 px-4 py-2">ID</th>
            <th class="border border-slate-300 px-4 py-2">Label</th>
            <th class="border border-slate-300 px-4 py-2">Rel X</th>
            <th class="border border-slate-300 px-4 py-2">Rel Y</th>
            <th class="border border-slate-300 px-4 py-2">Select</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="b in buttons" :key="b.id">
            <td class="border border-slate-300 px-4 py-2">{{ b.id }}</td>
            <td class="border border-slate-300 px-4 py-2">{{ b.label }}</td>
            <td class="border border-slate-300 px-4 py-2">{{ b.relativePos.x }}</td>
            <td class="border border-slate-300 px-4 py-2">{{ b.relativePos.y }}</td>
            <td class="border border-slate-300 px-4 py-2">{{ b.selected }}</td>
            <td class="border border-slate-300 px-4 py-2">{{b.hovered}}</td>
          </tr>
          </tbody>
        </table>
        <br>
        <table>
          <thead>
          <tr>
            <th class="border border-slate-300 px-4 py-2">From</th>
            <th class="border border-slate-300 px-4 py-2">To</th>
            <th class="border border-slate-300 px-4 py-2">Value</th>
            <th class="border border-slate-300 px-4 py-2">Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(line, index) in lines" :key="index">
            <td class="border border-slate-300 px-4 py-2">{{ line.fromButton.label }}</td>
            <td class="border border-slate-300 px-4 py-2">{{ line.toButton.label }}</td>
            <td class = "border border-slate-300 px-4 py-2">{{line.linevalue}}</td>
            <td @click="lines.splice(index, 1)" class="border border-slate-300 px-4 py-2 bg-red-400 p-0 text-center">
               -
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div>

        <p class="mt-5">Магніт: {{ magnit }} px</p>
        <p>{{preventClick}} - {{isMouseDown}}</p>
        <button @click="increaseMagnit" class="px-1 py-2 bg-amber-300">+5 px</button>
        <button @click="decreaseMagnit" class="px-1 py-2 bg-amber-400">-5 px</button>
        <p>Центр x {{centerChangeable.x}}</p>
        <button @click="changeCenter(-1, 0)" class="px-1 py-2 bg-emerald-300">-1 px</button>
        <button @click="changeCenter(1, 0)" class="px-1 py-2 bg-emerald-400">+1 px</button>
        <p>Центр y {{centerChangeable.y}}</p>
        <button @click="changeCenter(0, -1)" class="px-1 py-2 bg-emerald-300">-1 px</button>
        <button @click="changeCenter(0, 1)" class="px-1 py-2 bg-emerald-400">+1 px</button>
      </div>
    </div>
  </div>
</template>
