import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import './style.css';

function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh>
          <octahedronGeometry args={[2, 3]} />
          <meshBasicMaterial />
        </mesh>
      </Canvas>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
