import React, { Fragment, type ReactNode, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";

function Box(props: ThreeElements["mesh"]) {
	const meshRef = useRef<THREE.Mesh>(null!);
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	useFrame((state, delta) => (meshRef.current.rotation.x += delta));
	return (
		<mesh
			{...props}
			ref={meshRef}
			scale={active ? 1.5 : 1}
			onClick={(event) => {
				setActive(!active);
			}}
			onPointerOver={(event) => {
				setHover(true);
			}}
			onPointerOut={(event) => {
				setHover(false);
			}}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
		</mesh>
	);
}

type Props = {
	children?: ReactNode;
};

const AppWindow = (props: Props) => (
	<Fragment>
		<Canvas>
			<ambientLight intensity={Math.PI / 2} />
			<spotLight
				position={[10, 10, 10]}
				angle={0.15}
				penumbra={1}
				decay={0}
				intensity={Math.PI}
			/>
			<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
			<Box position={[-1.2, 0, 0]} />
			<Box position={[1.2, 0, 0]} />
		</Canvas>
	</Fragment>
);

export default AppWindow;
