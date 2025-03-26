import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'

export class LoaderObj {
  /**
   * 
   * @param args 
   * @param geometry {type: sphereGeometry}
   * @param material 
   */
  public async create(url: string) {
    const body = await this.loader(url);
    const mesh:THREE.Object3D = body.children[0];

   
    // if(args.scale) this.mesh.scale.set(1, 1, 1);
    return mesh;
  }

  private loader(url: string, name?: string ) {

    return new Promise<THREE.Group>((resolve, reject) => {
      const loader = new OBJLoader(); 
      loader.load(url,  ( obj ) => {
        
        resolve(obj);
      }, ( xhr ) => {// called while loading is progressing
        // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }, ( error ) => {// called when loading has errors
        // console.log( 'An error happened' );
      });
    })
  }

/*
  private loader(url: string) {
    new OBJLoader().loadAsync('/assets/welcome.obj').then((object) => {
        this.scene.add(object)
        const suzanneMesh: any = object.getObjectByName('Suzanne')                
        suzanneMesh.material = new THREE.MeshNormalMaterial()
        suzanneMesh.castShadow = true

    })
  }
  */

}