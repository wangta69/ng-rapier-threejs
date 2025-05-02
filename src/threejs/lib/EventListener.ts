import { Injectable } from '@angular/core';
import {WebGLRenderer} from "three";

type BindEvent = {
  keydown: any,
  keyup: any,
  mousemove: any,
  wheel: any,
  click: any
}

@Injectable({
  providedIn: 'root',
})
export class EventListener {

  public keyMap: { [key: string]: boolean } = {}
  public key: string = '';
  private bindEvent: BindEvent = {
    keydown: {},
    keyup: {},
    mousemove: {},
    wheel: {},
    click: {}
  }

  public onMouseMove: any[] = []; // {document: fn}
  public onMouseWheel: any[] = [];
  public onMouseClick: any[] = [];
  public windowResize: any[] = [];

  public activeMouseMove(renderer: WebGLRenderer) {
    document.addEventListener('click', () => {
      renderer.domElement.requestPointerLock()
    })
  }

  public activeWindowResize() {
    window.addEventListener('resize', () => {
      this.windowResize.forEach(fn =>{
        fn.bind(this)();
      });
    })
  }

  // public activeMouseWhee(renderer: WebGLRenderer) {
  //   document.addEventListener('click', () => {
  //     renderer.domElement.requestPointerLock()
  //   })
  // }
  // Keyboard event
  public enableKeybordEvent() {
    this.bindEvent.keydown = this.onDocumentKey.bind(this);
    this.bindEvent.keyup = this.onDocumentKey.bind(this);
    document.addEventListener('keydown', this.bindEvent.keydown );
    document.addEventListener('keyup', this.bindEvent.keyup);
  }

  public disableKeyboardEvent() {
    document.removeEventListener('keydown', this.bindEvent.keydown);
    document.removeEventListener('keyup', this.bindEvent.keyup);
  }

  // MouseEvent
  public enableMouseClickEvent(renderer: WebGLRenderer) {
    this.bindEvent.click = this.onRendererMouseClick.bind(this);

    renderer.domElement.addEventListener('click', this.bindEvent.click);
  }

  public enableMouseEvent(renderer: WebGLRenderer) {
    this.bindEvent.mousemove = this.onDocumentMouseMove.bind(this);
    this.bindEvent.wheel = this.onDocumentMouseWheel.bind(this);
    renderer.domElement.addEventListener('mousemove', this.bindEvent.mousemove);
    renderer.domElement.addEventListener('wheel',  this.bindEvent.wheel);
  }

  public disableMouseEvent(renderer: WebGLRenderer) {
    renderer.domElement.removeEventListener('mousemove', this.bindEvent.mousemove);
    renderer.domElement.removeEventListener('wheel',  this.bindEvent.wheel);
  }

  public activeClickEvent(renderer: WebGLRenderer) {
    document.addEventListener('click', () => {
      renderer.domElement.requestPointerLock()
    })
  }

  public activePointerlockchange(renderer: WebGLRenderer) {
    
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === renderer.domElement) {
        this.enableKeybordEvent()
        this.enableMouseEvent(renderer);
      } else {
        this.disableKeyboardEvent();
        this.disableMouseEvent(renderer);
      }
    })
  }

  private onDocumentKey(e: KeyboardEvent) {
    this.keyMap[e.code] = e.type === 'keydown';
    this.key = e.type === 'keydown' ? e.code: '';
  }

  private onRendererMouseClick(e: MouseEvent) {
    this.onMouseClick.forEach(fn =>{
      fn.bind(this)(e);
    } )
  }

  private onDocumentMouseMove(e: MouseEvent) {
    this.onMouseMove.forEach(fn =>{
      fn.renderer.bind(this)(e);
    } )
  }

  private onDocumentMouseWheel(e: MouseEvent) {
    this.onMouseWheel.forEach(fn =>{
      fn.renderer.bind(this)(e);
    } )
  }

  /**
   * 
   * @param fn {document | renderer: fn}
   */
  public addMouseMoveEvent(fn: any) {
    this.onMouseMove.push(fn);
  }

  public addMouseClickEvent(fn: any) {
    this.onMouseMove.push(fn);
  }

  /**
   * 
   * @param fn {document | renderer: fn}
   */
  public addMouseWeelEvent(fn: any) {
    this.onMouseWheel.push(fn);
  }

  public addWindowResize(fn: any) {
    this.windowResize.push(fn);
  }

}