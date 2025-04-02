import { Injectable } from '@angular/core';
import {WebGLRenderer, WebGLRendererParameters, ACESFilmicToneMapping, WebGLShadowMap} from "three";


type bindMouse = {
  keydown: any,
  keyup: any,
  mousemove: any,
  wheel: any
}
@Injectable({
  providedIn: 'root',
})
export class EventListener {

  public keyMap: { [key: string]: boolean } = {}
  private bindMouse: bindMouse = {
    keydown: {},
    keyup: {},
    mousemove: {},
    wheel: {}
  }

  public activeClickEvent(renderer: WebGLRenderer) {
    document.addEventListener('click', () => {
      renderer.domElement.requestPointerLock()
    })
  }
 
  public activePointerlockchange(renderer: WebGLRenderer) {
    this.bindMouse.keydown = this.onDocumentKey.bind(this);
    this.bindMouse.keyup = this.onDocumentKey.bind(this);
    this.bindMouse.mousemove = this.onDocumentMouseMove.bind(this);
    this.bindMouse.wheel = this.onDocumentMouseWheel.bind(this);
    
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === renderer.domElement) {
        document.addEventListener('keydown', this.bindMouse.keydown )
        document.addEventListener('keyup', this.bindMouse.keyup)
    
        renderer.domElement.addEventListener('mousemove', this.bindMouse.mousemove)
        renderer.domElement.addEventListener('wheel',  this.bindMouse.wheel)
      } else {
        document.removeEventListener('keydown', this.bindMouse.keydown)
        document.removeEventListener('keyup', this.bindMouse.keyup)
    
        renderer.domElement.removeEventListener('mousemove', this.bindMouse.mousemove)
        renderer.domElement.removeEventListener('wheel',  this.bindMouse.wheel)
      }
    })
  }

  private onDocumentKey(e: KeyboardEvent) {
    console.log('keyDown');
    this.keyMap[e.code] = e.type === 'keydown';
  }

  private onDocumentMouseMove() {
    console.log('onDocumentMouseMove');
  }

  private onDocumentMouseWheel() {
    console.log('onDocumentMouseWheel');
  }

}