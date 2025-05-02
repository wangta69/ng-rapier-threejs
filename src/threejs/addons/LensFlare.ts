import {ColorRepresentation, Color} from "three";
import {textureLoader} from '../lib/functions'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'
type TLensflareElement = {
 // texture: THREE.Texture, 
  texture: {url: string},
  size?: number, 
  distance?: number, 
  color?: number, // ColorRepresentation
}
export class LensFlare {
  public lensflare: Lensflare;
  constructor() {
    this.lensflare = new Lensflare();
  }
  public async addElement(params:TLensflareElement) {

    const texture = await textureLoader(params.texture.url);
    const color = params.color ? new Color().setHex( params.color) : undefined;
    this.lensflare.addElement(new LensflareElement(texture, params.size, params.distance, color));

    return this;
  }

  public get() {
    return this.lensflare;
  }


}