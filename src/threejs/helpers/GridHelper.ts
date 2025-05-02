
import { GridHelper, ColorRepresentation } from "three";

export type TGrid = {
  [key: string]: any;
  args?: [number, number, ColorRepresentation, ColorRepresentation]
}

const GridOptions: {[key: string]: (grid:GridHelper, value: any) => void} = {
  position: (grid:GridHelper, value:number[]) => {
    grid.position.set(...(value as [number, number, number]));
  },
}

export class GridHelperObj {
  public create(props?: TGrid) {
    props = props || {};
    props.args = props.args || [1000, 40, 0x303030, 0x303030];
    const helper = new GridHelper( ...(props.args as [number, number, ColorRepresentation, ColorRepresentation]) );

    Object.keys(GridOptions).forEach((key: string) =>{

      if(key in GridOptions) {
        GridOptions[key](helper, props[key]);
      }

    })

    return helper;
  }
}
