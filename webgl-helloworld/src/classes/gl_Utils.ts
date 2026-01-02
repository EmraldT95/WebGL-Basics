export class Utils {
  // Creates the shaders
  static createShader(gl: WebGLRenderingContext, type: number, source: string) {
    let shader = gl.createShader(type)
    if (shader === null) {
      throw 'could not create shader'
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    let success: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!success) {
      // Something went wrong during compilation; get the error
      let err = 'could not compile shader:' + gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw err
    }

    return shader
  }

  // Links the shaders
  static createProgram = (
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
  ): WebGLProgram => {
    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    var fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    var program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    var success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!success) {
      // something went wrong with the link
      let err = 'program failed to link:' + gl.getProgramInfoLog(program)
      gl.deleteProgram(program)
      throw err
    }

    return program
  }

  // Deletes the shaders and the program
  static deleteProgram = (gl: WebGLRenderingContext, program: WebGLProgram): void => {
    let shaders = gl.getAttachedShaders(program)

    gl.deleteProgram(program)
    var success = gl.getProgramParameter(program, gl.DELETE_STATUS)
    if (!success) {
      throw 'failed to delete program:' + gl.getProgramInfoLog(program)
    }

    if (shaders !== null) {
      for (let i = 0; i < shaders.length; i++) {
        let shader = shaders[i]
        if (shader !== undefined) {
          gl.deleteShader(shader)
          var success = gl.getShaderParameter(shader, gl.DELETE_STATUS)
          if (!success) {
            throw 'failed to delete shader' + gl.getShaderInfoLog(shader)
          }
        }
      }
    }
  }

  static resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = canvas.clientWidth
    const displayHeight = canvas.clientHeight

    // Check if the canvas is not the same size.
    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight

    if (needResize) {
      // Make the canvas the same size
      canvas.width = displayWidth
      canvas.height = displayHeight
    }

    return needResize
  }
}
