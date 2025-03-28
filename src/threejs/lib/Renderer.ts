import {WebGLRenderer} from "three";

export interface RendererProps {
  antialias?: boolean, 
  alpha?: boolean
}


export const RendererOptions: any = {
  pixelRatio: (renderer:WebGLRenderer, value:number) => {
    renderer.setPixelRatio(value);
    
  },
  size: (renderer:WebGLRenderer, value: number[]) => {
    renderer.setSize(value[0], value[1]);
  }
}

export class Renderer {
  public renderer!: WebGLRenderer;
  constructor() {
   
  }

  public WebGLRenderer(rendererProps: RendererProps) {
    this.renderer = new WebGLRenderer( rendererProps );
    return this;
  };

  public setProperty(rendererProps: any) {
    Object.keys(rendererProps).forEach((key: any) =>{
      if(key in RendererOptions) {
        RendererOptions[key](this.renderer, rendererProps[key]);
      }
    })

    return this;
  }
}