import * as THREE from "three";
import {Material} from './Material';
import {LoaderGLTF} from './LoaderGLTF';

export class Mesh {
  public mesh!: THREE.Object3D | THREE.Mesh;
  public geometry: any;
  public material: any;
  constructor() {}

  /**
   * 
   * @param args 
   * @param geometry {type: sphereGeometry}
   * @param material 
   */
  public async create(args: any):Promise<THREE.Mesh> {
    this.createGeometry(args.geometry)
    const material = new Material();
    this.material = await material.createMaterial(args.material);

    this.mesh = this.createMesh(args.mesh || {});
    return <THREE.Mesh>this.mesh;
  }

  public async loadGLTF(args: any) {
    const loader = new LoaderGLTF();
    this.mesh = await loader.create(args.url);
    this.mesh.name = args.name || null;
    args.scale? this.mesh.scale.set(args.scale.x, args.scale.y, args.scale.z): null;
    this.mesh.castShadow = args.castShadow || false;
    this.mesh.receiveShadow = args.receiveShadow || false;
    this.mesh.position.set(args.position.x, args.position.y, args.position.z);

    return this.mesh;
  }

  private createGeometry(args: any) {
    switch(args.type) {
      case 'box':
        this.geometry = new THREE.BoxGeometry(args.width, args.height, args.depth);
        break;
      case 'sphere':
        this.geometry = new THREE.SphereGeometry(args.radius, args.width, args.height);
        break;
    }
  }

  private createMesh(args: any):THREE.Mesh {
    const mesh = new THREE.Mesh( this.geometry, this.material);
    if(args.position) mesh.position.set(args.position.x, args.position.y, args.position.z);
    if(args.scale) mesh.scale.set(args.scale.x, args.scale.y, args.scale.z);
    if(args.castShadow) mesh.castShadow = true;
    if(args.receiveShadow) mesh.receiveShadow = true;

    return mesh
  }
}