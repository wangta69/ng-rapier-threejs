import * as THREE from "three";
import {Geometry, IGeometry} from './Geometry';
import {Material} from './Material';
import {LoaderGLTF} from './addons/LoaderGLTF';
import {LoaderObj} from './addons/LoaderObj';
import {LoaderRGBE} from './addons/LoaderRGBE';

export type Tmesh = {
  geometry: any, // {type: 'box'}, // geometry 속성
  material: any, // {type: 'standard'}, // material 속성
  mesh: any, // { castShadow: true}
}
export class Mesh {
  public mesh!: THREE.Object3D | THREE.Mesh;
  // public geometry!: IGeometry;
  // public material!: THREE.Material;
  constructor() {}

  /**
   * 
   * @param args 
   * @param geometry {type: sphereGeometry}
   * @param material 
   */
  public async create(args: Tmesh):Promise<THREE.Mesh> {
    const geometry = this.createGeometry(args.geometry)
    // const materialObj = new Material();
    const material = await new Material().createMaterial(args.material);

    this.mesh = this.createMesh(geometry, material, args.mesh || {});
    return <THREE.Mesh>this.mesh;
  }

  public async loadObj(args: any) {
    const loader = new LoaderObj();
    const obj = await loader.create(args.mesh.url);

    this.mesh = obj.getObjectByName(args.mesh.name) || obj;
    const material = new Material();
    // this.material = await material.createMaterial(args.material);
    (this.mesh as any).material = await material.createMaterial(args.material);

    this.mesh.name = args.name || null;
    args.scale? this.mesh.scale.set(args.scale.x, args.scale.y, args.scale.z): null;
    this.mesh.castShadow = args.castShadow || false;
    this.mesh.receiveShadow = args.receiveShadow || false;

    args.position ? this.mesh.position.set(args.position.x, args.position.y, args.position.z) : null;

    return this.mesh;
  }

  public async loadGLTF(args: any, callback:(gltf:LoaderGLTF)=>void) {
    // const loader = new LoaderGLTF();
    const gltf = new LoaderGLTF();
    await gltf.loader(args.url);
    callback(gltf);

    return this;
    // this.mesh.name = args.name || null;
    // args.scale? this.mesh.scale.set(args.scale.x, args.scale.y, args.scale.z): null;
    // this.mesh.castShadow = args.castShadow || false;
    // this.mesh.receiveShadow = args.receiveShadow || false;
    // args.position ? this.mesh.position.set(args.position.x, args.position.y, args.position.z) : null;

    // return this.mesh;
  }

  public async loadRGBE(args: any, callback:(gltf:LoaderGLTF)=>void) {
    // const loader = new LoaderGLTF();
    const gltf = new LoaderRGBE();


    return this;
    // this.mesh.name = args.name || null;
    // args.scale? this.mesh.scale.set(args.scale.x, args.scale.y, args.scale.z): null;
    // this.mesh.castShadow = args.castShadow || false;
    // this.mesh.receiveShadow = args.receiveShadow || false;
    // args.position ? this.mesh.position.set(args.position.x, args.position.y, args.position.z) : null;

    // return this.mesh;
  }

  private createGeometry(params: any) {
    params.args = params.args || [];
    return new Geometry().create(params)
  }

  private createMesh(geometry: any, material: any, args: any):THREE.Mesh {
    const mesh = new THREE.Mesh( geometry, material);
    if(args.position) mesh.position.set(args.position.x, args.position.y, args.position.z);
    if(args.scale) mesh.scale.set(args.scale.x, args.scale.y, args.scale.z);
    if(args.castShadow) mesh.castShadow = true;
    if(args.receiveShadow) mesh.receiveShadow = true;

    return mesh
  }
}