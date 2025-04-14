import { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three/addons';

export class RenderManager {
  private readonly _scene: THREE.Scene;
  private readonly _camera: THREE.Camera;
  private readonly _tweenGroup: TWEENGroup;

  private readonly _composer: EffectComposer;

  private frustumSize = 22;

  constructor(container: HTMLElement) {
    this._scene = new THREE.Scene();

    const aspect = container.clientWidth / container.clientHeight;
    this._camera = new THREE.OrthographicCamera(
      (-this.frustumSize * aspect) / 2,
      (this.frustumSize * aspect) / 2,
      this.frustumSize / 2,
      -this.frustumSize / 2,
    );

    this._tweenGroup = new TWEENGroup();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    const renderPass = new RenderPass(this._scene, this._camera);
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

  get scene() {
    return this._scene;
  }

  get camera() {
    return this._camera;
  }

  get tween() {
    return this._tweenGroup;
  }

  render() {
    return this._composer.render();
  }
}
