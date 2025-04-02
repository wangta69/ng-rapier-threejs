import { Injectable } from '@angular/core';
import * as THREE from "three";

import RAPIER from '@dimforge/rapier3d-compat';
import {Rapier} from './Rapier';
import {ColliderProps} from './ColliderProps';
import {RapierColliderDesc} from './RapierColliderDesc';
import {RapierRigidBodyDesc} from './RapierRigidBodyDesc';

@Injectable()
export class Body {
  private rapier: Rapier;
  public object3d!: THREE.Object3D; // Mesh;
  public rigidBody!: RAPIER.RigidBody;
  public collider!: RAPIER.Collider;
  public useFrame!: {(argument:any): void;};
  private eventQueue: RAPIER.EventQueue;

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

    const colliderProps = new ColliderProps();

    // 전달한 params에 추가적인 매개변수를 붙혀서 가져온다.
    colliderProps.create(params);

    const rapierRigidBodyDesc = new RapierRigidBodyDesc()
    const rigidBodyDesc = <RAPIER.RigidBodyDesc>rapierRigidBodyDesc.createRigidBodyFromOptions(params.body);

    this.rigidBody = this.rapier.world.createRigidBody(rigidBodyDesc);

    if(params.collider) {
      console.log('params.collider:', params.collider);
      const rapierColliderDesc = new RapierColliderDesc();
      const colliderDesc: RAPIER.ColliderDesc = <RAPIER.ColliderDesc>rapierColliderDesc.createShapeFromOptions(params.collider);
      this.collider = this.rapier.world.createCollider(colliderDesc, this.rigidBody);
      if(params.collider.onCollisionEnter) {
        this.onCollisionEnter = params.collider.onCollisionEnter;
        this.collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
      }
      
      this.rapier.dynamicBodies.push(this);

    } 
    return this.rigidBody;
  }

  public remove() {
    this.rapier.world.removeCollider(this.collider, true)
  }

  public update(time: number) {

    if(this.object3d) {
      this.object3d.position.copy(this.rigidBody.translation());
      this.object3d.quaternion.copy(this.rigidBody.rotation());
    }

    if(typeof this.onCollisionEnter === 'function') {
      
      this.rapier.world.step(this.eventQueue);
      this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
        
        if (started) {
          console.log('this.collider:', this.collider);
          console.log('handle1:', handle1);
          console.log('handle2:', handle2);
          this.rapier.world.narrowPhase.contactPair(handle1, handle2, (manifold, flipped) => {
            const contactFid1 = manifold.contactFid1;
            const contactFid2 = manifold.contactFid2;

            console.log('manifold:', manifold);
            console.log('manifold.contactFid1:', contactFid1);
            console.log('manifold.contactFid2:', contactFid2);
            console.log('flipped:', flipped);
            // console.log('onCollisionEnter:', this.onCollisionEnter);

            
            this.onCollisionEnter();
          });
        }
      });
    }
    
    if(this.useFrame) {
      // console.log('this.useFrame:', this.useFrame)
      this.useFrame({time});
    }
  }
  
}