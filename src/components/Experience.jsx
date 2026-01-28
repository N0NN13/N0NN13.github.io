import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';

function GlossyHeart() {
    const meshRef = useRef();
    const { viewport } = useThree();

    // 1. Define Shape
    const heartShape = useMemo(() => {
        const s = new THREE.Shape();
        const x = 0, y = 0;
        s.moveTo(x + 5, y + 5);
        s.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        s.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        s.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        s.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        s.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        s.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
        return s;
    }, []);

    // 2. Extrude Settings
    const extrudeSettings = useMemo(() => ({
        steps: 2,
        depth: 4,
        bevelEnabled: true,
        bevelThickness: 1.5,
        bevelSize: 1.5,
        bevelSegments: 24
    }), []);

    // 3. Calculate Geometry Height to Normalize Scale
    // A raw heart defined above is roughly 20 units tall (from y=0 to y=19 + bevels).
    // We want it to fit within the viewport HEIGHT with padding.
    // Let's force fit it to 60% of the viewport height.
    // Scale = (Target Height / Actual Height)

    // Approximate height of this bezier shape is ~20 units.
    const GEOMETRY_HEIGHT = 22; // 19 + bevel padding

    // We want the heart to be 60% of the screen height/width (whichever is smaller to fit)
    const targetSize = Math.min(viewport.width, viewport.height) * 0.6;

    const scale = targetSize / GEOMETRY_HEIGHT;

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
        meshRef.current.position.y = Math.sin(time) * 0.2;
    });

    return (
        <Center>
            {/* Rotate PI to point up, as per user requirement (Coordinates were inverted relative to screen y-up) */}
            <mesh ref={meshRef} rotation={[0, 0, Math.PI]} scale={scale}>
                <extrudeGeometry args={[heartShape, extrudeSettings]} />
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={5}
                    thickness={2}
                    roughness={0}
                    chromaticAberration={0.5}
                    anisotropy={20}
                    color="#ff0a54"
                    background="#000"
                />
            </mesh>
        </Center>
    );
}

export default function Experience() {
    return (
        <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <color attach="background" args={['#000']} />

                {/* Main Key Light */}
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ff0a54" />

                {/* Fill Light (Top Left) */}
                <pointLight position={[-10, 5, 10]} intensity={0.5} color="#white" />

                {/* RIM LIGHT (Bottom - Crucial for visibility) */}
                <pointLight position={[0, -10, 5]} intensity={2} color="#ff477e" distance={20} />

                {/* Back Light (Silhouette) */}
                <spotLight position={[0, 0, -5]} intensity={1} color="#ff0055" lookAt={[0, 0, 0]} />

                {/* Moved down to avoid overlapping with text */}
                <group position={[0, -1.5, 0]}>
                    <GlossyHeart />
                </group>

                <Sparkles count={100} scale={20} size={3} speed={0.4} opacity={0.5} color="#ff477e" />
                {/* City preset adds more complex reflections than 'night', helping the glass definition */}
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
