import { Injectable } from '@angular/core';
import * as THREE from "three";

import RAPIER from '@dimforge/rapier3d-compat';
import {Rapier} from './Rapier';
import {ColliderProps} from './ColliderProps';
import {RapierColliderDesc} from './RapierColliderDesc';
import {RapierRigidBody} from './RapierRigidBody';

@Injectable()
export class Body {
  private rapier: Rapier;
  public object3d!: THREE.Object3D; // Mesh;
  public rigidBody!: RAPIER.RigidBody;
  public collider!: RAPIER.Collider;
  // public useFrame = () => {};
  public useFrame!: {(argument:any): void;};
  private eventQueue: RAPIER.EventQueue;

  // private collideCallback!: () => void;
  private onCollisionEnter!: (args?:any) => void;

  constructor(rapier: Rapier) {
    this.rapier = rapier;
    this.eventQueue = new RAPIER.EventQueue(true);
  }

  /**
   * 
   * @param args = {object3d, collider}
   */
  public async create(params: any) {
    this.object3d = params.object3d;

    // 메시를 이용하여 기본적인 정보를 불러온다(position, rotation, scale, args, colliders, offset)
    const colliderProps = new ColliderProps();
    let props;
    if(params.object3d) {
      props = colliderProps.fromMesh(params);
    } else {
      props = colliderProps.fromParams(params);
    }


    console.log('props:', props);
    const rapierColliderDesc = new RapierColliderDesc();
    const colliderDesc: RAPIER.ColliderDesc = <RAPIER.ColliderDesc>rapierColliderDesc.createShapeFromOptions(props);
    

    const rapierRigidBody = new RapierRigidBody()
    const rigidBodyDesc = <RAPIER.RigidBodyDesc>rapierRigidBody.createRigidBodyFromOptions(props);


    this.rigidBody = this.rapier.world.createRigidBody(rigidBodyDesc);
    this.collider = this.rapier.world.createCollider(colliderDesc, this.rigidBody);

    if(params.collider.onCollisionEnter) {
      this.onCollisionEnter = params.collider.onCollisionEnter;
      this.collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
    }

    this.rapier.dynamicBodies.push(this);

    return this.rigidBody;
  }

  public remove() {
    this.rapier.world.removeCollider(this.collider, true)
  }

  public update(time: number) {


    this.object3d.position.copy(this.rigidBody.translation());
    this.object3d.quaternion.copy(this.rigidBody.rotation());

    if(typeof this.onCollisionEnter === 'function') {
      
      // https://github.com/8Observer8/pong-2d-noobtuts-port-rapier2dcompat-webgl-js-the-raw-is-undefined/blob/main/src/index.js
      this.rapier.world.step(this.eventQueue);

      this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
        
        if (started) {
          
          this.rapier.world.narrowPhase.contactPair(handle1, handle2, (manifold, flipped) => {
            const contactFid1 = manifold.contactFid1;
            this.onCollisionEnter();
          });
        }
      });
    }
    if(this.useFrame) {
      this.useFrame({time});
    }
  }
  
}