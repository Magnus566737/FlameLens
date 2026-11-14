import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// NASA Blue Marble textures, same source the design reference uses (three-globe examples).
const TX = 'https://unpkg.com/three-globe/example/img/'

type Props = { className?: string; style?: React.CSSProperties }

export default function Earth3D({ className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current!
    const mobile = window.innerWidth < 880
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    host.appendChild(renderer.domElement)
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
    camera.position.set(0, 0, 4.2)

    // stars
    const N = mobile ? 1200 : 2600
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u)
      const r = 60 + Math.random() * 80
      pos.set([r * s * Math.cos(th), r * u, r * s * Math.sin(th) - 20], i * 3)
    }
    const sg = new THREE.BufferGeometry()
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xcfd8ff, size: 0.35, sizeAttenuation: true, transparent: true, opacity: 0.8 }))
    scene.add(stars)

    // earth
    const group = new THREE.Group()
    scene.add(group)
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    const day = loader.load(TX + 'earth-blue-marble.jpg')
    day.colorSpace = THREE.SRGBColorSpace
    const night = loader.load(TX + 'earth-night.jpg')
    night.colorSpace = THREE.SRGBColorSpace
    const bump = loader.load(TX + 'earth-topology.png')
    const seg = mobile ? 64 : 128
    const sun = new THREE.Vector3(-0.95, 0.28, 0.42).normalize()

    const earthMat = new THREE.ShaderMaterial({
      uniforms: { uDay: { value: day }, uNight: { value: night }, uSun: { value: sun } },
      vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal);
          vec4 wp=modelMatrix*vec4(position,1.0); vV=normalize(cameraPosition-wp.xyz);
          gl_Position=projectionMatrix*viewMatrix*wp; }`,
      fragmentShader: `uniform sampler2D uDay; uniform sampler2D uNight; uniform vec3 uSun;
        varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main(){
          vec3 n=normalize(vN); float d=dot(n,uSun);
          float lit=smoothstep(-0.1,0.3,d);
          vec3 dayC=texture2D(uDay,vUv).rgb*(0.04+1.25*max(d,0.0)*lit);
          vec3 nightC=pow(texture2D(uNight,vUv).rgb,vec3(1.35))*vec3(1.0,0.72,0.42)*1.6*smoothstep(0.08,-0.3,d);
          float fr=pow(1.0-max(dot(n,normalize(vV)),0.0),3.0);
          vec3 col=dayC+nightC;
          col=mix(col,vec3(0.35,0.62,1.0)*(0.15+0.85*lit),fr*0.55);
          gl_FragColor=vec4(col,1.0); }`,
    })
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, seg, seg), earthMat)
    group.add(earth)
    void bump

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.14, 64, 64),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
        fragmentShader: `varying vec3 vN; varying vec3 vV;
          void main(){ float f=pow(smoothstep(0.0,0.55,dot(-vN,vV)),2.2); gl_FragColor=vec4(vec3(0.25,0.55,1.0)*f*0.9,1.0); }`,
      }),
    )
    group.add(glow)

    // ISS-inclination orbit (51.6 deg) with a moving marker
    const orbit = new THREE.Group()
    orbit.rotation.x = (51.6 * Math.PI) / 180
    group.add(orbit)
    const R = 1.12
    const ring = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 200 }, (_, i) => {
        const t = (i / 200) * Math.PI * 2
        return new THREE.Vector3(Math.cos(t) * R, 0, Math.sin(t) * R)
      }),
    )
    orbit.add(new THREE.LineLoop(ring, new THREE.LineBasicMaterial({ color: 0xff7138, transparent: true, opacity: 0.4 })))
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffd2a8 }))
    orbit.add(marker)

    const resize = () => {
      const w = host.clientWidth || 1, h = host.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const clock = new THREE.Clock()
    const tick = () => {
      const dt = clock.getDelta(), t = clock.elapsedTime
      if (!reduce) {
        earth.rotation.y += dt * 0.05
        stars.rotation.y += dt * 0.004
      }
      const a = t * 0.5
      marker.position.set(Math.cos(a) * R, 0, Math.sin(a) * R)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.dispose()
      sg.dispose()
      earth.geometry.dispose()
      earthMat.dispose()
      day.dispose(); night.dispose(); bump.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={ref} className={className} style={style} />
}
