import * as THREE from "three";
import {GLTFLoader, GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';

export class LoaderGLTF {

  private object!: GLTF;


  public loader(url: string) {
    return new Promise<boolean>((resolve, reject) => {
      const loader = new GLTFLoader(); 
      loader.load(url,  ( glb:GLTF ) => {
        this.object = glb; 
        resolve(true);
      }, ( xhr ) => {// called while loading is progressing
        // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }, ( error ) => {// called when loading has errors
        // console.log( 'An error happened' );
      });
    })
  }

 /**
   * 
   * @param args 
   * @param geometry {type: sphereGeometry}
   * @param material 
   */

  /**
   * onegroup onemesh
   * @returns 
   */
  public getObject():THREE.Object3D {
    return this.object.scene.children[0];
  }

  public getObjectByName(name: string):THREE.Object3D | undefined {
    return this.object.scene.getObjectByName(name);
  }











  /*
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

  */














  /*
  private loader(url: string) {
    const loader = new GLTFLoader().loadAsync(url).then((glb) => {
        // this.myModel = glb.scene.children[0];
      const myModel = glb.scene; 
    });
  }
  */
}