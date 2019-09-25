import { ISetter } from "./ISetter";
type OnReplaceFunction = (
  value: any,
  currentValue: any,
  lastObject: any
) => void;
export class JsonHelper implements ISetter {
  private _onReplace: OnReplaceFunction;

  private find(
    obj: any,
    path: string | Array<string>,
    value: any = undefined
  ): any {
    const parts: Array<string> =
      typeof path === "string" ? path.split(".") : path;
    const key: string = parts[0];
    //check if part is key
    const keys: Array<string> = key.split("[");
    let lastKey = keys[0];
    //find target
    let target = obj;
    let lastObject = obj;
    keys.forEach((key: string): any => {
      if (key.indexOf("]") !== -1) {
        key = key.split("]")[0];
      }
      lastKey = key;
      lastObject = target;
      target = target[key];
    });
    if (parts.length === 1) {
      if (value) {
        this._onReplace &&
          this._onReplace.apply(this, [value, lastObject[lastKey], lastObject]);
        lastObject[lastKey] = value;
      }
      return target;
    } else return this.find(target, parts.slice(1), value);
  }

  get(obj: any, path: string) {
    return this.find(obj, path);
  }
  set(obj: any, path: string, value: any) {
    return this.find(obj, path, value); //setvalue.
  }
  onReplace(replacer: OnReplaceFunction) {
    this._onReplace = replacer;
  }
}
