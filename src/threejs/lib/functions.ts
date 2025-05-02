import {TextureLoader} from 'three';

export async function  textureLoader(url: string) {
    return await new TextureLoader().load( url );
  }
