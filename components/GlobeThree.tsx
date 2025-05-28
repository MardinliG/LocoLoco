'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Country {
    name: string;
    coordinates: [number, number];
    population?: number;
    continent?: string;
    iso?: string;
    gdp?: number;
}

interface GlobeProps {
    countries: Country[];
    onCountryClick: (country: Country) => void;
    onCountryHover: (hovered: boolean, country?: Country) => void;
}

const CountryMarker = ({ country, onClick, onHover }: {
    country: Country;
    onClick: () => void;
    onHover: (hovered: boolean) => void;
}) => {
    const markerRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    const { longitude, latitude } = {
        longitude: country.coordinates[0],
        latitude: country.coordinates[1]
    };

    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);

    const x = -(2 * Math.sin(phi) * Math.cos(theta));
    const y = 2 * Math.cos(phi);
    const z = 2 * Math.sin(phi) * Math.sin(theta);

    useFrame(() => {
        if (markerRef.current) {
            markerRef.current.scale.x = hovered ? 1.5 : 1;
            markerRef.current.scale.y = hovered ? 1.5 : 1;
            markerRef.current.scale.z = hovered ? 1.5 : 1;
        }
    });

    return (
        <group position={[x, y, z]}>
            <mesh
                ref={markerRef}
                onClick={onClick}
                onPointerOver={() => {
                    setHovered(true);
                    onHover(true);
                }}
                onPointerOut={() => {
                    setHovered(false);
                    onHover(false);
                }}
            >
                <sphereGeometry args={[0.05, 32, 32]} />
                <meshStandardMaterial
                    color={hovered ? "#ff0000" : "#ffd700"}
                    emissive={hovered ? "#ff0000" : "#ffd700"}
                    emissiveIntensity={hovered ? 0.5 : 0.3}
                />
            </mesh>
        </group>
    );
};

const GlobeScene = ({ countries, onCountryClick, onCountryHover }: GlobeProps) => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 0, 5);
    }, [camera]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />

            {/* Globe */}
            <mesh>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    color="#1e3a8a"
                    metalness={0.4}
                    roughness={0.7}
                />
            </mesh>

            {/* Country Markers */}
            {countries.map((country, index) => (
                <CountryMarker
                    key={index}
                    country={country}
                    onClick={() => onCountryClick(country)}
                    onHover={(hovered) => onCountryHover(hovered, country)}
                />
            ))}

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={3}
                maxDistance={10}
                autoRotate={true}
                autoRotateSpeed={0.5}
            />
        </>
    );
};

const GlobeThree = (props: GlobeProps) => {
    return (
        <Canvas>
            <GlobeScene {...props} />
        </Canvas>
    );
};

export default GlobeThree; 