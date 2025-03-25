import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {Light,} from './lib/Light';

interface CameraProps {
  fov?: number, 
  aspect?: number, 
  near?: number, 
  far?:number,
  position?: number[]
}

interface ScreenProps {
  width?: number,
  height?: number
}

interface RendererProps {
  antialias?: boolean, 
  alpha?: boolean
}


interface CameraProps {
  fov: number, 
  aspect: number, 
  near: number, 
  far:number
}

@Injectable({
  providedIn: 'root',
})
export class World {

 
  private container: any;
  public scene = new THREE.Scene();
  private clock = new THREE.Clock();

  public updates:any[] = [];

  private controls!:OrbitControls;
  private helpers!:THREE.GridHelper;

  public renderer!:THREE.WebGLRenderer; // = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
 
  public camera!:THREE.PerspectiveCamera; 
  private screen = {width: 0, height: 0};

  constructor() {}

  public setContainer(container:HTMLElement) {
    this.container = container;
    return this;
  }

  public enableControls(controlProps?:any) {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = controlProps?.damping || false; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.target.z = controlProps?.target.x || 0;
    this.controls.target.y = controlProps?.target.y || 0;
    this.controls.target.z = controlProps?.target.z || 0;
    return this;
  }

<<<<<<< HEAD
  public enableHelpers(helperProps?: any) {
    this.helpers = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    this.helpers.position.x = helperProps.position.x || 0;
    this.helpers.position.y = helperProps.position.y || 0;
    this.helpers.position.z = helperProps.position.z || 0;
    this.scene.add( this.helpers );
    return this;
  }
=======
    this.createCamera(<CameraProps>{});
   
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
>>>>>>> 558feb4026f1da035ae532ffaf81c976968479dc

  public setScreen(screenProps?: ScreenProps) {

    let {width, height} = screenProps || {width: window.innerWidth, height: window.innerWidth};

    width = width || window.innerWidth;
    height = height || window.innerWidth;

    this.screen = {width, height};
    return this;
  }

<<<<<<< HEAD
  public setRenderer(rendererProps: RendererProps) {
    this.renderer = new THREE.WebGLRenderer( rendererProps );
 
=======
  private createRenderer() {
>>>>>>> 558feb4026f1da035ae532ffaf81c976968479dc
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.screen.width, this.screen.height );
    this.container.appendChild( this.renderer.domElement );
    return this;
  }

<<<<<<< HEAD
  public setCamera(cameraProps:CameraProps) {
    let {fov, aspect, near, far} = cameraProps;

    console.log('cameraProp:', fov, aspect, near, far);
=======
  private createCamera({fov, aspect, near, far}:CameraProps) {
>>>>>>> 558feb4026f1da035ae532ffaf81c976968479dc
    fov = fov || 25; // 현재값 : 25
    aspect = aspect || window.innerWidth / window.innerHeight;
    near = near || 0.1; 
    far = far || 200; // 200

    this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far )
    cameraProps.position ? this.camera.position.set( cameraProps.position[0], cameraProps.position[1], cameraProps.position[2] ) : this.camera.position.set( 0, 0, 0 );

    // this.camera.position.set( 0, 0, 100 ); // 0, 0, 200

    return this;
  }

  public onResize() {
    this.setScreen();
    this.renderer.setSize( this.screen.width, this.screen.height ); 
  }
    
  public setLights(lightProps: any) {  
    const light = new Light(lightProps);
    this.scene.add(light.light);
    return this;
  }

  public clear() {
    this.scene.clear();
    return this;
  }

  public render() {

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    if(this.controls) {
      this.controls.update();
    }

    this.updates.forEach((fnc:(body: any) => void)=>{
      fnc({delta, elapsedTime});
    })

    this.renderer.render( this.scene, this.camera );
  }

  public update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }
}