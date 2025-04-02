import * as THREE from "three";
// import {GLTFLoader, GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'
type TLensflareElement = {
  texture: THREE.Texture, 
  size?: number, 
  distance?: number, 
  color?: THREE.Color
}
export class LensFlare {
  public lensflare: Lensflare;
  constructor() {
    this.lensflare = new Lensflare();
  }
  public addElement(params:TLensflareElement) {
    this.lensflare.addElement(new LensflareElement(params.texture, params.size, params.distance, params.color));

    return this;
  }

  public get() {
    return this.lensflare;
  }


}