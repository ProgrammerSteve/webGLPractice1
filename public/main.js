const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");
if (!gl) throw new Error("WebGL not supported");
const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix;

//create vertex data
const vertexData = [0, 1, 0, 1, -1, 0, -1, -1, 0];
const colorData = [1, 0, 0, 0, 1, 0, 0, 0, 1];

//create buffers for GPU
const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();

// Load data into buffers
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

//Create a vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
  precision mediump float;

  attribute vec3 position;
  attribute vec3 color;
  varying vec3 vColor;

  uniform mat4 matrix;

  void main() {
    vColor=color;
    gl_Position= matrix * vec4(position,1);
  }
  `
);
gl.compileShader(vertexShader);
//Create a fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
  precision mediump float;

  varying vec3 vColor;

  void main(){
    gl_FragColor=vec4(vColor,1);
  }
  `
);
gl.compileShader(fragmentShader);
//Create a program
const program = gl.createProgram();
//attach two shaders to the program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
//enable vertex attributes we will use
const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

//Setting up uniform values
const uniformLocation = {
  matrix: gl.getUniformLocation(program, `matrix`),
};

//Applying animations
const matrix = mat4.create();
mat4.translate(matrix, matrix, [0.2, 0.5, 1]);
mat4.scale(matrix, matrix, [0.25, 0.25, 0.25]);
function animate() {
  requestAnimationFrame(animate);
  mat4.rotateZ(matrix, matrix, Math.PI / 2 / 70);
  gl.uniformMatrix4fv(uniformLocation.matrix, false, matrix);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

animate();
