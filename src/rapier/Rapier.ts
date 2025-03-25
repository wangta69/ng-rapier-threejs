import { Injectable } from '@angular/core';
import RAPIER from '@dimforge/rapier3d-compat';
import { World as  ThreeJsWorld} from '../threejs/World';
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
  public dynamicBodies: any[] = [];

  public rapierDebugRenderer!: RapierDebugRenderer;
  /**
   * 
   * @param args 
   */
  constructor(world: ThreeJsWorld) {
    this.threeJsWorld = world;
    // this.rigidBody = rigidBody;
    // st hit = this.world.castRay(ray, 10, false); 
  }

  public async initRapier(x: number, y: number, z: number):Promise<Rapier> { // Promise<Rapier> 

    await RAPIER.init(); // This line is only needed if using the compat version
    this.removeAll();
    
    if(!this.world) {
      const gravity = new RAPIER.Vector3(x, y, z);
      this.world = new RAPIER.World(gravity);
  
      this.threeJsWorld.updates.push((clock:any)=>{this.update(clock)});
    }
    return this;
  }

  public enableRapierDebugRenderer() {
    this.rapierDebugRenderer = new RapierDebugRenderer(this.threeJsWorld.scene, this.world)
    return this;
  }

  private update(clock: any) {
    const delta = clock.delta;
    this.world.timestep = Math.min(delta, 0.1);
    this.world.step();

    for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
<<<<<<< HEAD
      this.dynamicBodies[i].update(clock.elapsedTime);
=======
      if(this.dynamicBodies[i].object3d) {
        this.dynamicBodies[i].object3d.position.copy(this.dynamicBodies[i].rigidBody.translation())
        this.dynamicBodies[i].object3d.quaternion.copy(this.dynamicBodies[i].rigidBody.rotation())
        this.dynamicBodies[i].update(clock.elapsedTime);
      }
>>>>>>> 558feb4026f1da035ae532ffaf81c976968479dc
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


