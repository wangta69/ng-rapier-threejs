import {WebGLRenderer, WebGLRendererParameters, ACESFilmicToneMapping, WebGLShadowMap} from "three";
export interface RendererProps {
  antialias?: boolean, 
  alpha?: boolean
}

export interface ShadowMapProps {
  autoUpdate: boolean,
  enabled: boolean,
  needsUpdate: boolean,
}
/*
export const WebGLRendererParametersOptions =  [
  'canvas',
  'context', // Default is null
  'alpha', // default is false.
  'premultipliedAlpha', // default is true.
  'antialias', // default is false.
  'stencil', //  default is false.
  'preserveDrawingBuffer',  //default is false.
  'powerPreference', 
  'depth',  // default is true.
  'failIfMajorPerformanceCaveat',  // default is true.
  'precision', 
  'logarithmicDepthBuffer', // default is true.
  'reverseDepthBuffer',// default is true.
];

*/
export const RendererOptions: any = {
  pixelRatio: (renderer:WebGLRenderer, value:number) => {
    renderer.setPixelRatio(value);
    
  },
  shadowMap: (renderer:WebGLRenderer, value: ShadowMapProps) => {
    Object.keys(value).forEach((key:string) => {
      renderer.shadowMap[key as keyof WebGLShadowMap] = value[key as keyof ShadowMapProps];
    })

  },
  size: (renderer:WebGLRenderer, value: number[]) => {
    renderer.setSize(value[0], value[1]);
  },
  toneMapping: (renderer:WebGLRenderer, value: string) => {
    switch(value) {
      case 'ACESFilmic':
        renderer.toneMapping = ACESFilmicToneMapping;
        break;
    }
  }
}

// class childOfWebGLRendererParameters {
//   id = "";
//   title = "";
//   isDeleted = false;
// }


export class Renderer {
  public renderer!: WebGLRenderer;
  constructor() {}

  // public WebGLRenderer(rendererProps: WebGLRendererParameters) {
  public WebGLRenderer(rendererProps: any) {
    const parameters:any = {} 

    // Object.keys(rendererProps).forEach((key: any) =>{
    //   if(WebGLRendererParametersOptions.indexOf(key) !== -1) {
    //     parameters[key] = rendererProps[key];
    //   }
    // });

    Object.keys(rendererProps).forEach((key:string) => {
      parameters[key] = rendererProps[key];
    })

    this.renderer = new WebGLRenderer( parameters );
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