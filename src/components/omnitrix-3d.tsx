"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

const CodeSymbol = ({
    color,
    opacity = 1,
    scale = 0.86,
    renderOrderBase = 8,
}: {
    color: string;
    opacity?: number;
    scale?: number;
    renderOrderBase?: number;
}) => {
    const material = new THREE.MeshBasicMaterial({
        color: color,
        toneMapped: false,
        transparent: true,
        opacity,
        depthTest: false,
        depthWrite: false,
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        toneMapped: false,
        transparent: true,
        opacity: opacity * 0.75,
        depthTest: false,
        depthWrite: false,
    });

    const createArm = (args: [number, number, number]) => (
        <group>
            <mesh material={material} renderOrder={renderOrderBase}>
                <boxGeometry args={args} />
            </mesh>
            <mesh material={wireMaterial} renderOrder={renderOrderBase + 1}>
                <boxGeometry args={[args[0] * 1.05, args[1] * 1.05, args[2] * 1.05]} />
            </mesh>
        </group>
    );

    const thickness = 0.1;
    const depth = 0.15;
    const armLength = 0.65;
    const slashLength = 1.6;

    const LeftBracket = () => (
        <group>
            <group rotation={[0, 0, Math.PI / 4]}>
                <group position={[armLength / 2 - 0.05, 0, 0]}>
                    {createArm([armLength, thickness, depth])}
                </group>
            </group>
            <group rotation={[0, 0, -Math.PI / 4]}>
                <group position={[armLength / 2 - 0.05, 0, 0]}>
                    {createArm([armLength, thickness, depth])}
                </group>
            </group>
        </group>
    );

    return (
        <group scale={scale} position={[0, 0, 0]}>
            {/* Slash \ */}
            <group rotation={[0, 0, Math.PI / 6]}>
                {createArm([thickness, slashLength, depth])}
            </group>

            {/* Left Bracket < */}
            <group position={[-1.2, 0, 0]}>
                <LeftBracket />
            </group>

            {/* Right Bracket > */}
            <group position={[1.2, 0, 0]} rotation={[0, 0, Math.PI]}>
                <LeftBracket />
            </group>
        </group>
    );
};

const OrbitingParticles = ({ color, count = 14 }: { color: string; count?: number }) => {
    const particleRefs = useRef<THREE.Mesh[]>([]);
    const particles = useMemo(
        () =>
            Array.from({ length: count }, (_, index) => ({
                radius: 1.0 + (index % 4) * 0.15,
                speed: 0.2 + (index % 5) * 0.035,
                offset: index * 0.7,
                height: (index % 6) * 0.11 - 0.28,
                size: 0.017 + (index % 3) * 0.008,
            })),
        [count],
    );

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        particles.forEach((particle, index) => {
            const ref = particleRefs.current[index];
            if (!ref) return;
            const angle = t * particle.speed + particle.offset;
            ref.position.x = Math.cos(angle) * particle.radius;
            ref.position.z = Math.sin(angle) * particle.radius;
            ref.position.y = particle.height + Math.sin(angle * 1.7) * 0.05;
        });
    });

    return (
        <group>
            {particles.map((particle, index) => (
                <mesh
                    key={index}
                    ref={(element) => {
                        if (element) particleRefs.current[index] = element;
                    }}
                >
                    <sphereGeometry args={[particle.size, 10, 10]} />
                    <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.35} />
                </mesh>
            ))}
        </group>
    );
};

const CyberGemModel = ({ color, particleCount = 14 }: { color: string; particleCount?: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const cubeRef = useRef<THREE.Group>(null);
    const shimmerRef = useRef<THREE.Mesh>(null);
    const coreGlowRef = useRef<THREE.Mesh>(null);
    const pulseRingRef = useRef<THREE.Mesh>(null);
    const pulseRingRef2 = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            const targetScale = hovered ? 1.1 : 1;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            groupRef.current.position.y = Math.sin(time * 2) * 0.1;
            groupRef.current.rotation.y = time * 0.14;
            groupRef.current.rotation.z = Math.sin(time * 0.4) * 0.03;
        }

        if (cubeRef.current) {
            cubeRef.current.rotation.x = -0.28 + Math.sin(time * 0.5) * 0.04;
            cubeRef.current.rotation.y = 0.45 - time * 0.12;
            cubeRef.current.rotation.z = Math.cos(time * 0.35) * 0.025;
        }

        if (shimmerRef.current) {
            shimmerRef.current.rotation.y = time * 0.45;
            shimmerRef.current.rotation.x = Math.sin(time * 0.8) * 0.2;
            const shimmerMaterial = shimmerRef.current.material as THREE.MeshBasicMaterial;
            shimmerMaterial.opacity = 0.08 + Math.sin(time * 1.5) * 0.02;
        }

        if (coreGlowRef.current) {
            const pulse = 1 + Math.sin(time * 2.2) * 0.08;
            coreGlowRef.current.scale.set(pulse, pulse, pulse);
            const glowMaterial = coreGlowRef.current.material as THREE.MeshBasicMaterial;
            glowMaterial.opacity = 0.18 + Math.sin(time * 2.2) * 0.05;
        }

        if (pulseRingRef.current) {
            const ringPulse = 1 + Math.sin(time * 1.8) * 0.06;
            pulseRingRef.current.scale.set(ringPulse, ringPulse, ringPulse);
            pulseRingRef.current.rotation.z = time * 0.5;
            const ringMaterial = pulseRingRef.current.material as THREE.MeshBasicMaterial;
            ringMaterial.opacity = 0.12 + Math.sin(time * 1.8) * 0.04;
        }

        if (pulseRingRef2.current) {
            const ringPulse2 = 1 + Math.cos(time * 1.55) * 0.08;
            pulseRingRef2.current.scale.set(ringPulse2, ringPulse2, ringPulse2);
            pulseRingRef2.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.7) * 0.14;
            const ringMaterial2 = pulseRingRef2.current.material as THREE.MeshBasicMaterial;
            ringMaterial2.opacity = 0.09 + Math.cos(time * 1.55) * 0.03;
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <group ref={cubeRef}>
                <mesh>
                    <boxGeometry args={[2.35, 2.35, 2.35]} />
                    <meshPhysicalMaterial
                        color="#dbeafe"
                        transparent
                        opacity={0.12}
                        roughness={0.24}
                        metalness={0}
                        transmission={0.92}
                        thickness={1.5}
                        ior={1.34}
                        clearcoat={1}
                        clearcoatRoughness={0.06}
                    />
                </mesh>

                <mesh>
                    <boxGeometry args={[2.2, 2.2, 2.2]} />
                    <meshPhysicalMaterial
                        color={color}
                        transparent
                        opacity={0.07}
                        roughness={0.18}
                        metalness={0}
                        transmission={0.88}
                        thickness={1.1}
                        ior={1.32}
                        clearcoat={1}
                        clearcoatRoughness={0.04}
                        emissive={color}
                        emissiveIntensity={0.08}
                    />
                </mesh>

                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(2.36, 2.36, 2.36)]} />
                    <lineBasicMaterial color={color} toneMapped={false} transparent opacity={0.34} />
                </lineSegments>

                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(2.22, 2.22, 2.22)]} />
                    <lineBasicMaterial color={color} toneMapped={false} transparent opacity={0.2} />
                </lineSegments>
            </group>

            <mesh ref={shimmerRef}>
                <ringGeometry args={[0.88, 1.12, 64]} />
                <meshBasicMaterial
                    color="#bfdbfe"
                    toneMapped={false}
                    transparent
                    opacity={0.08}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>

            <mesh ref={coreGlowRef}>
                <sphereGeometry args={[0.75, 36, 36]} />
                <meshBasicMaterial
                    color={color}
                    toneMapped={false}
                    transparent
                    opacity={0.18}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            <mesh ref={pulseRingRef} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.95, 0.035, 16, 96]} />
                <meshBasicMaterial
                    color={color}
                    toneMapped={false}
                    transparent
                    opacity={0.12}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            <mesh ref={pulseRingRef2} rotation={[0, 0, 0]}>
                <torusGeometry args={[1.05, 0.024, 16, 96]} />
                <meshBasicMaterial
                    color="#bfdbfe"
                    toneMapped={false}
                    transparent
                    opacity={0.09}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            <CodeSymbol color={color} scale={0.92} renderOrderBase={10} />

            <OrbitingParticles color={color} count={particleCount} />
        </group>
    );
};

interface Omnitrix3DProps {
    color?: string;
    className?: string;
}

export default function Omnitrix3D({ color = '#39ff14', className = '' }: Omnitrix3DProps) {
    const isMobile = useIsMobile();
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = () => setPrefersReducedMotion(mediaQuery.matches);
        onChange();
        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', onChange);
        } else {
            mediaQuery.addListener(onChange);
        }
        return () => {
            if (typeof mediaQuery.removeEventListener === 'function') {
                mediaQuery.removeEventListener('change', onChange);
            } else {
                mediaQuery.removeListener(onChange);
            }
        };
    }, []);

    const useLowPower = isMobile || prefersReducedMotion;

    return (
        <div className={`relative w-40 h-40 sm:w-48 sm:h-48 md:w-72 md:h-72 cursor-pointer touch-none scale-100 md:hover:scale-105 transition-transform duration-300 ${className}`}>
            <div
                className="pointer-events-none absolute inset-[12%] rounded-full blur-3xl"
                style={{ background: `radial-gradient(circle, ${color}2e 0%, ${color}14 52%, transparent 78%)` }}
            />
            <Canvas
                camera={{ position: [0, 0, 4.5], fov: 50 }}
                gl={{ alpha: true, antialias: !useLowPower, powerPreference: useLowPower ? 'low-power' : 'high-performance' }}
                dpr={useLowPower ? [1, 1.2] : [1, 2]}
                style={{ background: 'transparent' }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                }}
            >
                <ambientLight intensity={0.7} color="#cbd5e1" />
                <directionalLight position={[0, 4.5, 1.2]} intensity={1.25} color="#dbeafe" />
                <pointLight position={[3.8, 2.4, 3.2]} intensity={0.75} color="#bfdbfe" />
                <pointLight position={[-4, -1, -3]} intensity={0.45} color={color} />

                <CyberGemModel color={color} particleCount={useLowPower ? 8 : 14} />

                {!useLowPower && (
                    <EffectComposer>
                        <Bloom
                            luminanceThreshold={0.18}
                            luminanceSmoothing={0.5}
                            height={300}
                            opacity={1}
                            intensity={1.6}
                        />
                    </EffectComposer>
                )}
            </Canvas>
        </div>
    );
}
