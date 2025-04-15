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
  rapier?: any
}

// export type ObjProps = {
//   url: string,
//   name: string,
// }
export type Tobj = {
  // geometry: any, // {type: 'box'}, // geometry 속성
  material: any, // {type: 'standard'}, // material 속성
  mesh: any, // { castShadow: true}
  rapier?: any
}

const MeshOptions: any = {
  position: (mesh:THREE.Mesh, value: number[] | THREE.Vector3) => {
    if(Array.isArray(value)){
      mesh.position.set(value[0],  value[1], value[2]);
    } else {
      mesh.position.set(value.x, value.y, value.z);
    }
  },
  scale: (mesh:THREE.Mesh, value: number[] | THREE.Vector3) => {
    if(Array.isArray(value)){
      mesh.scale.set(value[0],  value[1], value[2]);
    } else {
      mesh.scale.set(value.x, value.y, value.z);
    }
  },
  rotation: (mesh:THREE.Mesh, value: number[] | THREE.Vector3) => {
    if(Array.isArray(value)){
      mesh.rotation.set(value[0],  value[1], value[2]);
    } else {
      mesh.rotation.set(value.x, value.y, value.z);
    }
  },
  castShadow: (mesh:THREE.Mesh, value: boolean) => {
    mesh.castShadow = value;
  },
  receiveShadow: (mesh:THREE.Mesh, value: boolean) => {
    mesh.receiveShadow = value;
  }
};


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
    const material = <THREE.Material>await new Material().createMaterial(args.material);

    this.mesh = this.createMesh(geometry, material, args.mesh || {});
    return <THREE.Mesh>this.mesh;
  }

  public async loadObj(args: Tobj) {
    const loader = new LoaderObj();
    const obj = await loader.create(args.mesh.url);

    this.mesh = obj.getObjectByName(args.mesh.name) || obj;
    const material = new Material();
    // this.material = await material.createMaterial(args.material);
    (this.mesh as any).material = await material.createMaterial(args.material);

    this.mesh.name = args.mesh.name || null;
    args.mesh.scale? this.mesh.scale.set(args.mesh.scale.x, args.mesh.scale.y, args.mesh.scale.z): null;
    this.mesh.castShadow = args.mesh.castShadow || false;
    this.mesh.receiveShadow = args.mesh.receiveShadow || false;

    args.mesh.position ? this.mesh.position.set(args.mesh.position.x, args.mesh.position.y, args.mesh.position.z) : null;

    return this.mesh;
  }

  public async loadGLTF(args: any, callback:(gltf:LoaderGLTF)=>void) {
    // const loader = new LoaderGLTF();
    const gltf = new LoaderGLTF();
    await gltf.loader(args.url);
    callback(gltf);

    return this;
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

  private createMesh(geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[], args: any):THREE.Mesh {
    const mesh = new THREE.Mesh( geometry, material);
    Object.keys(args).forEach((key: any) =>{
      if(key in MeshOptions) {
        MeshOptions[key](mesh, args[key]);
      }
    });

    return mesh
  }
}