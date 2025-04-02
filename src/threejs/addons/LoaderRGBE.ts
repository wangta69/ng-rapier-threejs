import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import {
  DataTexture, AnyMapping
} from "three";
import * as THREE from "three"

// type Tmapping = {
//   [key: string]: number,
//   // [UVMapping: string]: number,
//   // [CubeReflectionMapping: string]: number,
//   // [CubeRefractionMapping: string]: number,
//   // [CubeUVReflectionMapping: string]: number,
//   // [EquirectangularReflectionMapping: string]: number,
//   // [EquirectangularRefractionMapping: string]: number
// }

type Tmapping = {
  UVMapping: AnyMapping,
  CubeReflectionMapping: AnyMapping,
  CubeRefractionMapping: AnyMapping,
  CubeUVReflectionMapping: AnyMapping,
  EquirectangularReflectionMapping: AnyMapping,
  EquirectangularRefractionMapping: AnyMapping
}

const mapping:Tmapping = {
  UVMapping: 300,
  CubeReflectionMapping: 301,
  CubeRefractionMapping: 302,
  CubeUVReflectionMapping: 306,
  EquirectangularReflectionMapping: 303,
  EquirectangularRefractionMapping: 304
}

const TextureOptions: any = {
  format: (texture: DataTexture, value: any) => { //  PixelFormat,
    texture.format = value;
  },
  type: (texture: DataTexture, value: any) => { //  TextureDataType,
    texture.type = value;
  },
  mapping: (texture: DataTexture, value: string) => { //  Mapping,
    texture.mapping = mapping[value as keyof Tmapping];
  },
  wrapS: (texture: DataTexture, value: any) => { //  Wrapping,
    texture.wrapS = value;
  },
  wrapT: (texture: DataTexture, value: any) => { //  Wrapping,
    texture.wrapT = value;
  },
  magFilter: (texture: DataTexture, value: any) => { //  MagnificationTextureFilter,
    texture.magFilter = value;
  },
  minFilter: (texture: DataTexture, value: any) => { //  MinificationTextureFilter,
    texture.minFilter = value;
  },
  anisotropy: (texture: DataTexture, value: number) => { //  number,
    texture.anisotropy = value;
  },
  colorSpace: (texture: DataTexture, value: string) => { //  string,
    texture.colorSpace = value;
  }

}
export class LoaderRGBE {
  public texture!: DataTexture;

  public loader(url: string, props?: any) {
    return new Promise<DataTexture>((resolve, reject) => {
      const loader = new RGBELoader(); 
      loader.load(url,  ( texture: DataTexture) => { // DataTexture

        Object.keys(props).forEach((key: any) =>{
          if(key in TextureOptions) {
            TextureOptions[key](texture, props[key]);
          }
        })

        this.texture = texture; 
        resolve(texture);
      }, ( xhr ) => {// called while loading is progressing
        // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }, ( error ) => {// called when loading has errors
        // console.log( 'An error happened' );
      });
    })
  }
}