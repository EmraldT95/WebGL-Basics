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

    uniform vec4 u_color;

    void main() {
      gl_FragColor = u_color;
    }
  `

// Generates a random integer between 0 <-> range
const randomInt = (range: number) => {
  return Math.abs(Math.floor(Math.random() * range))
}

// Render a rectangle
const drawRectangle = (
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number,
  colorUniformLocation: WebGLUniformLocation | null,
) => {
  var x1 = x
  var x2 = x + width
  var y1 = y
  var y2 = y + height

  // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
  // whatever buffer is bound to the `ARRAY_BUFFER` bind point
  // but so far we only have one buffer. If we had more than one
  // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW)

  // Set the color.
  gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1)

  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6)
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
    var colorUniformLocation = gl.getUniformLocation(program, 'u_color')

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
    for (let i = 1; i < 10; i++) {
      drawRectangle(
        gl,
        randomInt(gl.canvas.width / 2),
        randomInt(gl.canvas.width / 2),
        randomInt(gl.canvas.width / 2),
        randomInt(gl.canvas.width / 2),
        colorUniformLocation,
      )
    }
  }
})
</script>

<style scoped></style>
