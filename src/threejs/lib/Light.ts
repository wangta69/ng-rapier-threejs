import * as THREE from "three";


export const LightOptions: any = {
  position: (light:THREE.Light, value:number[]) => {
    light.position.set(value[0], value[1], value[2]);
  },
  // Maximum angle of light dispersion from its direction whose upper bound is Math.PI/2.
  angle: (light:THREE.SpotLight, value: number) => {
    light.angle = value;
  },
  // Percent of the SpotLight cone that is attenuated due to penumbra. Takes values between zero and 1. Expects a Float. Default 0.
  penumbra: (light:THREE.SpotLight, value: number) => { 
    light.penumbra = value;
  },
  castShadow: (light:THREE.SpotLight, value: boolean) => {
    light.castShadow = value;
  },
  // Numeric value of the light's strength/intensity. Expects a Float. Default 1.
  intensity: (light:THREE.SpotLight, value: number) => {
    light.intensity = value;
  },
  // Hexadecimal color of the light. Default 0xffffff (white).
  color: (light:THREE.SpotLight, value: THREE.Color) => {
    light.color = value;
  },
  // Maximum range of the light. Default is 0 (no limit). Expects a Float.
  distance: (light:THREE.SpotLight, value: number) => {
    light.distance = value;
  }
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
  public light!: THREE.SpotLight | THREE.AmbientLight | THREE.DirectionalLight;
  constructor(lightProps: any) {
    this.lightProps = lightProps;
    this.create();
  }

  private create() {
    switch(this.lightProps.type) {
      case 'spot':
        this.light = new THREE.SpotLight();
        break;
      case 'ambient':
        this.light = new THREE.AmbientLight();
        break;
      case 'directional':
        this.light = new THREE.DirectionalLight();
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
}