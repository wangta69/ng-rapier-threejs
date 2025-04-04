import * as THREE from "three";


export const LightOptions: any = {
  
  // Maximum angle of light dispersion from its direction whose upper bound is Math.PI/2.
  angle: (light:THREE.SpotLight, value: number) => {
    light.angle = value;
  },
 
  castShadow: (light:THREE.Light, value: boolean) => {
    light.castShadow = value;
  },
    // Hexadecimal color of the light. Default 0xffffff (white).
  //  | THREE.SpotLight | THREE.AmbientLight | THREE.DirectionalLight
  color: (light:THREE.Light, value: number) => {
    light.color = new THREE.Color().setHex(value);
    // light.color = value;
  },
  // Maximum range of the light. Default is 0 (no limit). Expects a Float.
  distance: (light:THREE.SpotLight, value: number) => {
    light.distance = value;
  },
  // Numeric value of the light's strength/intensity. Expects a Float. Default 1.
  intensity: (light:THREE.Light, value: number) => {
    light.intensity = value;
  },

   // Percent of the SpotLight cone that is attenuated due to penumbra. Takes values between zero and 1. Expects a Float. Default 0.
  penumbra: (light:THREE.SpotLight, value: number) => { 
    light.penumbra = value;
  },
  position: (light:THREE.Light, value:number[]) => {
    light.position.set(value[0], value[1], value[2]);
    // light.position.set(...value);
  },
}

export const LightShadowOptions: any = {
  blurSamples: (light:THREE.SpotLight, value: number) => {
    light.shadow.blurSamples = value;
  },
  radius: (light:THREE.SpotLight, value: number) => {
    light.shadow.radius = value;
  },
};

export class Light {
  private lightProps: any;
  public light!: THREE.HemisphereLight | THREE.AmbientLight | THREE.DirectionalLight | THREE.PointLight | THREE.SpotLight ;
  public helper!: THREE.HemisphereLightHelper | THREE.DirectionalLightHelper | THREE.PointLightHelper | THREE.SpotLightHelper ;
  constructor(lightProps: any) {
    this.lightProps = lightProps;
    this.create();
    if(lightProps.helper) {
      this.createHelpers();
    }
  }

  private create() {
    switch(this.lightProps.type) {
      case 'ambient':
        this.light = new THREE.AmbientLight();
        break;
      case 'hemisphere':
        this.light = new THREE.HemisphereLight();
        break;
      case 'directional':
        this.light = new THREE.DirectionalLight();
        break;
      case 'point':
        this.light = new THREE.PointLight();
        break;
      case 'spot':
        this.light = new THREE.SpotLight();
        break;
    }

    this.setProperty();
  }

  private setProperty() {

    Object.keys(this.lightProps).forEach((key: any) =>{
      if(key == 'shadow') {
        Object.keys(this.lightProps[key]).forEach((k: any) =>{
          if(k in LightShadowOptions) {
            LightShadowOptions[k](this.light, this.lightProps[key][k]);
          }
        })
      } else {
        if(key in LightOptions) {
          LightOptions[key](this.light, this.lightProps[key]);
        }
      }
    })
  }

  public get() {
    return this.light;
  }

  /**
   * helper 는 별도로 분리 예정
   */
  private createHelpers() {
    switch(this.lightProps.type) {
      // case 'ambient':
      //   this.helper = new THREE.AmbientLightHelper(this.light, 0.1);
      //   break;
      case 'hemisphere':
        this.helper = new THREE.HemisphereLightHelper(<THREE.HemisphereLight>this.light, 0.1);
        break;
      case 'directional':
        this.helper = new THREE.DirectionalLightHelper(<THREE.DirectionalLight>this.light, 0.1);
        break;
      case 'point':
        this.helper = new THREE.PointLightHelper(<THREE.PointLight>this.light, 0.1);
        break;
      case 'spot':
        this.helper = new THREE.SpotLightHelper(<THREE.SpotLight>this.light, 0.1);
        break;
    }
  }
}
