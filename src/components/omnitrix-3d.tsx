"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const CodeSymbol = ({ color }: { color: string }) => {
    const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.9,
    });

    // Bypasses tone mapping for intense bloom
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        toneMapped: false,
    });

    const createArm = (args: [number, number, number]) => (
        <group>
            <mesh material={material}>
                <boxGeometry args={args} />
            </mesh>
            <mesh material={wireMaterial}>
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
        <group scale={0.7} position={[0, 0, 0]}>
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

const CyberGemModel = ({ color }: { color: string }) => {
    const groupRef = useRef<THREE.Group>(null);
    const ringRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Animation loop
    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            // Smooth scaling for hover interactivity
            const targetScale = hovered ? 1.1 : 1;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            // Gentle floating animation
            groupRef.current.position.y = Math.sin(time * 2) * 0.1;

            // Rotate the entire gem structure slowly
            groupRef.current.rotation.y = time * 0.2;
            groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
        }

        if (ringRef.current) {
            // Counter-rotate the inner rings
            ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time) * 0.1;
            ringRef.current.rotation.y = Math.cos(time) * 0.1;
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Inner Glowing Code Symbol < \ > */}
            <CodeSymbol color={color} />
        </group>
    );
};

interface Omnitrix3DProps {
    color?: string;
}

export default function Omnitrix3D({ color = '#39ff14' }: Omnitrix3DProps) {
    return (
        <div className="w-56 h-56 md:w-72 md:h-72 cursor-pointer touch-none scale-100 hover:scale-105 transition-transform duration-300">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
                <ambientLight intensity={1.5} color="#ffffff" />
                <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
                <pointLight position={[-10, 5, -10]} intensity={1} color="#39ff14" /> {/* Subtle green backlighting */}

                <CyberGemModel color={color} />

                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0}
                        luminanceSmoothing={0.9}
                        height={300}
                        opacity={1.5}
                        intensity={2.0} // Control the intensity of the neon glow
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
