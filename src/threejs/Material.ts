import {
  MeshStandardMaterial, MeshStandardMaterialParameters, 
  MeshNormalMaterial, MeshNormalMaterialParameters,
  MeshPhongMaterial, MeshPhongMaterialParameters,
  TextureLoader, ColorRepresentation,
  RepeatWrapping,
  Texture} from "three";
import {textureLoader} from './lib/functions'
interface TParams extends MeshStandardMaterialParameters, MeshNormalMaterialParameters, MeshPhongMaterialParameters  {
}

export type Ttexture = {
  url: string,
  wrapS?: string,
  wrapT?: string,
  repeat?: [number, number]
}
export type Tmaterial = {
  type: string,
  texture?: Ttexture,
  map?:Texture,
  flatShading?: boolean,
  color?: ColorRepresentation,
  shininess?: number,
}

export const MaterialOptions: {[key: string]: (material:TParams, value: any) => void}  = {
  color: (material:TParams, value:number) => {
    material.color = value;
  },
  flatShading: (material:TParams, value:boolean) => {
    material.flatShading = value;
  },
  shininess: (material:TParams, value:number) => {
    material.color = value;
  },
  map: (material:TParams, value:Texture) => {
    material.map = value;
  },
}

export class MaterialObj {
  constructor() {}

  public async createMaterial(args: Tmaterial) {

    const params: TParams = {};

    args.texture ? params.map = await this.loadmap(args.texture) : null;
    params.flatShading = args.flatShading || false;
    args.color ? params.color = args.color : null;

    switch(args.type) {
      case 'standard':
        return new MeshStandardMaterial(params);   
      case 'normal':
        return new MeshNormalMaterial(params); 
      case 'phong':
        return new MeshPhongMaterial(params); 
    }
    return null;
  }

  private async loadmap(args: Ttexture) {
    if(args.url) {
      const map = await textureLoader(args.url);

      args.wrapS ? map.wrapS = this.textureWrap(args.wrapS) : null;
      args.wrapT ? map.wrapT = this.textureWrap(args.wrapT) : null;
      args.repeat ? map.repeat.set(...args.repeat): null;

      return map;
    }
    return null;
  }

  private textureWrap(wrap: string) {
    switch (wrap) {
      case 'repeat': return RepeatWrapping;
    }

    return null as any;
    //
  }

  // private async OBJLoader(url: string) {
  //   return await new THREE.OBJLoader().load( url );
  // }
}