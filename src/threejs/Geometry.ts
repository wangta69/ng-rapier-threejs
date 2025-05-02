import * as THREE from "three";

export type TgeometyrProps = {type: string, args: number[]}
export type Igeometry = 
  THREE.PlaneGeometry | 
  THREE.BoxGeometry | 
  THREE.SphereGeometry | 
  THREE.CylinderGeometry | 
  THREE.IcosahedronGeometry |
  THREE.TorusKnotGeometry

export class Geometry {
  constructor() {

  }

  public create(params: TgeometyrProps): Igeometry {
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
      case 'plane':
        return new THREE.PlaneGeometry(...params.args);
      default: // box
        return new THREE.BoxGeometry(...params.args);
    }
  }
}