import { useThree } from '@react-three/fiber';

type CameraSetup = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

type PossibleCameraSetups<K extends string> = Record<K, CameraSetup>;

export default function useSetCamera<K extends string>(
  pcs: PossibleCameraSetups<K>,
) {
  const camera = useThree((rootState) => rootState.camera);

  return (selectedCameraSetup: K) => {
    const cameraSetup = pcs[selectedCameraSetup];
    camera.position.set(...cameraSetup.position);
    camera.lookAt(...cameraSetup.lookAt);
  };
}
