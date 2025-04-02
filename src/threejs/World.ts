import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {Light} from './lib/Light';
import {Mesh, Tmesh} from './Mesh';
import {Renderer, RendererProps} from './lib/Renderer';
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

  /**
   * 
   * @param helperProps 
   * @deprecated
   */
  public enableHelpers(helperProps?: any) {
    this.setGridHelper(helperProps)
  }
  public setGridHelper(helperProps?: any) {
    helperProps.args = helperProps.args || [1000, 40, 0x303030, 0x303030];
    this.helpers = new THREE.GridHelper( ...helperProps.args);
    // this.helpers = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    this.helpers.position.x = helperProps.position.x || 0;
    this.helpers.position.y = helperProps.position.y || 0;
    this.helpers.position.z = helperProps.position.z || 0;
    this.scene.add( this.helpers );
    return this;
  }

  public setScreen(screenProps?: ScreenProps) {

    let {width, height} = screenProps || {width: window.innerWidth, height: window.innerWidth};

    width = width || window.innerWidth;
    height = height || window.innerWidth;

    this.screen = {width, height};
    return this;
  }

  /**
   * 
   * @param rendererProps { antialias, alpha }
   * @param params {pixelRatio, size:[],toneMapping, shadowMap }
   * @returns 
   */
  // public setRenderer(rendererProps: RendererProps, property?: any) {
  public setRenderer(rendererProps: any, property?: any) {
    // this.renderer = new THREE.WebGLRenderer( rendererProps ).setProperty();
    property = property || {};
  
    property.size = property.size || [this.screen.width, this.screen.height];
    property.pixelRatio = property.pixelRatio || window.devicePixelRatio;

    const renderer = new Renderer().WebGLRenderer( rendererProps).setProperty(
      property
    );

    this.renderer = renderer.renderer;
    // this.renderer.setPixelRatio( window.devicePixelRatio );
    // this.renderer.setSize( this.screen.width, this.screen.height );
    this.container.appendChild( this.renderer.domElement );
    return this;
  }

  public setCamera(cameraProps:CameraProps) {
    let {fov, aspect, near, far} = cameraProps;

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
    
  /**
   * 
   * @param lightProps 
   * - type: 'spot',
   * - intensity: Math.PI * 10,
   * - angle: Math.PI / 1.8,
   * - penumbra: 0.5,
   * - castShadow: true,
   * -shadow: {blurSamples: 10, radius: 5}
   * @returns 
   */
  // public setLights(lightProps: any) {  
  //   const light = new Light(lightProps);
  //   this.scene.add(light.light);
  //   return this;
  // }

  public setLight(lightProp: any) {  
    const light = new Light(lightProp);
    this.scene.add(light.light);
    if(lightProp.helper) {
      this.scene.add( light.helper );
    }
    return this;
  }

  public setLights(lightProps: any[]) {  
    const holder =  new THREE.Object3D;
    lightProps.forEach((lightProp: any) => {
      const light = new Light(lightProp);
      holder.add( light.light );
      if(lightProp.helper) {
        this.scene.add( light.helper );
      }
    });
    this.scene.add( holder);
    return this;
  }

  public async addMesh(props: Tmesh) {
    const mesh = await new Mesh().create(props);
    this.scene.add(mesh);
    return mesh;
  }

  public clear() {
    this.scene.clear();
    return this;
  }

  public render() {

    // const delta = this.clock.getDelta();
    // const elapsedTime = this.clock.getElapsedTime();
    if(this.controls) {
      this.controls.update();
    }

    this.updates.forEach((fnc:(body: any) => void)=>{
      fnc(this.clock);
    })

    this.renderer.render( this.scene, this.camera );
  }

  public update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }
}