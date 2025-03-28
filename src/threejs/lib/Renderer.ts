import {WebGLRenderer} from "three";


export const RendererOptions: any = {
  pixelRatio: (renderer:WebGLRenderer, value:number) => {
    renderer.setPixelRatio(value);
    
  },
  size: (renderer:WebGLRenderer, value: number[]) => {
    renderer.setSize(value[0], value[1]);
  }
}

export class Renderer {
  private lightProps: any;
  public renderer!: WebGLRenderer;
  constructor(lightProps: any) {
    this.lightProps = lightProps;
  }

  private setProperty(rendererProps: any) {
    Object.keys(rendererProps).forEach((key: any) =>{
      if(key in RendererOptions) {
        // RendererOptions[key](this.light, this.lightProps[key]);
      }
    })
  }
}