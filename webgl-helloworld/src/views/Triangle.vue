<template>
  <Canvas ref="canvasComp" :vertexShaderSource="vertexShader2d" :fragment-shader-source="fragmentShader2d" />
</template>

<script setup lang="ts">
import Canvas from '@/components/Canvas.vue'
import { onMounted, useTemplateRef } from 'vue'

let canvasComp = useTemplateRef('canvasComp')

let vertexShader2d = `
  attribute vec2 a_position;
  uniform vec2 u_resolution;

  void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    // Multiplying with vec2 to render from the top-left corner.
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`

// Fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. `gl_FragColor` is a
// special variable a fragment shader is responsible for setting.
let fragmentShader2d = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1.0, 0, 0.5, 1);
  }
`

// Render a triangle
const drawTriangle = (gl: WebGLRenderingContext) => {
  let width = gl.canvas.width
  let height = gl.canvas.height
  let centerX = Math.floor(width / 2)
  let centerY = Math.floor(height / 2)

  var positions = [centerX, centerY - 80, centerX + 80, centerY + 40, centerX - 80, centerY + 40]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

onMounted(() => {
  if (canvasComp.value !== null) {
    let gl = canvasComp.value.gl
    let program = canvasComp.value.program

    if (gl === undefined || program === undefined) {
      return
    }

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')

    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer()

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program)

    // set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation)

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2 // 2 components per iteration
    var type = gl.FLOAT // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0 // start at the beginning of the buffer

    // NOTE: Hidden fact about this function is that it will bind the current ARRAY_BUFFER
    // to the attribute, hence setting the ARRAY_BUFFER free to bind to something else.
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    // draw
    drawTriangle(gl)
  }
})
</script>

<style scoped>
#c {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
