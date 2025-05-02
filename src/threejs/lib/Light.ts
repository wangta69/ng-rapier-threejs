import {
  Light,
  AmbientLight,
  HemisphereLight, 
  DirectionalLight,
  PointLight,
  SpotLight,
  ColorRepresentation,
  Color,
  Object3D
} from "three";
import {World} from '../World';
import {TLight, LightHelper, TLightHelper} from '../helpers/LightHelper';
export type LightProps = {
  [key: string]: any;
  name?:string,
  type: 'ambient' | 'hemisphere' | 'directional' | 'point' | 'spot', 
  angle?:number,
  castShadow?: boolean,
  color?: number,
  distance?: number,
  intensity?: number,
  penumbra?: number,
  position?:[number, number, number],
  helper?:TLightHelper,
  shadow?: any,
  addtoScene?: boolean,
}

const defaultLightProps: LightProps = {
  type: 'ambient',
  addtoScene: true,
}
export const LightOptions: any = {
  
  // Maximum angle of light dispersion from its direction whose upper bound is Math.PI/2.
  angle: (light:SpotLight, value: number) => {
    light.angle = value;
  },
 
  castShadow: (light:Light, value: boolean) => {
    light.castShadow = value;
  },
    // Hexadecimal color of the light. Default 0xffffff (white).
  //  | SpotLight | AmbientLight | DirectionalLight
  color: (light:Light, value: number) => {
    light.color = new Color().setHex(value);
    // light.color = value;
  },
  // Maximum range of the light. Default is 0 (no limit). Expects a Float.
  distance: (light:SpotLight, value: number) => {
    light.distance = value;
  },
  // Numeric value of the light's strength/intensity. Expects a Float. Default 1.
  intensity: (light:Light, value: number) => {
    light.intensity = value;
  },

   // Percent of the SpotLight cone that is attenuated due to penumbra. Takes values between zero and 1. Expects a Float. Default 0.
  penumbra: (light:SpotLight, value: number) => { 
    light.penumbra = value;
  },
  position: (light:Light, value:number[]) => {
    light.position.set(...(value as [number, number, number]));
    // light.position.set(...value);
  },
}

export const LightShadowOptions: any = {
  blurSamples: (light:SpotLight, value: number) => {
    light.shadow.blurSamples = value;
  },
  radius: (light:SpotLight, value: number) => {
    light.shadow.radius = value;
  },
};

export class LightObj {
  // private lightProps: LightProps;
  public light!: TLight ;
  public helper!: TLightHelper ;
  private world: World;
  public name?:string;

  constructor(world: World) {
    this.world = world;
  }

  /*
  constructor(lightProps: LightProps) {
    this.lightProps = lightProps;
    this.create();
    if(lightProps.helper) {
      this.createHelpers();
    }
  }
  */

  public create(lightProps: LightProps) {
    switch(lightProps.type) {
      case 'ambient':
        this.light = new AmbientLight();
        break;
      case 'hemisphere':
        this.light = new HemisphereLight();
        break;
      case 'directional':
        this.light = new DirectionalLight();
        break;
      case 'point':
        this.light = new PointLight();
        break;
      case 'spot':
        this.light = new SpotLight();
        break;
    }

    this.name = lightProps.name;
    this.setProperty(lightProps);

    this.world.scene.add(this.light);

    if(lightProps.helper) {
      this.createHelpers(lightProps);
    }

   

    return this;
  }

  /**
   * 여러개의 light를 하나의 Object3D에 넣을 경우
   */
  public addToHolder(lightProps: LightProps[]) {

    const holder =  new Object3D;
    lightProps.forEach((lightProp: LightProps) => {
      lightProp.addtoScene = false;
      const lightObj = new LightObj(this.world).create(lightProp);

      holder.add( lightObj.light );
    });
    this.world.scene.add(holder)
  }

  private setProperty(lightProps: LightProps) {
    const props: LightProps = {...defaultLightProps, ...lightProps};
    Object.keys(props).forEach((key: string) =>{
      if(key == 'shadow') {
        Object.keys(props[key]).forEach((k: string) =>{
          if(k in LightShadowOptions) {
            LightShadowOptions[k](this.light, props[key][k]);
          }
        })
      } else {
        if(key in LightOptions) {
          LightOptions[key](this.light, props[key]);
        }
      }
    })
  }

  public get() {
    this.light;
  }

  public remove() {
    this.world.scene.remove(this.light);
  }

  /**
   * helper 는 별도로 분리 예정
   */
  private createHelpers(lightProps: LightProps) {
    this.helper = new LightHelper().create(this.light, {type: lightProps.type, size: 0.1});
    this.world.scene.add(this.helper);
  }
}
