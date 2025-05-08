import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import {MeshObj, Tmesh} from './Mesh';

import {Renderer, RendererProps, IRendereProperty} from './lib/Renderer';

import {LightObj, LightProps} from './lib/Light';
import {Camera, CameraProps} from './lib/Camera';
import { OrbitControl, TcontrolProps } from './addons/OrbitControls';
import {GridHelperObj, TGrid} from './helpers/GridHelper';
import {AxesHelperObj} from './helpers/AxesHelper';

import {Rapier} from '../rapier/Rapier';
import {Tcollider, Body} from '../rapier/Body';

interface ScreenProps {
  width?: number,
  height?: number
}

export interface ClockProps {
  delta: number, 
  elapsedTime:number
}

export interface Itest {
  mesh: THREE.Mesh | THREE.Object3D<THREE.Object3DEventMap>, 
  body: Body
}

type lightsProps = {
  [key: string]: any; // string| undefined | Light; // key는 문자열, 값은 어떤 타입이든 가능
  key?: string,
  val?: LightObj
}
@Injectable({
  providedIn: 'root',
})
export class World {

  private container!: HTMLElement;
  public scene = new THREE.Scene();
  private clock = new THREE.Clock();

  public updates:any[] = [];

  public lights: lightsProps = {};

  private orbitControls!:OrbitControl;
  private gridHelper!:THREE.GridHelper;

  public renderer!:THREE.WebGLRenderer; // = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
 
  public camera!:THREE.PerspectiveCamera; 
  private screen = {width: 0, height: 0};

  public rapier!:Rapier;

  public gui!:GUI;
  constructor(rapier: Rapier) { // rapier: Rapier
    this.rapier = rapier;
    this.rapier.threeJsWorld = this;
  }

  public setContainer(container:HTMLElement) {
    this.container = container;
    return this;
  }

  public enableControls(controlProps?:TcontrolProps) {
    this.orbitControls = new OrbitControl(this.camera, this.renderer.domElement)
    .setProps(controlProps);
    return this;
  }

  public enableGui() {
    this.gui = new GUI();

    return this;
  }
  /**
   * 
   * @param helperProps 
   * @deprecated
   */
  public enableHelpers(helperProps?: TGrid) {
    this.setGridHelper(helperProps);
    return this;
  }


  public setGridHelper(helperProps?: TGrid) {
    this.gridHelper = new GridHelperObj().create(helperProps);
    this.scene.add( this.gridHelper );
    return this;
  }

  /**
   * X축은 빨간색입니다. Y축은 녹색입니다. Z축은 파란색입니다.
   */
  public setAxesHelper() {
    const axesHelper = new AxesHelperObj().create();
    this.scene.add( axesHelper );
    return this;
  }

  /**
   * Set screen width and height, default is window.innerWidth, window.innerHeight
   * @param screenProps 
   * @returns World
   */
  public setScreen(screenProps?: ScreenProps): World {
    let {width, height} = screenProps || {width: window.innerWidth, height: window.innerHeight};
    width = width || window.innerWidth;
    height = height || window.innerHeight;

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
  public setRenderer(rendererProps: RendererProps, property?: IRendereProperty) {
    // this.renderer = new THREE.WebGLRenderer( rendererProps ).setProperty();
    property = property || {};
  
    property.size = property.size || [this.screen.width, this.screen.height];
    property.pixelRatio = property.pixelRatio || window.devicePixelRatio;

    const renderer = new Renderer().WebGLRenderer( rendererProps).setProperty(
      property
    );

    this.renderer = renderer.renderer;
    this.container.appendChild( this.renderer.domElement );
    return this;
  }

  public setCamera(cameraProps:CameraProps) {
    this.camera = new Camera().create(cameraProps).get();
    return this;
  }

  public onResize() {
    this.setScreen();
    this.renderer.setSize( this.screen.width, this.screen.height ); 
    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix()
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

  public setLight(lightProp: LightProps, callback?:(light: LightObj)=>void) {  
    const lightObj = new LightObj(this).create(lightProp);
    if(lightProp.name) { //  외부에서 다시 호출가능하게 정의  this.world.lights[name]
      this.lights[lightProp.name] = lightObj;
    }
    
    if(callback) {
      callback(lightObj);
    }
    return this;
  }

  public setLights(lightProps: LightProps[]) {  
    const light = new LightObj(this).addToHolder(lightProps);
    return this;
  }

  public clear() {
    this.scene.clear();
    return this;
  }

  public render() {
   
    const clock = {delta: this.clock.getDelta(), elapsedTime:this.clock.getElapsedTime()}

    if(this.orbitControls) {
      this.orbitControls.update();
    }

    this.updates.forEach((fnc:(clock: ClockProps) => void)=>{
      fnc(clock);
    })

    this.renderer.render( this.scene, this.camera );
  }

  public update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
    return this;
  }

  public enableRapier(callback:(rapier: Rapier)=>void) {
    // this.rapier = new Rapier(this);
    this.rapier.threeJsWorld = this;
    callback(this.rapier);
    return this;
  }

  /**
 * 
 * @param props 
 * @param callback 
 * @returns 
 * @deprecated  use addObject
 */
  public async addMesh(props: Tmesh) {
    const meshObj = await new MeshObj(this).create(props);
    this.scene.add(meshObj.mesh);
    return meshObj;
  }

  /**
   * create threejs mesh and rapier body same time
   * @param props 
   * @param callback 
   * @returns 
   */
  public async addObject(props: Tmesh, callback?:(meshObj?:MeshObj, body?:Body)=>void) {
    const meshObj = await new MeshObj(this).create({geometry: props.geometry, material: props.material, mesh: props.mesh});

    this.scene.add(meshObj.mesh);
    let body:Body;
    if(props.rapier) {
      props.rapier.object3d = meshObj.mesh;
      body = await this.rapier.createBody(props.rapier);

      if(callback) {
        callback(meshObj, body);
      }
    } else {
      if(callback) {
        callback(meshObj);
      }
    }
    return this;
  }

  public async addObjectFromObjFile(props: Tmesh, callback?:(meshObj?:MeshObj | THREE.Object3D<THREE.Object3DEventMap>, body?:Body)=>void) {
    const meshObj = await new MeshObj(this).loadObj(props);

    this.scene.add(meshObj.mesh);
    let body;
    if(props.rapier) {
      props.rapier.object3d = meshObj.mesh;
      body = await this.rapier.createBody(props.rapier);
    }

    this.scene.add(meshObj.mesh);
    if(callback) {
      callback(meshObj, body);
    }
    return this;
  }

  public async addObjectFromGLTF(props: any, callback?:(obj:{
    mesh: THREE.Mesh | THREE.Object3D<THREE.Object3DEventMap>, 
    body?: Body
  }[]) =>void) {
    const obj:{mesh:THREE.Mesh | THREE.Object3D<THREE.Object3DEventMap>, body?:Body}[] = [];
    const MeshClass = new MeshObj(this);
    await MeshClass.loadGLTF(props, async (gltf) => {

      for(let i=0; i < props.props.length; i++) {
        const prop = props.props[i];

        let mesh:THREE.Mesh;
        if(prop.name) {
          mesh = <THREE.Mesh>gltf.getObjectByName(prop.name);
        } else {
          mesh = <THREE.Mesh>gltf.getObject();
        }

        mesh.traverse((m:any) => {
          if(prop.receiveShadow) {
            m.receiveShadow = true
          }
        });


        this.scene.add(mesh);
        let body:Body | undefined = undefined;
        if(prop.rapier) {
          prop.rapier.object3d = mesh;
          body = await this.rapier.createBody(prop.rapier);
        }

        obj.push({mesh, body});

      }
      if(callback) {
        callback(obj);
      }
      
    });
  }


  /**
   * crete only rapier body
   * @param props 
   * @param callback 
   * @returns 
   */
  public async addRapierBody(props:Tcollider, callback?:(body:Body)=>void) {
    const body = await this.rapier.createBody(props);
    if(callback) {
      callback(body);
    }
    return this;
  }


  // public gui() {
  //   const gui = new GUI();
  //   const physicsFolder = gui.addFolder('OrbitControls')
  //   physicsFolder.add(this.controls, 'enableDamping');
  //   physicsFolder.add(this.controls, 'dampingFactor', 0, 1, 0.01);
  //   physicsFolder.add(this.controls, 'minDistance', 0, 10, 1);
  //   physicsFolder.add(this.controls, 'maxDistance', 0, 1000, 1);
  //   physicsFolder.add(this.controls, 'maxPolarAngle', 0, Math.PI, 0.1);
  //   physicsFolder.add(this.controls, 'zoomSpeed', 0.1, 10, 0.1);
  // }
}