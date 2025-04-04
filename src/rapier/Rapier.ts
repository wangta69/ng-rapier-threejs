import { Injectable } from '@angular/core';
import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

import { World as  ThreeJsWorld, ClockProps} from '../threejs/World';
import { Body} from './Body';
import {RapierDebugRenderer} from './RapierDebugRenderer';
// import {RigidBody} from './RigidBody';

@Injectable({
  providedIn: 'root',
})
export class Rapier {
  public world!: RAPIER.World;
  // public rigidBody: RigidBody;
  private threeJsWorld: ThreeJsWorld;
  // public dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = [];
  public dynamicBodies: Body[] = [];
  public eventQueue!: RAPIER.EventQueue;
  public rapierDebugRenderer!: RapierDebugRenderer;
  /**
   * 
   * @param args 
   */
  constructor(world: ThreeJsWorld) {
    this.threeJsWorld = world;
    // this.eventQueue = new RAPIER.EventQueue(true);
    // this.rigidBody = rigidBody;
    // st hit = this.world.castRay(ray, 10, false); 
  }

  public async initRapier(x: number = 0.0, y: number = -9.81, z: number = 0.0):Promise<Rapier> { // Promise<Rapier> 

    await RAPIER.init(); // This line is only needed if using the compat version
    this.removeAll();
    
    if(!this.world) {
      const gravity = new RAPIER.Vector3(x, y, z);
      this.world = new RAPIER.World(gravity);
  
      this.threeJsWorld.updates.push((clock:any)=>{this.update(clock)});
    }

    this.eventQueue = new RAPIER.EventQueue(true);
    
    return this;
  }

  public enableRapierDebugRenderer() {
    this.rapierDebugRenderer = new RapierDebugRenderer(this.threeJsWorld.scene, this.world)
    return this;
  }

  private update(clock: ClockProps) {
    
    this.world.timestep = Math.min(clock.delta, 0.1);    
    // this.world.step();
    this.world.step(this.eventQueue);
    
    for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
      this.dynamicBodies[i].update(clock);
    }

    if(this.rapierDebugRenderer && this.rapierDebugRenderer.enabled) {
      this.rapierDebugRenderer.update();
    }

  }

  private removeAll() {
    for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
      this.dynamicBodies[i].remove();
    }

    this.dynamicBodies = [];
  }
}


