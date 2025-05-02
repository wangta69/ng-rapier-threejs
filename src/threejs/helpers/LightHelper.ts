import {
  AmbientLight,
  HemisphereLightHelper, HemisphereLight, 
  DirectionalLightHelper, DirectionalLight,
  PointLightHelper, PointLight,
  SpotLightHelper, SpotLight,
  ColorRepresentation
} from "three";

export type TLightHelper = HemisphereLightHelper | DirectionalLightHelper | PointLightHelper | SpotLightHelper ;
export type TLight = AmbientLight | HemisphereLight | DirectionalLight | PointLight | SpotLight
type TLightProps = {
  type: string,
  // light: TLight,
  size: number,
  color?:  ColorRepresentation
}
export class LightHelper {

  public helper!: TLightHelper ;

  public create(light: TLight, props: TLightProps) {
    switch(props.type) {
      // case 'ambient':
      //   this.helper = new THREE.AmbientLightHelper(this.light, 0.1);
      //   break;
      case 'hemisphere':
        this.helper = new HemisphereLightHelper(<HemisphereLight>light, props.size);
        break;
      case 'directional':
        this.helper = new DirectionalLightHelper(<DirectionalLight>light, props.size);
        break;
      case 'point':
        this.helper = new PointLightHelper(<PointLight>light, props.size);
        break;
      case 'spot':
        this.helper = new SpotLightHelper(<SpotLight>light, props.size);
        break;
    }

    return this.helper;
  }
}
