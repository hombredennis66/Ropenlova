import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

function Particles({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const count = 1400;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x = scroll.current * 0.6;
    ref.current.position.z = -2 + scroll.current * 6;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#5ae14c" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function Shards({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 7 }, () => ({
        pos: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6] as [
          number,
          number,
          number,
        ],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        scale: 0.5 + Math.random() * 0.9,
      })),
    [],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.children.forEach((c, i) => {
      c.rotation.x += delta * (0.1 + i * 0.02);
      c.rotation.y += delta * 0.15;
    });
    group.current.rotation.z = scroll.current * 0.4;
    group.current.position.y = scroll.current * 4;
  });

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color={i % 2 ? "#ffffff" : "#0e1311"}
            metalness={0.4}
            roughness={0.25}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const progress = useScrollProgress();
  const scroll = useRef(0);
  scroll.current = progress;

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.8]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} />
      <pointLight position={[-5, -3, 4]} intensity={0.6} color="#5ae14c" />
      <Suspense fallback={null}>
        <Particles scroll={scroll} />
        <Shards scroll={scroll} />
      </Suspense>
    </Canvas>
  );
}

export default function DepthScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="fixed inset-0 -z-10 bg-lightgray">
      <Scene />
    </div>
  );
}
