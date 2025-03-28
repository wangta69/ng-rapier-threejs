
import * as THREE from 'three';
export type TobjectProps = 
{
  position: THREE.Vector3, 
  rotation: THREE.Quaternion, 
  scale: THREE.Vector3,
  shape: string,
  args: any[],
  // args: ,
  offset: THREE.Vector3,
}
export class ColliderProps {
  
  /**
   * THREE.Object3D 를 입력받아 shape구성에 필요한 args 및 offset를 가져돈다.
   * @param args = {object3d, collider}
   */
  public create(params: any) {
    const object:THREE.Object3D = params.object3d; //  | THREE.Group
    let _translation = new THREE.Vector3();
    let _rotation = new THREE.Quaternion(); 
    let _scale = new THREE.Vector3(1, 1, 1);
    let _args: any = [];
    let _offset = new THREE.Vector3();

    params.collider = params.collider || {};
    params.body = params.body || {};

    if(!params.collider.args && object) { // 별도의 args가 없는 경우 형태를 자동으로 계산한다.
   
      object.updateWorldMatrix(true, true);
      new THREE.Matrix4()
        .copy(object.matrixWorld)
        .decompose(_translation, _rotation, _scale);

        object.traverse((mesh: any) => {
          if (mesh.type === 'Mesh') {
            const { args, offset } = this.getColliderArgsFromGeometry(
              mesh,
              params.collider.shape
            );
      
            _args.push(...args);
            _offset = offset;
          }
        })
      }
    
    params.collider.args = params.collider.args || _args;
    params.collider.offset = params.collider.offset || _offset;
    params.collider.shape = params.collider.shape || 'cuboid';
    params.collider.scale = params.collider.scale || _scale;
    params.collider.rotation = params.collider.rotation || _rotation;
    params.collider.translation = params.collider.translation || _translation;
    
    params.body.rotation = params.body.rotation || new THREE.Quaternion();
    params.body.translation = params.body.translation || new THREE.Vector3();
  };

  private getColliderArgsFromGeometry(
    mesh: THREE.Mesh,
    shape: string
    ){

    switch (shape) {
      
      case 'ball':
      
      mesh.geometry.computeBoundingSphere();
        const { boundingSphere } = mesh.geometry;
        const radius = boundingSphere!.radius;
        return {
          args: [radius],
          offset: boundingSphere!.center
        };
      case 'trimesh':
      // case 'cylinder':
        const clonedGeometry = mesh.geometry.index
          ? mesh.geometry.clone()
          : this.mergeVertices(mesh.geometry);
        return {
          args: [
            (clonedGeometry.attributes as any).position.array as Float32Array,
            clonedGeometry.index?.array as Uint32Array
          ],
          offset: new THREE.Vector3()
        };
      case 'hull':
      case 'convexHull':
        const g = mesh.geometry.clone();
        return {
          args: [(g.attributes as any).position.array as Float32Array],
          offset: new THREE.Vector3()
        };
      default: //  'cuboid', 'cylinder', cones
      
      mesh.geometry.computeBoundingBox();
        const { boundingBox } = mesh.geometry;

        const size = boundingBox!.getSize(new THREE.Vector3());
        return {
          args: [size.x / 2, size.y / 2, size.z / 2],
          offset: boundingBox!.getCenter(new THREE.Vector3())
        };
    }
  };

  /**
   * @param {BufferGeometry} geometry
   * @param {number} tolerance
   * @return {BufferGeometry>}
   */
  private mergeVertices(geometry: THREE.BufferGeometry, tolerance = 1e-4): THREE.BufferGeometry {
    tolerance = Math.max(tolerance, Number.EPSILON)
  
    const hashToIndex: {
      [key: string]: number
    } = {}
    const indices = geometry.getIndex()
    const positions = geometry.getAttribute('position')
    const vertexCount = indices ? indices.count : positions.count
  
    // next value for triangle indices
    let nextIndex = 0
  
    // attributes and new attribute arrays
    const attributeNames = Object.keys(geometry.attributes)
    const attrArrays: {
      [key: string]: []
    } = {}
    const morphAttrsArrays: {
      [key: string]: Array<Array<THREE.BufferAttribute | THREE.InterleavedBufferAttribute>>
    } = {}
    const newIndices = []
    const getters = ['getX', 'getY', 'getZ', 'getW']
  
    // initialize the arrays
    for (let i = 0, l = attributeNames.length; i < l; i++) {
      const name = attributeNames[i]
  
      attrArrays[name] = []
  
      const morphAttr = geometry.morphAttributes[name]
      if (morphAttr) {
        morphAttrsArrays[name] = new Array(morphAttr.length).fill(0).map(() => [])
      }
    }
  
    // convert the error tolerance to an amount of decimal places to truncate to
    const decimalShift = Math.log10(1 / tolerance)
    const shiftMultiplier = Math.pow(10, decimalShift)
    for (let i = 0; i < vertexCount; i++) {
      const index = indices ? indices.getX(i) : i
  
      // Generate a hash for the vertex attributes at the current index 'i'
      let hash = ''
      for (let j = 0, l = attributeNames.length; j < l; j++) {
        const name = attributeNames[j]
        const attribute = geometry.getAttribute(name)
        const itemSize = attribute.itemSize
  
        for (let k = 0; k < itemSize; k++) {
          // double tilde truncates the decimal value
          // @ts-ignore no
          hash += `${~~(attribute[getters[k]](index) * shiftMultiplier)},`
        }
      }
  
      // Add another reference to the vertex if it's already
      // used by another index
      if (hash in hashToIndex) {
        newIndices.push(hashToIndex[hash])
      } else {
        // copy data to the new index in the attribute arrays
        for (let j = 0, l = attributeNames.length; j < l; j++) {
          const name = attributeNames[j]
          const attribute = geometry.getAttribute(name)
          const morphAttr = geometry.morphAttributes[name]
          const itemSize = attribute.itemSize
          const newarray = attrArrays[name]
          const newMorphArrays = morphAttrsArrays[name]
  
          for (let k = 0; k < itemSize; k++) {
            const getterFunc = getters[k]
            // @ts-ignore
            newarray.push(attribute[getterFunc](index))
  
            if (morphAttr) {
              for (let m = 0, ml = morphAttr.length; m < ml; m++) {
                // @ts-ignore
                newMorphArrays[m].push(morphAttr[m][getterFunc](index))
              }
            }
          }
        }
  
        hashToIndex[hash] = nextIndex
        newIndices.push(nextIndex)
        nextIndex++
      }
    }
  
    // Generate typed arrays from new attribute arrays and update
    // the attributeBuffers
    const result = geometry.clone()
    for (let i = 0, l = attributeNames.length; i < l; i++) {
      const name = attributeNames[i]
      const oldAttribute = geometry.getAttribute(name)
      //@ts-expect-error  something to do with functions and constructors and new
      const buffer = new (oldAttribute.array as TypedArray).constructor(attrArrays[name])
      const attribute = new THREE.BufferAttribute(buffer, oldAttribute.itemSize, oldAttribute.normalized)
  
      result.setAttribute(name, attribute)
  
      // Update the attribute arrays
      if (name in morphAttrsArrays) {
        for (let j = 0; j < morphAttrsArrays[name].length; j++) {
          const oldMorphAttribute = geometry.morphAttributes[name][j]
          //@ts-expect-error something to do with functions and constructors and new
          const buffer = new (oldMorphAttribute.array as TypedArray).constructor(morphAttrsArrays[name][j])
          const morphAttribute = new THREE.BufferAttribute(buffer, oldMorphAttribute.itemSize, oldMorphAttribute.normalized)
          result.morphAttributes[name][j] = morphAttribute
        }
      }
    }
    result.setIndex(newIndices)
    return result
  }
}


