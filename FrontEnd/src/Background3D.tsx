import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;

  varying float vFade;
  varying float vH;

  float height(vec2 p) {
    float bowl = smoothstep(12.0, 75.0, abs(p.x)) * 16.0;

    float w =
      sin(p.x * 0.12 + uTime * 0.55) * 2.2 +
      sin((p.y + uScroll) * 0.15 - uTime * 0.45) * 1.7 +
      sin((p.x + p.y + uScroll) * 0.07 + uTime * 0.35) * 2.8;

    return w + bowl;
  }

  void main() {
    vec3 pos = position;

    pos.y = height(pos.xz);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    vFade = 1.0 - smoothstep(35.0, 130.0, -mv.z);
    vH = pos.y;

    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  varying float vFade;
  varying float vH;

  void main() {
    float hi = smoothstep(0.0, 16.0, vH);

    vec3 low = vec3(0.38, 0.18, 0.68);
    vec3 high = vec3(0.82, 0.68, 1.0);

    vec3 col = mix(low, high, hi);

    float alpha = vFade * (0.08 + 0.58 * hi);

    gl_FragColor = vec4(col, alpha);
  }
`

type Node = {
  p: THREE.Vector3
  v: THREE.Vector3
}

export default function Background3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current

    if (!mount) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.5),
    )

    renderer.setSize(
      window.innerWidth,
      window.innerHeight,
    )

    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      300,
    )

    camera.position.set(0, 7, 38)
    camera.lookAt(0, 6, -40)

    /*
     * =====================================================
     * 3D DALGA / GRID
     * =====================================================
     */

    const SEG = 110
    const SIZE_X = 180
    const Z_NEAR = 45
    const Z_FAR = -140

    const points: number[] = []

    const px = (i: number) =>
      -SIZE_X / 2 + (i / SEG) * SIZE_X

    const pz = (j: number) =>
      Z_NEAR +
      (j / SEG) * (Z_FAR - Z_NEAR)

    for (let j = 0; j <= SEG; j++) {
      for (let i = 0; i < SEG; i++) {
        points.push(
          px(i),
          0,
          pz(j),

          px(i + 1),
          0,
          pz(j),
        )
      }
    }

    for (let i = 0; i <= SEG; i += 2) {
      for (let j = 0; j < SEG; j++) {
        points.push(
          px(i),
          0,
          pz(j),

          px(i),
          0,
          pz(j + 1),
        )
      }
    }

    const terrainGeometry =
      new THREE.BufferGeometry()

    terrainGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        points,
        3,
      ),
    )

    const terrainMaterial =
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,

        uniforms: {
          uTime: {
            value: 0,
          },

          uScroll: {
            value: 0,
          },
        },

        transparent: true,
        depthWrite: false,

        blending:
          THREE.AdditiveBlending,
      })

    const terrain =
      new THREE.LineSegments(
        terrainGeometry,
        terrainMaterial,
      )

    terrain.frustumCulled = false

    scene.add(terrain)

    /*
     * =====================================================
     * PARLAYAN NOKTALAR
     * =====================================================
     */

    const N = 70
    const LINK_DISTANCE = 16
    const MAX_SEGMENTS = 500

    const nodes: Node[] =
      Array.from(
        { length: N },
        () => ({
          p: new THREE.Vector3(
            (Math.random() - 0.5) * 90,
            10 + Math.random() * 25,
            -60 + Math.random() * 70,
          ),

          v: new THREE.Vector3(
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.03,
            (Math.random() - 0.5) * 0.04,
          ),
        }),
      )

    const dotGeometry =
      new THREE.BufferGeometry()

    const dotPositions =
      new Float32Array(N * 3)

    dotGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        dotPositions,
        3,
      ),
    )

    const dots =
      new THREE.Points(
        dotGeometry,

        new THREE.PointsMaterial({
          color: 0xe9ddff,
          size: 0.45,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.8,
        }),
      )

    const linkGeometry =
      new THREE.BufferGeometry()

    const linkPositions =
      new Float32Array(
        MAX_SEGMENTS * 6,
      )

    linkGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        linkPositions,
        3,
      ),
    )

    const links =
      new THREE.LineSegments(
        linkGeometry,

        new THREE.LineBasicMaterial({
          color: 0xc4a1ff,
          transparent: true,
          opacity: 0.22,
        }),
      )

    dots.frustumCulled = false
    links.frustumCulled = false

    scene.add(dots, links)

    /*
     * =====================================================
     * NOKTALARI HAREKET ETTİR
     * =====================================================
     */

    const updateNodes = () => {
      let segmentCount = 0

      nodes.forEach((node, index) => {
        node.p.add(node.v)

        if (
          node.p.x < -45 ||
          node.p.x > 45
        ) {
          node.v.x *= -1
        }

        if (
          node.p.y < 8 ||
          node.p.y > 36
        ) {
          node.v.y *= -1
        }

        if (
          node.p.z < -70 ||
          node.p.z > 10
        ) {
          node.v.z *= -1
        }

        dotPositions.set(
          [
            node.p.x,
            node.p.y,
            node.p.z,
          ],
          index * 3,
        )
      })

      for (
        let i = 0;
        i < N &&
        segmentCount < MAX_SEGMENTS;
        i++
      ) {
        for (
          let j = i + 1;
          j < N &&
          segmentCount < MAX_SEGMENTS;
          j++
        ) {
          if (
            nodes[i].p.distanceTo(
              nodes[j].p,
            ) < LINK_DISTANCE
          ) {
            linkPositions.set(
              [
                ...nodes[i].p.toArray(),
                ...nodes[j].p.toArray(),
              ],
              segmentCount * 6,
            )

            segmentCount++
          }
        }
      }

      linkGeometry.setDrawRange(
        0,
        segmentCount * 2,
      )

      dotGeometry.attributes.position.needsUpdate =
        true

      linkGeometry.attributes.position.needsUpdate =
        true
    }

    /*
     * =====================================================
     * MOUSE + SCROLL
     * =====================================================
     */

    let mouseX = 0

    let scrollY =
      window.scrollY

    let smoothScroll =
      scrollY

    const handleMouseMove = (
      event: MouseEvent,
    ) => {
      mouseX =
        (event.clientX /
          window.innerWidth -
          0.5) *
        2
    }

    const handleScroll = () => {
      scrollY =
        window.scrollY
    }

    const handleResize = () => {
      renderer.setSize(
        window.innerWidth,
        window.innerHeight,
      )

      camera.aspect =
        window.innerWidth /
        window.innerHeight

      camera.updateProjectionMatrix()
    }

    window.addEventListener(
      'mousemove',
      handleMouseMove,
    )

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true },
    )

    window.addEventListener(
      'resize',
      handleResize,
    )

    /*
     * =====================================================
     * ANİMASYON
     * =====================================================
     */

    let animationFrame = 0

    const animate = () => {
      const time =
        performance.now() / 1000

      smoothScroll +=
        (scrollY -
          smoothScroll) *
        0.06

      terrainMaterial.uniforms.uTime.value =
        reduceMotion
          ? 0
          : time

      terrainMaterial.uniforms.uScroll.value =
        smoothScroll * 0.05

      camera.position.x +=
        (
          mouseX * 5 -
          camera.position.x
        ) * 0.03

      camera.position.y =
        7 +
        Math.min(
          smoothScroll * 0.002,
          3,
        )

      camera.lookAt(
        0,
        6,
        -40,
      )

      if (!reduceMotion) {
        updateNodes()
      }

      renderer.render(
        scene,
        camera,
      )

      animationFrame =
        requestAnimationFrame(
          animate,
        )
    }

    animate()

    /*
     * =====================================================
     * TEMİZLEME
     * =====================================================
     */

    return () => {
      cancelAnimationFrame(
        animationFrame,
      )

      window.removeEventListener(
        'mousemove',
        handleMouseMove,
      )

      window.removeEventListener(
        'scroll',
        handleScroll,
      )

      window.removeEventListener(
        'resize',
        handleResize,
      )

      terrainGeometry.dispose()
      terrainMaterial.dispose()

      dotGeometry.dispose()
      linkGeometry.dispose()

      renderer.dispose()

      if (
        mount.contains(
          renderer.domElement,
        )
      ) {
        mount.removeChild(
          renderer.domElement,
        )
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',

        background: `
          radial-gradient(
            ellipse at 50% 35%,
            rgba(74, 35, 148, 0.42) 0%,
            rgba(30, 12, 60, 0.9) 48%,
            #09040f 100%
          )
        `,
      }}
    />
  )
}