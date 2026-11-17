import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Sparkles, useCursor, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// ===== BOYUT AYARLARI =====
// Kavanoz büyük görünüyorsa TARGET_HEIGHT'i küçült, küçükse büyüt.
// (Kutunun yüksekliği JarScreen.css içinde .jr-canvas { height })
const TARGET_HEIGHT = 1.8
const CAMERA_DISTANCE = 16 // büyüdükçe kavanoz küçülür ve perspektif azalır
const CAMERA_FOV = 26
const SHAKE_SECONDS = 0.6

interface Props {
  shakeKey: number // her artışta kavanoz titrer
  onJarClick: () => void
  onHoverChange: (hovered: boolean) => void
}


// ===== EFEKT AYARLARI =====
const RING_RADIUS = 2.35 // dönen ışık halkasının yarıçapı
const RING_Y = 0.7 // halkanın yüksekliği (kavanozun alt-orta kısmı)
const DOT_COUNT = 10 // halkada dönen parlak nokta sayısı

// Kavanozun etrafında dönen ışık halkası ve üzerinde dolaşan pırıltılar
function OrbitRing({ boostKey }: { boostKey: number }) {
  const dots = useRef<(THREE.Group | null)[]>([])
  const ringMat = useRef<THREE.MeshBasicMaterial>(null)
  const angle = useRef(0)
  const boost = useRef(0)

  // Kavanoza tıklanınca halka bir süre hızlanır ve parlar
  useEffect(() => {
    if (boostKey > 0) boost.current = 1
  }, [boostKey])

  useFrame((state, delta) => {
    boost.current = Math.max(0, boost.current - delta * 0.9)
    angle.current += delta * (0.35 + boost.current * 2.2)
    const t = state.clock.elapsedTime

    dots.current.forEach((d, i) => {
      if (!d) return
      const a = angle.current + (i / DOT_COUNT) * Math.PI * 2
      d.position.set(Math.cos(a) * RING_RADIUS, Math.sin(a) * RING_RADIUS, 0)
      d.scale.setScalar(0.7 + 0.5 * Math.abs(Math.sin(t * 2 + i * 1.7)) + boost.current * 0.6)
    })
    if (ringMat.current) ringMat.current.opacity = 0.45 + boost.current * 0.4
  })

  return (
    <group position={[0, RING_Y, 0]} rotation={[Math.PI / 2 - 0.22, 0, 0.1]}>
      <mesh renderOrder={10}>
        <torusGeometry args={[RING_RADIUS, 0.012, 8, 160]} />
        <meshBasicMaterial
          ref={ringMat}
          color="#efdcff"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh renderOrder={10}>
        <torusGeometry args={[RING_RADIUS, 0.06, 8, 160]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.13}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <group
          key={i}
          ref={(el) => {
            dots.current[i] = el
          }}
        >
          <mesh renderOrder={11}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <mesh renderOrder={11}>
            <sphereGeometry args={[0.17, 12, 12]} />
            <meshBasicMaterial
              color="#c084fc"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Kavanozun içindeki kartları mor ışıkla nefes alır gibi aydınlatır
function InnerGlow() {
  const light = useRef<THREE.PointLight>(null)
  useFrame((state) => {
    if (light.current) light.current.intensity = 14 + Math.sin(state.clock.elapsedTime * 2) * 5
  })
  return <pointLight ref={light} position={[0, -0.7, 0.9]} color="#b366ff" distance={7} decay={2} />
}

// Kamerayı kesin olarak bu değerlere sabitler
function CameraRig() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera
  useLayoutEffect(() => {
    camera.position.set(0, 0, CAMERA_DISTANCE)
    camera.fov = CAMERA_FOV
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera])
  return null
}

function JarModel({ shakeKey, onJarClick, onHoverChange }: Props) {
  const { scene } = useGLTF('/jar.glb')
  const model = useMemo(() => scene.clone(true), [scene])
  const group = useRef<THREE.Group>(null)
  const shakeTime = useRef(SHAKE_SECONDS) // SHAKE_SECONDS = titreme yok
  const [hovered, setHovered] = useState(false)
  useCursor(hovered) // imleç kavanozun üstünde "el" olur

  const reduceMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // Modeli ortala ve sabit yüksekliğe ölçekle (glb'nin boyutu ne olursa olsun)
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s = TARGET_HEIGHT / size.y
    return { scale: s, offset: center.multiplyScalar(-s) }
  }, [model])

  useEffect(() => {
    if (shakeKey > 0 && !reduceMotion) shakeTime.current = 0
  }, [shakeKey, reduceMotion])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    let rotZ = 0
    let shiftX = 0
    if (shakeTime.current < SHAKE_SECONDS) {
      shakeTime.current += delta
      const t = shakeTime.current
      const fade = Math.exp(-t * 3.5) // titreme zamanla sönümlenir
      rotZ = Math.sin(t * 46) * 0.13 * fade
      shiftX = Math.sin(t * 46 + 1.2) * 0.07 * fade
    }

    g.rotation.z = rotZ
    g.position.x = shiftX
    g.position.y = reduceMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.5) * 0.06

    // Üzerine gelince hafifçe büyür
    const target = hovered ? 1.05 : 1
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, 0.15))
  })

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHoverChange(true)
      }}
      onPointerOut={() => {
        setHovered(false)
        onHoverChange(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onJarClick()
      }}
    >
      <primitive object={model} scale={scale} position={offset} />
    </group>
  )
}

useGLTF.preload('/jar.glb')

export default function Jar3D(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, CAMERA_DISTANCE], fov: CAMERA_FOV }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <CameraRig />
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 6, 8]} intensity={2.5} />
      <pointLight position={[-4, 2, 5]} intensity={3} color="#c4a1ff" />
      <pointLight position={[4, 2, 5]} intensity={1.5} color="#ffffff" />
      <Environment preset="studio" />

      <InnerGlow />

      <Suspense fallback={null}>
        <JarModel {...props} />
      </Suspense>

      <OrbitRing boostKey={props.shakeKey} />

      {/* Süzülen pırıltılar: beyaz-lila ve altın */}
      <Sparkles count={40} scale={[6, 6, 3]} size={5} speed={0.35} opacity={0.9} color="#f3e8ff" />
      <Sparkles count={14} scale={[5.5, 5.5, 3]} size={9} speed={0.5} color="#f5c16c" />
    </Canvas>
  )
}
