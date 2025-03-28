
import * as THREE from "three";
import {
  RigidBodyDesc,
} from "@dimforge/rapier3d-compat";

export type RigidBodyTypeString =
  | "fixed"
  | "dynamic"
  | "kinematicPosition"
  | "kinematicVelocity";

  const rigidBodyTypeMap = {
    fixed: 1,
    dynamic: 0,
    kinematicPosition: 2,
    kinematicVelocity: 3
  } as const;

/*
setAdditionalMassProperties(mass: number, centerOfMass: Vector, principalAngularInertia: Vector, angularInertiaLocalFrame: Rotation): RigidBodyDesc;
enabledTranslations(translationsEnabledX: boolean, translationsEnabledY: boolean, translationsEnabledZ: boolean): RigidBodyDesc;
restrictTranslations(translationsEnabledX: boolean, translationsEnabledY: boolean, translationsEnabledZ: boolean): RigidBodyDesc;
lockTranslations(): RigidBodyDesc;
enabledRotations(rotationsEnabledX: boolean, rotationsEnabledY: boolean, rotationsEnabledZ: boolean): RigidBodyDesc;
restrictRotations(rotationsEnabledX: boolean, rotationsEnabledY: boolean, rotationsEnabledZ: boolean): RigidBodyDesc;
lockRotations(): RigidBodyDesc;
*/

const RigidBodyOptions: any = {
  additionalMass: (rigidbody:RigidBodyDesc, value: number) => {
    rigidbody.setAdditionalMass(value);
  },
  additionalSolverIterations: (rigidbody:RigidBodyDesc, value: number) => {
    rigidbody.setAdditionalSolverIterations(value);
  },
  angularDamping: (rigidbody:RigidBodyDesc, value: number) => {
    rigidbody.setAngularDamping(value);
  },
  angvel: (rigidbody:RigidBodyDesc, value: THREE.Vector3) => {
    rigidbody.setAngvel(value);
  },
  canSleep: (rigidbody:RigidBodyDesc, value: boolean) => {
    rigidbody.setCanSleep(value);
  },
  ccdEnabled: (rigidbody:RigidBodyDesc, value: boolean) => {
    rigidbody.setCcdEnabled(value);
  },
  dominanceGroup: (rigidbody:RigidBodyDesc, value: number) => {
    rigidbody.setDominanceGroup(value);
  },
  enabled: (rigidbody:RigidBodyDesc, value: boolean) => {
    rigidbody.setEnabled(value);
  },
  gravityScale: (rigidbody:RigidBodyDesc, value: number) => {
    rigidbody.setGravityScale(value);
  },
  linearDamping: (rigidbody:RigidBodyDesc, value: number) => {
    rigidbody.setLinearDamping(value);
  },
  linvel: (rigidbody:RigidBodyDesc, value: THREE.Vector3) => {
    rigidbody.setLinvel(value.x,  value.y, value.z);
  },
  rotation: (rigidbody:RigidBodyDesc, value: THREE.Quaternion ) => {
    rigidbody.setRotation(value);
  },
  sleeping: (rigidbody:RigidBodyDesc, value: boolean) => {
    rigidbody.setSleeping(value);
  },
  softCcdPrediction: (rigidbody:RigidBodyDesc, value: number) => {
    rigidbody.setSoftCcdPrediction(value);
  },
  translation: (rigidbody:RigidBodyDesc, value: THREE.Vector3) => {
    rigidbody.setTranslation(value.x,  value.y, value.z);
  },

  userData: (rigidbody:RigidBodyDesc, value: any ) => {
    rigidbody.setUserData(value);
  },
};

export class RapierRigidBodyDesc {

  constructor() {}

  public createRigidBodyFromOptions(options: any): RigidBodyDesc | null {
    const type = this.rigidBodyTypeFromString(options?.type || "dynamic");
    const desc = new RigidBodyDesc(type);
    return this.setRigidBodyDescFromOption(<RigidBodyDesc>desc, options);
  };

  private rigidBodyTypeFromString(type: RigidBodyTypeString){
    return rigidBodyTypeMap[type];
  }
  
  private setRigidBodyDescFromOption(desc: RigidBodyDesc, options: any) {
    Object.keys(options).forEach((key: any) =>{
      if(key in RigidBodyOptions) {
        RigidBodyOptions[key](desc, options[key]);
      }
    })
    return desc;
  }
}


