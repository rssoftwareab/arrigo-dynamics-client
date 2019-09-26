export interface IDynamicsClientOptions {
  initialObject: any;
  onNewData: (path: string, value: any) => void;
}
