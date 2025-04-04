import * as THREE from "three";

export type IGeometry = 
  THREE.BoxGeometry | 
  THREE.SphereGeometry | 
  THREE.CylinderGeometry | 
  THREE.IcosahedronGeometry |
  THREE.TorusKnotGeometry

export class Geometry {
  constructor() {

  }

  public create(params: any): IGeometry {
    // let geometry: THREE.BoxGeometry | THREE.SphereGeometry | THREE.CylinderGeometry | THREE.IcosahedronGeometry;
    switch(params.type) {
      case 'sphere':
        return new THREE.SphereGeometry(...params.args);
      case 'cylinder':
        return new THREE.CylinderGeometry(...params.args);
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(...params.args);
      case 'torusknot':
        return new THREE.TorusKnotGeometry(...params.args);
      default: // box
        return new THREE.BoxGeometry(...params.args);
    }
  }
}