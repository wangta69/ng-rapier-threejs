import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

export class LoaderGLTF {
 /**
   * 
   * @param args 
   * @param geometry {type: sphereGeometry}
   * @param material 
   */
  public async create(url: string) {
    const body = await this.loader(url);
    const mesh:THREE.Object3D = body.children[0];
    return mesh;
  }

  private loader(url: string) {
    return new Promise<THREE.Group>((resolve, reject) => {
      const loader = new GLTFLoader(); 
      loader.load(url,  ( glb ) => {
        const myModel = glb.scene; 
        resolve(myModel);
      }, ( xhr ) => {// called while loading is progressing
        // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }, ( error ) => {// called when loading has errors
        // console.log( 'An error happened' );
      });
    })
  }

  /*
  private loader(url: string) {
    const loader = new GLTFLoader().loadAsync(url).then((glb) => {
        // this.myModel = glb.scene.children[0];
      const myModel = glb.scene; 
    });
  }
  */
}