import * as THREE from "three";
import {Geometry} from './Geometry';
import {Material} from './Material';
import {LoaderGLTF} from './LoaderGLTF';
import {LoaderObj} from './LoaderObj';
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

  public async loadObj(args: any) {
    const loader = new LoaderObj();
    const obj = await loader.create(args.url);

    console.log('loadObj >> obj >>', obj);
    this.mesh = obj.getObjectByName(args.name) || obj;

    // this.material = await material.createMaterial(args.material);


    this.mesh.name = args.name || null;
    args.scale? this.mesh.scale.set(args.scale.x, args.scale.y, args.scale.z): null;
    this.mesh.castShadow = args.castShadow || false;
    this.mesh.receiveShadow = args.receiveShadow || false;
    this.mesh.position.set(args.position.x, args.position.y, args.position.z);

    return this.mesh;
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

  private createGeometry(params: any) {
    params.args = params.args || [];
    this.geometry = new Geometry().create(params)
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