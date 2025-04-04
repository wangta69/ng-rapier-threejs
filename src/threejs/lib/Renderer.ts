import {WebGLRenderer, WebGLRendererParameters, ACESFilmicToneMapping, WebGLShadowMap} from "three";
// import { keys } from 'ts-transformer-keys';
export interface RendererProps {
  antialias?: boolean, 
  alpha?: boolean
}


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


export const RendererOptions: any = {
  pixelRatio: (renderer:WebGLRenderer, value:number) => {
    renderer.setPixelRatio(value);
    
  },
  shadowMap: (renderer:WebGLRenderer, value: WebGLShadowMap) => {

    renderer.shadowMap = value;
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

class childOfWebGLRendererParameters {
  id = "";
    title = "";
    isDeleted = false;
}


export class Renderer {
  public renderer!: WebGLRenderer;
  constructor() {
   
  }

  // public WebGLRenderer(rendererProps: WebGLRendererParameters) {
  public WebGLRenderer(rendererProps: any) {
    // const parameters:WebGLRendererParameters = {} 
    const parameters:any = {} 
    // const keysOfProps = keys<WebGLRendererParameters>();
    // type FieldList = keyof WebGLRendererParameters;



    Object.keys(rendererProps).forEach((key: any) =>{


      if(WebGLRendererParametersOptions.indexOf(key) !== -1) {
        parameters[key] = rendererProps[key];
      }
    });
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