# Angular + ThreeJs + Rapier 

## Install
```
npm i ng-rapier-threejs
```
## How to Use

### Sample Source
[GitHub threejs-rapier-angular](https://github.com/wangta69/threejs-rapier-angular)
### SourceCode
```

import {World} from 'ng-rapier-threejs';
..........
export class RapierSample2Component implements AfterViewInit {
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;

  public world:World

  constructor(world: World) {
    this.world = world;
  }

  ngAfterViewInit() {
    let interval = setInterval(() => {
      const domContainer = this.domContainer.nativeElement.offsetHeight;
      if (domContainer) {
        clearInterval(interval);
        this.init();
      }
    }, 10)
  }

  private async init() {
    this.world.clear()
      .setContainer(this.domContainer.nativeElement)
      .setScreen()
      .setCamera({fov:95, near: 0.1, far: 100, position: [0, 2, 5]})
      .setRenderer({antialias: true})
      .setLight({
        type: 'spot',
        intensity: Math.PI * 10,
        angle: Math.PI / 1.8,
        penumbra: 0.5,
        castShadow: true,
        shadow: {blurSamples: 10, radius: 5}
      }).setLight({
        type: 'spot',
        intensity: Math.PI * 10,
        position: [-2.5, 5, 5],
        angle: Math.PI / 1.8,
        penumbra: 0.5,
        castShadow: true,
        shadow: {blurSamples: 10, radius: 5}
      })
      .enableRapier(async (rapier: Rapier) => {
        this.rapier = rapier;
        rapier.init([0.0, -9.81,  0.0]);
        // await rapier.initRapier(0.0, -9.81, 0.0);
        rapier.enableRapierDebugRenderer();
      })
      .enableControls({damping: true, target:{x: 0, y: 1, z: 0}})
      .setGridHelper({position: {x: 0, y: -75, z: 0}})
      .update(); // requestAnimationFrame(this.update)
  }
```

### 다양한 mesh 생성
#### BoxGeometry
##### mesh 및 rapier collider를 각각 생성하여 결합하는 방식
```
const mesh = await new Mesh().create({
  geometry: {type: 'box', args: [50, 1, 50]}, // geometry 속성
  material: {type: 'phong'}, // material 속성
  mesh: {receiveShadow: true}
});

this.world.scene.add(mesh);

// Rapier 생성
const body: Body = new Body(this.rapier);
await body.create({
  body: {type: 'fixed', translation: new THREE.Vector3(0, -1, 0)},
  collider: {shape: 'cuboid', args:[25, 0.5, 25]},
  object3d: mesh // 위에서 생성한 ThreeJs의 mesh를 넣어주면 mesh의 속성(shape, postion, scale등등을 자동으로 처리합니다 )
});
```
##### mesh 및 rapier collider를 한번에 생성하는 방식
> 한번에 생성할 경우는 별도의 scene.add 이 필요없습니다.
```
await this.world.addObject({
  geometry: {type: 'box', args: [50, 1, 50]}, // geometry 속성
  material: {type: 'phong'}, // material 속성
  mesh: {receiveShadow: true},
  rapier: {
    body: {type: 'fixed', translation: new THREE.Vector3(0, -1, 0)},
    collider: {shape: 'cuboid', args:[25, 0.5, 25]},
  }
}, (mesh, body) => {

  });
```

#### SphereGeometry
```
await this.world.addObject({
  geometry: {type: 'sphere'}, // geometry 속성
  material: {type: 'normal'}, // material 속성
  mesh: {receiveShadow: true},
  rapier:{
    body: {type:'dynamic', translation: new THREE.Vector3(-2.5, 5, 0), canSleep: false},
    collider: {shape: 'ball', restitution: 0.5},
  }
});
```
#### CylinderGeometry
```
await this.world.addObject({
  geometry: {type: 'cylinder', args: [1, 1, 2, 16]}, // geometry 속성
  material: {type: 'normal'}, // material 속성
  mesh: {castShadow: true},
  rapier:{
    body: {type:'dynamic', translation: new THREE.Vector3(0, 5, 0), canSleep: false},
    collider: {shape: 'cylinder', mass:1, restitution: 0.5},
  }
});
```

#### IcosahedronGeometry
```
await this.world.addObject({
  geometry: {type: 'icosahedron', args: [1, 0]}, // geometry 속성
  material: {type: 'normal'}, // material 속성
  mesh: {receiveShadow: true},
  rapier:{
    body: {type:'dynamic', translation:new THREE.Vector3(2.5, 5, 0), canSleep: false},
    collider: {shape: 'convexHull', mass:1, restitution: 0.5}
  }
});
```

#### TorusKnotGeometry
```
await this.world.addObject({
  geometry: {type: 'torusknot'}, // geometry 속성
  material: {type: 'normal'}, // material 속성
  mesh: {receiveShadow: true},
  rapier:{
    body: {type:'dynamic', translation:new THREE.Vector3(5, 5, 0)},
    collider: {shape: 'trimesh', mass:1, restitution: 0.5},
  }
});
```
#### TextureLoader
> texture loader 의 경우 material에 textureUrl 을 입력함으로서 자동으로 구현된다.
```
await this.world.addObject({
  material: { textureUrl: 'assets/images/ball.png'}, 
});

```

#### OBJLoader
```
await this.world.addObjectFromObjFile({
    material: {type: 'normal'}, // material 속성
    mesh: {url: '/assets/suzanne.obj', castShadow: true, name: 'Suzanne'},
    rapier:{
      body: {type:'dynamic', translation:new THREE.Vector3(-1, 10, 0)},
    collider: {shape: 'trimesh', mass:1, restitution: 0.5},
    }
  });
}
```
#### GLTFLoader
```
class Car {
  dynamicBodies: any = []
  private game: RapierSample2Component;
  private translation:number[];
  constructor(game: any, translation:number[] = [0, 0, 0]) {
    this.game = game;
    this.translation = translation;
    this.create();

  }

  private async create(){
    
    await new Mesh().loadGLTF({
      url: '/assets/sedanSports.glb',
    }, (gltf:any)=>{
      const carMesh:any = gltf.getObjectByName('body');
      carMesh.position.set(0, 0, 0)
      carMesh.traverse((o: any) => {
        if(o.type === 'Mesh' ) {
          o.castShadow = true;
        }
      })
  
      const wheelBLMesh: any = gltf.getObjectByName('wheel_backLeft')
      const wheelBRMesh: any = gltf.getObjectByName('wheel_backRight')
      const wheelFLMesh: any = gltf.getObjectByName('wheel_frontLeft')
      const wheelFRMesh: any = gltf.getObjectByName('wheel_frontRight')

      this.game.world.scene.add(carMesh, wheelBLMesh,  wheelBRMesh, wheelFLMesh, wheelFRMesh);

      const position = new THREE.Vector3(this.translation[0], this.translation[1], this.translation[2]);
      const carBody: Body = new Body(this.game.rapier);
      carBody.create({ // convexHull trimmesh
        body : {type:'dynamic', translation: position.clone(), canSleep: false},
        collider: { shape: 'convexHull', restitution: 0.5},
        object3d: carMesh // 위에서 생성한 ThreeJs의 mesh를 넣어주면 mesh의 속성(shape, postion, scale등등을 자동으로 처리합니다 )
      });

      const wheelBLBody: Body = new Body(this.game.rapier);
      wheelBLBody.create({ // shape: 'cylinder',
        body : {type:'dynamic', translation: position.clone().add(new THREE.Vector3(-1, 1, 1)), canSleep: false},
        collider: {shape: 'cylinder', args: [0.1, 0.3], restitution: 0.5,
          //  translation: position.clone().add(new THREE.Vector3(-1, 1, 1)),
          translation: new THREE.Vector3(-0.2, 0, 0),
          rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2)
        },
        object3d: wheelBLMesh
      });

      const wheelBRBody: Body = new Body(this.game.rapier);
      wheelBRBody.create({ // shape: 'cylinder',
        body : {type:'dynamic', translation: position.clone().add(new THREE.Vector3(1, 1, 1)), canSleep: false},
        collider: {shape: 'cylinder', args: [0.1, 0.3], restitution: 0.5,
          translation: new THREE.Vector3(0.2, 0, 0),
          rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2)
        },
        object3d: wheelBRMesh
      });

      const wheelFLBody: Body = new Body(this.game.rapier);
      wheelFLBody.create({ // shape: 'cylinder',
        body : {type:'dynamic', translation: position.clone().add(new THREE.Vector3(-1, 1, -1)), canSleep: false},
        collider: {shape: 'cylinder', args: [0.1, 0.3], restitution: 0.5,
          translation: new THREE.Vector3(-0.2, 0, 0),
          rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2)
        },
        object3d: wheelFLMesh
      });

      const wheelFRBody: Body = new Body(this.game.rapier);
      wheelFRBody.create({
        body: {type:'dynamic', translation: position.clone().add(new THREE.Vector3(1, 1, -1)), canSleep: false},
        collider: {shape: 'cylinder', args: [0.1, 0.3], restitution: 0.5,
          translation: new THREE.Vector3(0.2, 0, 0),
          rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2),
        },
        
        object3d: wheelFRMesh
      });

      this.game.rapier.world.createImpulseJoint(
        RAPIER.JointData.revolute(new RAPIER.Vector3(-0.55, 0, 0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(-1, 0, 0)),
        carBody.rigidBody,
        wheelBLBody.rigidBody,
        true
      )

      this.game.rapier.world.createImpulseJoint(
        RAPIER.JointData.revolute(new RAPIER.Vector3(0.55, 0, 0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(1, 0, 0)),
        carBody.rigidBody,
        wheelBRBody.rigidBody,
        true
      )

      this.game.rapier.world.createImpulseJoint(
        RAPIER.JointData.revolute(new RAPIER.Vector3(-0.55, 0, -0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(-1, 0, 0)),
        carBody.rigidBody,
        wheelFLBody.rigidBody,
        true
      )

      this.game.rapier.world.createImpulseJoint(
        RAPIER.JointData.revolute(new RAPIER.Vector3(0.55, 0, -0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(1, 0, 0)),
        carBody.rigidBody,
        wheelFRBody.rigidBody,
        true
      )
    });

  }
}
```
#### addRapierBody
> mesh 없이 rapier body 만 생성할때 사용
```
await this.world.addRapierBody({
  body: {type: 'fixed', additionalMass: 0, translation: [-1, 0.5, 1]},
  collider: {shape: 'cuboid', args:[1 / 2, 1 / 2, 1 / 2]},
});
```

## mesh
### geometry
- type
- - box : BoxGeometry
### material
- type
- - normal : MeshNormalMaterial
- - phong: MeshPhongMaterial
- - standard: MeshStandardMaterial

## Animation
### Three World
- this.world.update(); : three.js 의 world 를 업데이트 합니다.
```
  public render() {
    const clock = {delta: this.clock.getDelta(), elapsedTime:this.clock.getElapsedTime()}
    if(this.controls) {
      this.controls.update();
    }
    this.updates.forEach((fnc:(clock: ClockProps) => void)=>{
      fnc(clock);
    })
    this.renderer.render( this.scene, this.camera );
  }

```

- 추가적인 update를 원할 경우  this.world.updates.push((clock:any)=>{this.update(clock)}); 처럼 사용하면됩니다.

### rapier update
> rapier에서는 생성된 dynamic Body를 자동적으로 업데이트 합니다.
```
private update(clock: ClockProps) {
  ..........

  for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
    this.dynamicBodies[i].update(clock);
  }
}
```

## Additional Animation
> 자동적으로 주어지는 물리적 animation외에 body에 별도의 animation을 적용하기 위해서는 아래와 같이 처리한다. <br>
> useFrame 을 활용한 animation 처리하기
```
await this.world.addObject(obstacle2, (mesh:any, body:any) => {
  if(body) {
    body.useFrame = (clock: any) => {
      const time = clock.elapsedTime;
      const y = -0.3 * Math.sin(1.5 * difficulty * time + timeOffset) + 1.3;
      body.rigidBody.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y- 0.8,
        z: position[2],
      });
    };
  };
});
```

## drainCollisionEvents
```
await this.world.addObject({
  rapier: {
    collider: {
      onCollisionEnter:()=>{}
    },
  }
});
```

## Lensflare
```
import {LensFlare} from 'ng-rapier-threejs'; 
const lensflare = (await new LensFlare()
  .addElement({ texture: { url: 'assets/images/lensflare.png' }, size: 700, distance: 0, color: 0xe61a19 }))
  .get();
```



