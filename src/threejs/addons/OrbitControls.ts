import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {Camera, Vector3} from 'three';
// import {_vector3} from '../lib/constans';
export type TcontrolProps = {
  [key: string]: any;
  dampingFactor?: number, // default 0.05
  enableDamping?: boolean, // default flase
  enableZoom?: boolean, // default false
  minDistance?: number, // default 0
  maxDistance?: number, // default Infinity
  screenSpacePanning?: boolean, // default false
  maxPolarAngle?: number, // default Math.PI
  zoomSpeed?: number, //default 1
  target?: number[]
}

const setProps: {[key: string]: (arg1:OrbitControls, arg2: any)=>void} = {
  dampingFactor: (orbit:OrbitControls, value: number) => {
    orbit.dampingFactor = value;
  },
  enableDamping: (orbit:OrbitControls, value: boolean) => {
    orbit.enableDamping = value;
  },
  enableZoom: (orbit:OrbitControls, value: boolean) => {
    orbit.enableZoom = value;
  },
  minDistance: (orbit:OrbitControls, value: number) => {
    orbit.minDistance = value;
  },
  maxDistance: (orbit:OrbitControls, value: number) => {
    orbit.maxDistance = value;
  },
  screenSpacePanning: (orbit:OrbitControls, value: boolean) => {
    orbit.screenSpacePanning = value;
  },
  maxPolarAngle: (orbit:OrbitControls, value: number) => {
    orbit.maxPolarAngle = value;
  },
  zoomSpeed: (orbit:OrbitControls, value: number) => {
    orbit.zoomSpeed = value;
  },
  target: (orbit:OrbitControls, value: number[]) => {
    orbit.target = new Vector3(...value);
  }
}
export class OrbitControl {
  private controls:OrbitControls; 
  constructor(camera: Camera, domeElement:HTMLElement) {
    this.controls = new OrbitControls(camera, domeElement);
  }

  public setProps(props?: TcontrolProps) {

    if(!props) return this;

    Object.keys(props).forEach((key: string) =>{
      if(key in setProps) {
        setProps[key](this.controls, props[key]);
      }
    })
    return this;
  }

  public update() {
    this.controls.update()
  }
}
