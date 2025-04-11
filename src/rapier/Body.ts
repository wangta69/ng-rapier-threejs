import { Injectable } from '@angular/core';
import * as THREE from "three";

import RAPIER from '@dimforge/rapier3d-compat';
import {Rapier} from './Rapier';
import {ColliderProps} from './ColliderProps';
import {RapierColliderDesc, TcolliderProps} from './RapierColliderDesc';
import {RapierRigidBodyDesc, TrigidBodyProps} from './RapierRigidBodyDesc';
import { ClockProps } from '../public-api';

export type Tcollider = {
  body: TrigidBodyProps,
  collider: TcolliderProps,
  object3d?: any,
}

@Injectable()
export class Body {
  private rapier: Rapier;
  public object3d!: THREE.Object3D; // Mesh;
  public rigidBody!: RAPIER.RigidBody;
  public collider!: RAPIER.Collider;
  public useFrame!: {(argument:any): void;};
  // private eventQueue: RAPIER.EventQueue;

  private onCollisionEnter!: (args?:any) => void;

  constructor(rapier: Rapier) {
    this.rapier = rapier;
    // this.eventQueue = new RAPIER.EventQueue(true);
  }

  /**
   * 
   * @param args = {object3d, collider}
   */
  public async create(params: Tcollider) { // : Promise<Body>

    this.object3d = params.object3d;

    const colliderProps = new ColliderProps();

    // 전달한 params에 추가적인 매개변수를 붙혀서 가져온다.
    colliderProps.create(params);

    const rapierRigidBodyDesc = new RapierRigidBodyDesc()
    const rigidBodyDesc = <RAPIER.RigidBodyDesc>rapierRigidBodyDesc.createRigidBodyFromOptions(params.body);

    if(!this.rapier.world) {
      console.error('rapier world not defined');
    }
    this.rigidBody = this.rapier.world.createRigidBody(rigidBodyDesc);

    if(params.collider) {
      const rapierColliderDesc = new RapierColliderDesc();
      const colliderDesc: RAPIER.ColliderDesc = <RAPIER.ColliderDesc>rapierColliderDesc.createShapeFromOptions(params.collider);
      this.collider = this.rapier.world.createCollider(colliderDesc, this.rigidBody);
     
      if(params.collider.onCollisionEnter) {
        
        this.onCollisionEnter = params.collider.onCollisionEnter;
        this.collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
      }
      
      console.log(this.rigidBody, this.object3d);
      this.rapier.dynamicBodies.push(this);

    } 
    // return this;
  }

  public remove() {
    this.rapier.world.removeCollider(this.collider, true)
  }

  public update(clock: ClockProps) {
    if(this.object3d) {
      this.object3d.position.copy(this.rigidBody.translation());
      this.object3d.quaternion.copy(this.rigidBody.rotation());
    }
    if(typeof this.onCollisionEnter === 'function') {
      // this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      this.rapier.eventQueue.drainCollisionEvents((_, __, started) => {
        if (started) {
          this.onCollisionEnter();
          // this.rapier.world.narrowPhase.contactPair(handle1, handle2, (manifold, flipped) => {
          //   const contactFid1 = manifold.contactFid1;
          //   const contactFid2 = manifold.contactFid2;
          //   this.onCollisionEnter();
          // });
        }
      });
    
    }
    
    if(this.useFrame) {
      this.useFrame(clock);
    }
  }
  
}