import {WebGLRenderer, WebGLRendererParameters, ACESFilmicToneMapping, WebGLShadowMap} from "three";
export interface RendererProps {
  [key: string]: boolean | undefined;
  antialias?: boolean, 
  alpha?: boolean
}

export interface IRendereProperty {
  [key: string]: any;
  pixelRatio?: number,
  shadowMap?: ShadowMapProps,
  size?: number[],
  toneMapping?: string,
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
export const RendererOptions: {[key: string]: (renderer:WebGLRenderer, value: any) => void}  = {
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

export class Renderer {
  public renderer!: WebGLRenderer;
  constructor() {}

  // public WebGLRenderer(rendererProps: WebGLRendererParameters) {
  public WebGLRenderer(rendererProps: RendererProps) {
    const parameters:RendererProps = {} 

    Object.keys(rendererProps).forEach((key:string) => {
      parameters[key] = rendererProps[key];
    })

    this.renderer = new WebGLRenderer( parameters );
    return this;
  };

  public setProperty(rendererProps: IRendereProperty) {
    Object.keys(rendererProps).forEach((key: string) =>{
      if(key in RendererOptions) {
        RendererOptions[key](this.renderer, rendererProps[key]);
      }
    })

    return this;
  }
}