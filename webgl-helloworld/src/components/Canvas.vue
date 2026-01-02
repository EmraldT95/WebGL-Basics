<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup lang="ts">
import { Utils } from '@/classes/gl_Utils'
import { computed, onMounted, ref, useTemplateRef, type Ref } from 'vue'

let canvas = useTemplateRef('canvas')

const props = defineProps<{
  vertexShaderSource: string
  fragmentShaderSource: string
}>()

const programRef: Ref<WebGLProgram | undefined> = ref()

// Gets the WebGL context from the canvas
const glCtx = computed(() => {
  let gl = canvas.value?.getContext('webgl')

  if (gl !== null && gl !== undefined) {
    // Set the size of the canvas.
    Utils.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement)

    return gl
  }
})

onMounted(() => {
  let gl = glCtx.value

  if (gl !== null && gl !== undefined) {
    // Link the two shaders into a program
    var program = Utils.createProgram(gl, props.vertexShaderSource, props.fragmentShaderSource)
    programRef.value = program

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program)
  }
})

defineExpose({ gl: glCtx, program: programRef })
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
