import { JsonHelper } from "./jsonHelper";
import { Cw2Helper } from "./cw2helper";

export class DynamicsClientOptions {
  type: string;
  initialObject: any;
  onNewData: (path: string, value: any) => void;
}
export class DynamicsClient {
  onCallbacks: {
    [index: string]: Array<(event: string, payload: any) => void>;
  } = {
    error: [],
    data: []
  };
  private context: any = null;
  private options: DynamicsClientOptions;
  private jsonHelper: JsonHelper = new JsonHelper();
  private cw2helper: Cw2Helper = new Cw2Helper();

  initialize(options: DynamicsClientOptions) {
    const opts: DynamicsClientOptions = options || {
      type: "",
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

  patch(path: string, value: any) {
    if (path.indexOf("Cwl.Advise.") !== -1) {
      const paths = this.cw2helper.getPaths(this.context, path);

      paths.map((path: string) => {
        this.jsonHelper.set(this.context, path, value);
      });
      return;
    }
    this.jsonHelper.set(this.context, path, value);
  }
  on(_event: string, _callback: (event: string, payload: any) => void) {
    const listeners = this.onCallbacks[_event];
    if (!listeners) throw new Error("unknown event type " + _event);
    if (listeners.indexOf(_callback) === -1) listeners.push(_callback);
  }
}
