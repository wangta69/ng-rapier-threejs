import * as THREE from "three";

export class Geometry {
  constructor() {

  }

  public create(params: any): 
    THREE.BoxGeometry | 
    THREE.SphereGeometry | 
    THREE.CylinderGeometry | 
    THREE.IcosahedronGeometry |
    THREE.TorusKnotGeometry {
    // let geometry: THREE.BoxGeometry | THREE.SphereGeometry | THREE.CylinderGeometry | THREE.IcosahedronGeometry;
    switch(params.type) {
      // case 'box':
      //   // this.geometry = new THREE.BoxGeometry(args.width, args.height, args.depth);
      //   return new THREE.BoxGeometry(...params.args);
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