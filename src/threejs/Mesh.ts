import {Vector3, Mesh, Object3D, Material, BufferGeometry} from "three";
import {Geometry, Igeometry, TgeometyrProps} from './Geometry';
import {MaterialObj} from './Material';
import {LoaderGLTF} from './addons/LoaderGLTF';
import {LoaderObj} from './addons/LoaderObj';
import {LoaderRGBE} from './addons/LoaderRGBE';
import {Tcollider, Body} from '../rapier/Body';
import {Imaterial} from './Material';
import {World} from './World';
export type MeshProp = {
  position?:number[] | Vector3,
  scale?:number[] | Vector3,
  rotation?: number[] | Vector3,
  castShadow?: boolean,
  receiveShadow?: boolean,
  url?: string,
  name?: string
}
export type Tmesh = {
  geometry: TgeometyrProps, // {type: 'box'}, // geometry 속성
  material: Imaterial, // {type: 'standard'}, // material 속성
  mesh: MeshProp, // { castShadow: true}
  rapier?: Tcollider
}

// export type ObjProps = {
//   url: string,
//   name: string,
// }
// export type Tobj = {
//   // geometry: any, // {type: 'box'}, // geometry 속성
//   material: any, // {type: 'standard'}, // material 속성
//   mesh: any, // { castShadow: true}
//   rapier?: any
// }

const MeshOptions: any = {
  position: (mesh:Mesh, value: number[] | Vector3) => {
    if(Array.isArray(value)){
      mesh.position.set(...(value as [number, number, number]));
    } else {
      mesh.position.set(value.x, value.y, value.z);
    }
  },
  scale: (mesh:Mesh, value: number[] | Vector3) => {
    if(Array.isArray(value)){
      mesh.scale.set(...(value as [number, number, number]));
    } else {
      mesh.scale.set(value.x, value.y, value.z);
    }
  },
  rotation: (mesh:Mesh, value: number[] | Vector3) => {
    if(Array.isArray(value)){
      mesh.rotation.set(...(value as [number, number, number]));
    } else {
      mesh.rotation.set(value.x, value.y, value.z);
    }
  },
  castShadow: (mesh:Mesh, value: boolean) => {
    mesh.castShadow = value;
  },
  receiveShadow: (mesh:Mesh, value: boolean) => {
    mesh.receiveShadow = value;
  }
};


export class MeshObj {
  public mesh!: Object3D | Mesh;
  private world: World;
  constructor(world: World) {this.world = world}

  /**
   * 
   * @param args 
   * @param geometry {type: sphereGeometry}
   * @param material 
   */
  public async create(args: Tmesh):Promise<MeshObj> {
    const geometry = this.createGeometry(args.geometry)
    // const materialObj = new Material();
    const material = <Material>await new MaterialObj().createMaterial(args.material);

    this.mesh = this.createMesh(geometry, material, args.mesh || {});
    return this;
    // return <Mesh>this.mesh;
  }

  private createGeometry(params: any) {
    params.args = params.args || [];
    return new Geometry().create(params)
  }

  private createMesh(geometry: BufferGeometry, material: Material | Material[], args: any):Mesh {
    const mesh = new Mesh( geometry, material);
    Object.keys(args).forEach((key: any) =>{
      if(key in MeshOptions) {
        MeshOptions[key](mesh, args[key]);
      }
    });

    return mesh
  }

  public async loadObj(args: Tmesh) {
    const loader = new LoaderObj();
    const obj = await loader.create(args.mesh.url as string);

    this.mesh = obj.getObjectByName(args.mesh.name as string) || obj;
    const material = new MaterialObj();
    // this.material = await material.createMaterial(args.material);
    (this.mesh as any).material = await material.createMaterial(args.material);

    this.mesh.name = args.mesh.name || '';
    args.mesh.scale? this.mesh.scale.set(...(args.mesh.scale as [number, number, number])): null;
    this.mesh.castShadow = args.mesh.castShadow || false;
    this.mesh.receiveShadow = args.mesh.receiveShadow || false;

    args.mesh.position ? this.mesh.position.set(...(args.mesh.position as [number, number, number])) : null;

    return this;
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


  public dispose() {
    (this.mesh as Mesh).geometry.dispose();
    this.world.scene.remove(this.mesh);
  }

  
}