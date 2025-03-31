
import * as THREE from "three";
import {
  // Collider,
  ColliderDesc,
  Vector,
  ActiveEvents,
  // Vector3
} from "@dimforge/rapier3d-compat";

// export const vector3ToRapierVector = (v: THREE.Vector3Like) => {
//   if (Array.isArray(v)) {
//     return new Vector3(v[0], v[1], v[2]);
//   } else if (typeof v === "number") {
//     return new Vector3(v, v, v);
//   } else {
//     const threeVector3 = v as Vector3;
//     return new Vector3(threeVector3.x, threeVector3.y, threeVector3.z);
//   }
// };

export type ColliderShape =
  | "cuboid"
  | "trimesh"
  | "ball"
  | "capsule"
  | "convexHull"
  | "heightfield"
  | "polyline"
  | "roundCuboid"
  | "cylinder"
  | "roundCylinder"
  | "cone"
  | "roundCone"
  | "convexMesh"
  | "roundConvexHull"
  | "roundConvexMesh";


const ColliderOptions: any = {
  activeCollisionTypes: (collider:ColliderDesc, value: number) => {
    collider.setActiveCollisionTypes(value);
  },
  activeEvents: (collider:ColliderDesc, value: ActiveEvents) => {
    collider.setActiveEvents(value);
  },
  activeHooks: (collider:ColliderDesc, value: number) => {
    collider.setActiveHooks(value);
  },
  collisionGroups: (collider:ColliderDesc, value: number) => {
    collider.setCollisionGroups(value);
  },
  contactForceEventThreshold: (collider:ColliderDesc, value: number) => {
    collider.setContactForceEventThreshold(value);
  },
  contactSkin: (collider:ColliderDesc, value: number) => {
    collider.setContactSkin(value);
  },
  density: (collider:ColliderDesc, value: number) => {
    collider.setDensity(value);
  },
  enabled: (collider:ColliderDesc, value: boolean) => {
    collider.setEnabled(value);
  },
  friction: (collider:ColliderDesc, value: number) => {
    collider.setFriction(value);
  },
  frictionCombineRule: (collider:ColliderDesc, value: number) => {
    collider.setFrictionCombineRule(value);
  },
  mass: (collider:ColliderDesc, value: number) => {
    collider.setMass(value);
  },
  // massProperties: (collider:ColliderDesc, value: number) => {
  //   collider.setMassProperties(mass: number, centerOfMass: Vector, principalAngularInertia: Vector, angularInertiaLocalFrame: Rotatio);
  // },
  restitution: (collider:ColliderDesc, value: number) => {
    collider.setRestitution(value);
  },
  restitutionCombineRule: (collider:ColliderDesc, value: number) => {
    collider.setRestitutionCombineRule(value);
  },
  rotation: (collider:ColliderDesc, value: THREE.Quaternion) => {
    collider.setRotation(value);
  },
  sensor: (collider:ColliderDesc, value: boolean) => {
    collider.setSensor(value);
  },
  solverGroups: (collider:ColliderDesc, value: number) => {
    collider.setSolverGroups(value);
  },
  translation: (collider:ColliderDesc, value: THREE.Vector3) => {
    collider.setTranslation(value.x, value.y, value.z);
  }
};

export type scaledArgs = {

}
export class RapierColliderDesc {

  constructor() {}

  public extractPropsFromOptions() {

  }
  public createShapeFromOptions(options: any): ColliderDesc | null {

    const shape:ColliderShape = options.shape;
    const scale = options.scale;


    // const scaledArgs: number | number[] | Float32Array<ArrayBufferLike>[] | Uint32Array<ArrayBufferLike>[] | Vector[] = this.scaleColliderArgs(shape!, options.args, scale);
    const scaledArgs = this.scaleColliderArgs(shape!, options.args, scale);
    let desc:ColliderDesc;

    switch(shape) {
      case 'heightfield': // Heightfield uses a vector
        desc = ColliderDesc[shape](<number>scaledArgs[0], <number>scaledArgs[1], <Float32Array<ArrayBufferLike>>scaledArgs[2], <Vector>scaledArgs[3], <number>scaledArgs[4]);
        break;
      case 'trimesh':
      case 'convexMesh':
        desc = <ColliderDesc>ColliderDesc[shape](<Float32Array<ArrayBufferLike>>scaledArgs[0], <Uint32Array<ArrayBufferLike>>scaledArgs[1]);break
      case 'convexHull':
        desc = <ColliderDesc>ColliderDesc[shape](<Float32Array<ArrayBufferLike>>scaledArgs[0]);break;
      case 'polyline': desc = ColliderDesc[shape!](<Float32Array<ArrayBufferLike>>scaledArgs[0], <Uint32Array<ArrayBufferLike>>scaledArgs[1]);break;
      case 'roundConvexHull': desc = <ColliderDesc>ColliderDesc[shape!](<Float32Array<ArrayBufferLike>>scaledArgs[0], <number>scaledArgs[1]);break;
      case 'roundConvexMesh': desc = <ColliderDesc>ColliderDesc[shape!](<Float32Array<ArrayBufferLike>>scaledArgs[0], <Uint32Array<ArrayBufferLike>>scaledArgs[1], <number>scaledArgs[2]);break;
    
      case 'ball': 
        desc = ColliderDesc[shape](<number>scaledArgs[0]);
        // desc = ColliderDesc[shape](scaledArgs[0]);
        // desc = ColliderDesc[shape](...scaledArgs);
      break;
  
      case 'capsule': 
      case 'cylinder': 
      case 'cone': 
        desc = ColliderDesc[shape!](<number>scaledArgs[0], <number>scaledArgs[1]);
        break;
      case 'roundCuboid': 
        desc = ColliderDesc[shape!](<number>scaledArgs[0], <number>scaledArgs[1], <number>scaledArgs[2], <number>scaledArgs[3]);break;
      default: // cuboid, roundCylinder, roundCone
        desc = ColliderDesc[shape!](<number>scaledArgs[0], <number>scaledArgs[1], <number>scaledArgs[2]);
        // desc = ColliderDesc[shape!](0.5, 0.5, 0.5);
        break;
    }
    return this.setColliderDescFromOption(desc, options);
  };


  private setColliderDescFromOption(desc: ColliderDesc, options: any) {
    Object.keys(options).forEach((key: any) =>{
      if(key in ColliderOptions) {
        ColliderOptions[key](desc, options[key]);
      }
    })
    return desc;
  }

  private scaleColliderArgs(
    shape: ColliderShape,
    args: (number | ArrayLike<number> | { x: number; y: number; z: number })[],
    scale: THREE.Vector3
  ) {

    const newArgs = args.slice();
    switch(shape) {
      case 'heightfield': // Heightfield uses a vector
        const s = newArgs[3] as { x: number; y: number; z: number };
        s.x *= scale.x;
        s.x *= scale.y;
        s.x *= scale.z;
  
        return newArgs;
      case 'trimesh':
      case 'convexHull':
        newArgs[0] = this.scaleVertices(newArgs[0] as ArrayLike<number>, scale);
        return newArgs;
      default:
        const scaleArray = [scale.x, scale.y, scale.z, scale.x, scale.x];
        return newArgs.map((arg, index) => scaleArray[index] * (arg as number));
    }
    
  };

  private scaleVertices(vertices: ArrayLike<number>, scale: THREE.Vector3){
    const scaledVerts = Array.from(vertices);
    for (let i = 0; i < vertices.length / 3; i++) {
      scaledVerts[i * 3] *= scale.x;
      scaledVerts[i * 3 + 1] *= scale.y;
      scaledVerts[i * 3 + 2] *= scale.z;
    }

    return scaledVerts;
  };
}


