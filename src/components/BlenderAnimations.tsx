import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useI18n } from '../i18n';

interface BlenderAnimationProps {
    students: string[];
    onComplete: () => void;
}

interface CardSeed {
    name: string;
    angleOffset: number;
    radius: number;
    heightOffset: number;
    speed: number;
    color: string;
    startY: number;
}

const CARD_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

function StudentCardMesh({
    seed,
    elapsedRef,
}: {
    seed: CardSeed;
    elapsedRef: React.MutableRefObject<number>;
}) {
    const meshRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!meshRef.current) return;
        const t = elapsedRef.current;

        // Phase 1 (0.0s - 0.65s): Cards drop from above into the blender pitcher
        if (t < 0.65) {
            const dropProgress = Math.min(1, t / 0.65);
            const easeIn = dropProgress * dropProgress;
            meshRef.current.position.set(
                Math.cos(seed.angleOffset) * (seed.radius * 0.6),
                THREE.MathUtils.lerp(seed.startY, seed.heightOffset, easeIn),
                Math.sin(seed.angleOffset) * (seed.radius * 0.6)
            );
            meshRef.current.rotation.set(t * 3, seed.angleOffset, t * 2);
            return;
        }

        // Phase 2 (0.65s - 2.8s): High-speed vortex blending inside the pitcher
        const blendTime = t - 0.65;
        const spinRamp = Math.min(1, blendTime / 0.4); // Smooth acceleration
        const angularSpeed = seed.speed * (2 + spinRamp * 10);
        const currentAngle = seed.angleOffset + blendTime * angularSpeed;

        // Taper radius slightly near the narrower bottom of the pitcher
        const verticalBounce = Math.sin(blendTime * 9 + seed.angleOffset) * 0.45;
        const y = THREE.MathUtils.clamp(seed.heightOffset + verticalBounce, -0.55, 0.85);
        const dynamicRadius = seed.radius * (0.75 + ((y + 0.6) / 1.5) * 0.35);

        meshRef.current.position.set(
            Math.cos(currentAngle) * dynamicRadius,
            y,
            Math.sin(currentAngle) * dynamicRadius
        );

        meshRef.current.rotation.set(
            Math.sin(blendTime * 12 + seed.angleOffset) * 0.8,
            -currentAngle + Math.PI / 2,
            Math.cos(blendTime * 10) * 0.6
        );
    });

    return (
        <group ref={meshRef}>
            <RoundedBox args={[0.72, 0.24, 0.03]} radius={0.04} smoothness={2}>
                <meshStandardMaterial color={seed.color} roughness={0.3} metalness={0.1} />
            </RoundedBox>
            <Text
                position={[0, 0, 0.02]}
                fontSize={0.085}
                maxWidth={0.64}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                {seed.name}
            </Text>
        </group>
    );
}

function BlenderScene({
    students,
    onComplete,
}: {
    students: string[];
    onComplete: () => void;
}) {
    const elapsedRef = useRef(0);
    const completedRef = useRef(false);
    const bladesRef = useRef<THREE.Group>(null);
    const blenderBodyRef = useRef<THREE.Group>(null);
    const lidRef = useRef<THREE.Mesh>(null);

    const cardSeeds = useMemo<CardSeed[]>(() => {
        return students.map((name, i) => ({
            name,
            angleOffset: (i / Math.max(1, students.length)) * Math.PI * 2,
            radius: 0.35 + (i % 3) * 0.16,
            heightOffset: -0.35 + ((i * 0.29) % 1.15),
            speed: 0.85 + (i % 4) * 0.15,
            color: CARD_COLORS[i % CARD_COLORS.length],
            startY: 2.2 + (i % 5) * 0.35,
        }));
    }, [students]);

    useFrame((_, delta) => {
        // Clamp delta in case tab loses focus briefly
        const dt = Math.min(delta, 0.05);
        elapsedRef.current += dt;
        const t = elapsedRef.current;

        // Close lid right after cards drop in
        if (lidRef.current) {
            const lidProgress = THREE.MathUtils.clamp((t - 0.55) / 0.25, 0, 1);
            lidRef.current.position.y = THREE.MathUtils.lerp(2.3, 1.18, lidProgress);
        }

        // Spin blades & add subtle motor vibration during blending
        if (t > 0.65 && bladesRef.current && blenderBodyRef.current) {
            const blendTime = t - 0.65;
            const speed = Math.min(38, blendTime * 45);
            bladesRef.current.rotation.y += dt * speed;

            const shake = Math.min(0.025, blendTime * 0.02);
            blenderBodyRef.current.position.x = Math.sin(t * 55) * shake;
            blenderBodyRef.current.position.z = Math.cos(t * 48) * shake;
        }

        // Finish after 2.9 seconds
        if (t >= 2.9 && !completedRef.current) {
            completedRef.current = true;
            onComplete();
        }
    });

    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 6, 5]} intensity={1.4} />
            <pointLight position={[-3, 2, -3]} intensity={0.6} color="#818cf8" />
            <Environment preset="city" />

            <group ref={blenderBodyRef} position={[0, -0.35, 0]}>
                {/* Motor Base */}
                <mesh position={[0, -1.25, 0]}>
                    <cylinderGeometry args={[0.85, 1.05, 0.85, 32]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.25} />
                </mesh>

                {/* Metallic Collar Ring */}
                <mesh position={[0, -0.78, 0]}>
                    <cylinderGeometry args={[0.82, 0.86, 0.14, 32]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
                </mesh>

                {/* Power Dial */}
                <mesh position={[0, -1.22, 0.96]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
                    <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.4} />
                </mesh>

                {/* Spinning Blades */}
                <group ref={bladesRef} position={[0, -0.62, 0]}>
                    <mesh>
                        <cylinderGeometry args={[0.08, 0.1, 0.16, 16]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
                    </mesh>
                    <mesh rotation={[0.25, 0, 0]}>
                        <boxGeometry args={[0.75, 0.02, 0.12]} />
                        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
                    </mesh>
                    <mesh rotation={[0, Math.PI / 2, -0.25]}>
                        <boxGeometry args={[0.75, 0.02, 0.12]} />
                        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
                    </mesh>
                </group>

                {/* Swirling Student Name Cards */}
                {cardSeeds.map((seed) => (
                    <StudentCardMesh key={seed.name} seed={seed} elapsedRef={elapsedRef} />
                ))}

                {/* Glass Pitcher */}
                <mesh position={[0, 0.2, 0]}>
                    <cylinderGeometry args={[1.05, 0.78, 1.85, 32, 1, true]} />
                    <meshPhysicalMaterial
                        color="#e0e7ff"
                        transparent
                        opacity={0.22}
                        roughness={0.08}
                        metalness={0.05}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>

                {/* Blender Handle */}
                <mesh position={[1.12, 0.2, 0]}>
                    <torusGeometry args={[0.45, 0.07, 16, 32, Math.PI]} />
                    <meshStandardMaterial color="#334155" roughness={0.4} />
                </mesh>

                {/* Animated Lid */}
                <mesh ref={lidRef} position={[0, 2.3, 0]}>
                    <cylinderGeometry args={[1.08, 1.06, 0.14, 32]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.3} />
                </mesh>
            </group>
        </>
    );
}

export const BlenderAnimation: React.FC<BlenderAnimationProps> = ({
    students,
    onComplete,
}) => {
    const { i18n } = useI18n();

    // Safety fallback in case WebGL context is throttled
    useEffect(() => {
        const fallback = setTimeout(onComplete, 3400);
        return () => clearTimeout(fallback);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
            <div className="h-[460px] w-full max-w-2xl">
                <Canvas camera={{ position: [0, 0.8, 4.4], fov: 42 }}>
                    <BlenderScene students={students} onComplete={onComplete} />
                </Canvas>
            </div>
            <p className="animate-pulse text-lg font-semibold tracking-wide text-emerald-400">
                {i18n('mixer.blending_status', { count: students.length })}
            </p>
        </div>
    );
};