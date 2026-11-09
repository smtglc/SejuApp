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
      sin(p.x * 0.12 + uTime * 0.5) * 2.0 +
      sin((p.y + uScroll) * 0.15 - uTime * 0.4) * 1.6 +
      sin((p.x + p.y + uScroll) * 0.07 + uTime * 0.3) * 2.5;
    return w + bowl;
  }

  void main() {
    vec3 pos = position;
    pos.y = height(pos.xz);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vFade = 1.0 - smoothstep(30.0, 120.0, -mv.z);
    vH = pos.y;
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  varying float vFade;
  varying float vH;
  void main() {
    float hi = smoothstep(0.0, 16.0, vH);
    vec3 col = mix(vec3(0.18, 0.55, 0.42), vec3(0.37, 0.96, 0.83), hi);
    gl_FragColor = vec4(col, vFade * (0.12 + 0.55 * hi));
  }
`

type Node = { p: THREE.Vector3; v: THREE.Vector3 }

export default function Background3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300)
    camera.position.set(0, 7, 38)
    camera.lookAt(0, 6, -40)

    // Arazi
    const SEG = 110, SIZE_X = 180, Z_NEAR = 45, Z_FAR = -140
    const pts: number[] = []
    const px = (i: number) => -SIZE_X / 2 + (i / SEG) * SIZE_X
    const pz = (j: number) => Z_NEAR + (j / SEG) * (Z_FAR - Z_NEAR)
    for (let j = 0; j <= SEG; j++)
      for (let i = 0; i < SEG; i++) pts.push(px(i), 0, pz(j), px(i + 1), 0, pz(j))
    for (let i = 0; i <= SEG; i += 2)
      for (let j = 0; j < SEG; j++) pts.push(px(i), 0, pz(j), px(i), 0, pz(j + 1))

    const terrainGeo = new THREE.BufferGeometry()
    terrainGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    const terrainMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { uTime: { value: 0 }, uScroll: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const terrain = new THREE.LineSegments(terrainGeo, terrainMat)
    terrain.frustumCulled = false
    scene.add(terrain)

    // Noktalar ve bağlantı çizgileri
    const N = 70, LINK = 16, MAX_SEG = 500
    const nodes: Node[] = Array.from({ length: N }, () => ({
      p: new THREE.Vector3((Math.random() - 0.5) * 90, 10 + Math.random() * 25, -60 + Math.random() * 70),
      v: new THREE.Vector3((Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.04),
    }))
    const dotGeo = new THREE.BufferGeometry()
    const dotPos = new Float32Array(N * 3)
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3))
    const dots = new THREE.Points(
      dotGeo,
      new THREE.PointsMaterial({ color: 0xd9fff5, size: 0.5, sizeAttenuation: true, transparent: true, opacity: 0.9 }),
    )
    const linkGeo = new THREE.BufferGeometry()
    const linkPos = new Float32Array(MAX_SEG * 6)
    linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3))
    const links = new THREE.LineSegments(
      linkGeo,
      new THREE.LineBasicMaterial({ color: 0xc8fff0, transparent: true, opacity: 0.35 }),
    )
    dots.frustumCulled = false
    links.frustumCulled = false
    scene.add(dots, links)

    const updateNodes = () => {
      let s = 0
      nodes.forEach((n, i) => {
        n.p.add(n.v)
        if (n.p.x < -45 || n.p.x > 45) n.v.x *= -1
        if (n.p.y < 8 || n.p.y > 36) n.v.y *= -1
        if (n.p.z < -70 || n.p.z > 10) n.v.z *= -1
        dotPos.set([n.p.x, n.p.y, n.p.z], i * 3)
      })
      for (let i = 0; i < N && s < MAX_SEG; i++)
        for (let j = i + 1; j < N && s < MAX_SEG; j++)
          if (nodes[i].p.distanceTo(nodes[j].p) < LINK) {
            linkPos.set([...nodes[i].p.toArray(), ...nodes[j].p.toArray()], s * 6)
            s++
          }
      linkGeo.setDrawRange(0, s * 2)
      dotGeo.attributes.position.needsUpdate = true
      linkGeo.attributes.position.needsUpdate = true
    }

    // Fare ve scroll
    let mx = 0
    let scrollY = window.scrollY
    let smoothScroll = scrollY
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
    }
    const onScroll = () => {
      scrollY = window.scrollY
    }
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    let raf = 0
    const frame = () => {
      const t = performance.now() / 1000
      smoothScroll += (scrollY - smoothScroll) * 0.06
      terrainMat.uniforms.uTime.value = reduce ? 0 : t
      terrainMat.uniforms.uScroll.value = smoothScroll * 0.05
      camera.position.x += (mx * 5 - camera.position.x) * 0.03
      camera.position.y = 7 + Math.min(smoothScroll * 0.002, 3)
      camera.lookAt(0, 6, -40)
      if (!reduce) updateNodes()
      renderer.render(scene, camera)
      if (!reduce) raf = requestAnimationFrame(frame)
    }
    frame()
    if (!reduce) raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      terrainGeo.dispose()
      terrainMat.dispose()
      dotGeo.dispose()
      linkGeo.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
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
        background: 'radial-gradient(ellipse at 50% 30%, #14241f 0%, #0b1210 70%)',
      }}
    />
  )
}
