import * as THREE from 'three';
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three/addons';

export class RenderManager {
  private readonly _composer: EffectComposer;

  constructor(
    container: HTMLElement,
    scene: THREE.Scene,
    camera: THREE.Camera,
  ) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.3,
      0.5,
      1,
    );

    this._composer = new EffectComposer(renderer);
    this._composer.addPass(renderPass);
    this._composer.addPass(bloomPass);
  }

  render() {
    return this._composer.render();
  }
}
