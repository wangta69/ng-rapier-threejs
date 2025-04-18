import { Injectable } from '@angular/core';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {Light} from './lib/Light';
import {Mesh, Tmesh, Tobj} from './Mesh';
import {Renderer, RendererProps} from './lib/Renderer';
import {Rapier} from '../rapier/Rapier';
import {Tcollider, Body} from '../rapier/Body';
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

export interface ClockProps {
  delta: number, 
  elapsedTime:number
}

export interface Itest {
  mesh: THREE.Mesh | THREE.Object3D<THREE.Object3DEventMap>, 
  body: Body
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

  public rapier!:Rapier;
  constructor(rapier: Rapier) { // rapier: Rapier
    this.rapier = rapier;
  }

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
    this.helpers.position.x = helperProps.position?.x || 0;
    this.helpers.position.y = helperProps.position?.y || 0;
    this.helpers.position.z = helperProps.position?.z || 0;
    this.scene.add( this.helpers );
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

  public setLight(lightProp: any, callback?:(light: Light)=>void) {  
    const light = new Light(lightProp);
    this.scene.add(light.light);
    
    if(lightProp.helper) {
      this.scene.add( light.helper );
    }
    if(callback) {
      callback(light);
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

  public clear() {
    this.scene.clear();
    return this;
  }

  public render() {
   
    const clock = {delta: this.clock.getDelta(), elapsedTime:this.clock.getElapsedTime()}

    if(this.controls) {
      this.controls.update();
    }

    this.updates.forEach((fnc:(clock: ClockProps) => void)=>{

      fnc(clock);
    })

    this.renderer.render( this.scene, this.camera );
  }

  public update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
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
    const mesh:THREE.Mesh = await new Mesh().create(props);
    this.scene.add(mesh);
    return mesh;
  }

  /**
   * create threejs mesh and rapier body same time
   * @param props 
   * @param callback 
   * @returns 
   */
  public async addObject(props: Tmesh, callback?:(mesh?:THREE.Mesh, body?:Body)=>void) {
    const mesh:THREE.Mesh = await new Mesh().create({geometry: props.geometry, material: props.material, mesh: props.mesh});

    this.scene.add(mesh);
    let body:Body;
    if(props.rapier) {
      props.rapier.object3d = mesh;
      body = await this.rapier.createBody(props.rapier);

      if(callback) {
        callback(mesh, body);
      }
    } else {
      if(callback) {
        callback(mesh);
      }
    }
    return this;
  }

  public async addObjectFromObjFile(props: Tobj, callback?:(mesh?:THREE.Mesh | THREE.Object3D<THREE.Object3DEventMap>, body?:Body)=>void) {
    const mesh = await new Mesh().loadObj(props);

    this.scene.add(mesh);
    let body;
    if(props.rapier) {
      props.rapier.object3d = mesh;
      body = await this.rapier.createBody(props.rapier);
    }

    this.scene.add(mesh);
    if(callback) {
      callback(mesh, body);
    }
    return this;
  }

  /**
   * 
   * @param props {url, [{name, props},..]}
   */
  /*
  public async addObjectFromGLTF(props: any, callback?:(mesh?:THREE.Mesh | THREE.Object3D<THREE.Object3DEventMap>, body?:Body)=>void) {
    await new Mesh().loadGLTF(props, async (gltf) => {
      const mesh = <THREE.Mesh>gltf.getObjectByName('Cylinder');
      if(mesh) {
        mesh.traverse((m) => {
          m.receiveShadow = true
        });
      }

      this.scene.add(mesh);
      let body;
      if(props.rapier) {
        props.rapier.object3d = mesh;
        body = await this.rapier.createBody(props.rapier);
      }

      if(callback) {
        callback(mesh, body);
      }
    });
  }
*/
  // public async addObjectFromGLTF(props: any, callback?:(mesh:THREE.Mesh | THREE.Object3D<THREE.Object3DEventMap>, body?:Body)=>void) {
  // public async addObjectFromGLTF(props: any, callback?:(obj:Itest[]) =>void) {
  public async addObjectFromGLTF(props: any, callback?:(obj:{
    mesh: THREE.Mesh | THREE.Object3D<THREE.Object3DEventMap>, 
    body?: Body
  }[]) =>void) {


    const obj:{mesh:THREE.Mesh | THREE.Object3D<THREE.Object3DEventMap>, body?:Body}[] = [];
    const MeshClass = new Mesh();
    await MeshClass.loadGLTF(props, async (gltf) => {

      for(let i=0; i < props.props.length; i++) {
        const prop = props.props[i];

        let mesh:any;
        if(prop.name) {
          mesh = <THREE.Mesh>gltf.getObjectByName(prop.name);
        } else {
          mesh = <THREE.Mesh>gltf.getObject();
        }
        if(mesh) {
          mesh.traverse((m:any) => {
            if(prop.receiveShadow) {
              m.receiveShadow = true
            }
          });
        }

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
}