import { Cw2Helper } from "./cw2helper";
import { IDynamicsClientOptions } from "./IDynamicsClientOptions";
import { JsonHelper } from "./jsonHelper";

export class DynamicsClient {
  public onCallbacks: {
    [index: string]: Array<(event: string, payload: any) => void>;
  } = {
    data: [],
    error: []
  };
  private context: any = null;
  private options: IDynamicsClientOptions;
  private jsonHelper: JsonHelper = new JsonHelper();
  private cw2helper: Cw2Helper = new Cw2Helper();

  public initialize(options: IDynamicsClientOptions) {
    const opts: IDynamicsClientOptions = options || {
      initialObject: {},
      onNewData: null
    };
    this.options = opts;
    this.context = this.options.initialObject;
    this.jsonHelper.onReplace(
      (value: any, currentValue: any, lastObject: any) => {
        this.onCallbacks.data.forEach(cb =>
          cb.apply(this, ["replace", { value, currentValue, lastObject }])
        );
      }
    );
  }

  public patch(path: string, value: any) {
    if (!this.context) {
      throw new Error(
        "No object to patch. Initialize was called without a initialObject or a client object"
      );
    }
    if (path.indexOf(".Advise.") !== -1) {
      const paths = this.cw2helper.getPaths(this.context, path);

      paths.map((p: string) => {
        this.jsonHelper.set(this.context, p, value);
      });
      return;
    }
    this.jsonHelper.set(this.context, path, value);
  }
  public on(event: string, callback: (event: string, payload: any) => void) {
    const listeners = this.onCallbacks[event];
    if (!listeners) {
      throw new Error("unknown event type " + event);
    }
    if (listeners.indexOf(callback) === -1) {
      listeners.push(callback);
    }
  }
}
