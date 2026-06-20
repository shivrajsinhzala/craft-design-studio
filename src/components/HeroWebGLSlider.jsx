import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 v_uv;
  void main() {
    v_uv = position * 0.5 + 0.5;
    v_uv.y = 1.0 - v_uv.y; // Flip Y for standard image coordinates
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_texture1;
  uniform sampler2D u_texture2;
  uniform float u_progress;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_img_resolution;

  // Simple procedural noise for displacement
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    vec2 u = fp*fp*(3.0-2.0*fp);
    return mix(
      mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
      mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x),
      u.y
    );
  }

  void main() {
    // cover aspect ratio calculation
    float screenRatio = u_resolution.x / u_resolution.y;
    float imgRatio = u_img_resolution.x / u_img_resolution.y;
    vec2 ratio = vec2(
      min(screenRatio / imgRatio, 1.0),
      min(imgRatio / screenRatio, 1.0)
    );
    vec2 uv = vec2(
      v_uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      v_uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // Liquid displacement strength peaks at progress 0.5
    float strength = sin(u_progress * 3.14159265);
    float displacement = noise(uv * 8.0 + u_time * 0.04) * 0.12 * strength;

    // Displacement offset for both textures
    vec2 uv1 = vec2(uv.x + u_progress * displacement, uv.y + u_progress * displacement);
    vec2 uv2 = vec2(uv.x - (1.0 - u_progress) * displacement, uv.y - (1.0 - u_progress) * displacement);

    vec4 color1 = texture2D(u_texture1, uv1);
    vec4 color2 = texture2D(u_texture2, uv2);

    gl_FragColor = mix(color1, color2, u_progress);
  }
`;

export default function HeroWebGLSlider({ images, activeIndex }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const texturesRef = useRef([]);
  const prevIndexRef = useRef(activeIndex);
  
  // Transition state
  const transitionRef = useRef({ progress: 0 });
  const timeRef = useRef(0);
  const animationFrameRef = useRef(null);
  
  // Uniform locations
  const uniformsRef = useRef({});

  // Helper to compile shader
  const compileShader = (gl, source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  // Helper to create texture from image
  const createTexture = (gl, image) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Set parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    // Upload image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    return texture;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // Create program
    const vs = compileShader(gl, VERTEX_SHADER, gl.VERTEX_SHADER);
    const fs = compileShader(gl, FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;
    gl.useProgram(program);

    // Setup geometry (quad covering canvas)
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Cache uniform locations
    uniformsRef.current = {
      progress: gl.getUniformLocation(program, 'u_progress'),
      time: gl.getUniformLocation(program, 'u_time'),
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      imgResolution: gl.getUniformLocation(program, 'u_img_resolution'),
      texture1: gl.getUniformLocation(program, 'u_texture1'),
      texture2: gl.getUniformLocation(program, 'u_texture2'),
    };

    // Load all images as textures
    const loadedTextures = [];
    let loadedCount = 0;

    images.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const texture = createTexture(gl, img);
        loadedTextures[idx] = {
          texture,
          width: img.naturalWidth || 960,
          height: img.naturalHeight || 720,
        };
        loadedCount++;

        // Start render loop once first image is loaded
        if (idx === activeIndex && loadedTextures[idx]) {
          triggerRenderLoop();
        }
      };
    });

    texturesRef.current = loadedTextures;

    // Handle canvas sizing
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Render loop
    const triggerRenderLoop = () => {
      const render = () => {
        if (!glRef.current || !programRef.current) return;
        
        timeRef.current += 0.5; // Update time for noise wave animation
        resizeCanvas();

        const activeTexData = texturesRef.current[activeIndex];
        const prevTexData = texturesRef.current[prevIndexRef.current] || activeTexData;

        if (activeTexData && prevTexData) {
          // Bind textures
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, prevTexData.texture);
          gl.uniform1i(uniformsRef.current.texture1, 0);

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, activeTexData.texture);
          gl.uniform1i(uniformsRef.current.texture2, 1);

          // Pass uniforms
          gl.uniform1f(uniformsRef.current.progress, transitionRef.current.progress);
          gl.uniform1f(uniformsRef.current.time, timeRef.current);
          gl.uniform2f(uniformsRef.current.resolution, canvas.width, canvas.height);
          
          // Image resolution uniform (using target resolution)
          gl.uniform2f(uniformsRef.current.imgResolution, activeTexData.width, activeTexData.height);

          // Draw quad
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        animationFrameRef.current = requestAnimationFrame(render);
      };
      
      if (!animationFrameRef.current) {
        render();
      }
    };

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      
      // Delete WebGL objects
      if (glRef.current) {
        texturesRef.current.forEach((t) => {
          if (t && t.texture) glRef.current.deleteTexture(t.texture);
        });
        if (programRef.current) glRef.current.deleteProgram(programRef.current);
      }
    };
  }, [images]);

  // Handle activeIndex changes to trigger transition
  useEffect(() => {
    if (activeIndex === prevIndexRef.current) return;

    // Animate progress uniform from 0 to 1
    gsap.killTweensOf(transitionRef.current);
    transitionRef.current.progress = 0;

    gsap.to(transitionRef.current, {
      progress: 1,
      duration: 1.4,
      ease: 'power3.out',
      onComplete: () => {
        prevIndexRef.current = activeIndex;
        transitionRef.current.progress = 0; // Reset progress for the next transition
      },
    });
  }, [activeIndex]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
