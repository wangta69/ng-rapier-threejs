import {PerspectiveCamera} from "three";
export interface CameraProps {
  [key: string]: number | number[] | undefined;
  fov?: number, 
  aspect?: number, 
  near?: number, 
  far?:number,
  position?: number[]
}

const setProps: {[key: string]: (arg1:PerspectiveCamera, arg2: any)=>void} = {
  position: (camera:PerspectiveCamera, value: number[]) => {
    camera.position.set(...(value as [number, number, number]));
  }
}

export class Camera {
  private camera!:PerspectiveCamera; 
  constructor() {}

  public create(props: CameraProps) {

    let {fov, aspect, near, far} = props;
    
    fov = fov || 25; // 현재값 : 25
    aspect = aspect || window.innerWidth / window.innerHeight;
    near = near || 0.1; 
    far = far || 200; // 200

    this.camera = new PerspectiveCamera( fov, aspect, near, far );
    Object.keys(props).forEach((key: string) =>{
      if(key in setProps) {
        setProps[key](this.camera, props[key]);
      }
    })

    return this;
  }

  public get() {
    return this.camera;
  }


}