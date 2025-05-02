import { AxesHelper } from "three";

export class AxesHelperObj {

  public create(props?: any) {
    const helper = new AxesHelper( 5 );

    return helper;
  }
}
