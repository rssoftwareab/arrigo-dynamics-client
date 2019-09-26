type OnReplaceFunction = (
  value: any,
  currentValue: any,
  lastObject: any
) => void;
export class JsonHelper {
  private onReplaceCallback: OnReplaceFunction;

  public get(obj: any, path: string) {
    return this.find(obj, path);
  }
  public set(obj: any, path: string, value: any) {
    return this.find(obj, path, value); // setvalue.
  }
  public onReplace(replacer: OnReplaceFunction) {
    this.onReplaceCallback = replacer;
  }

  private find(obj: any, path: string | string[], value?: any): any {
    const parts: string[] = typeof path === "string" ? path.split(".") : path;
    const key: string = parts[0];
    // check if part is key
    const keys: string[] = key.split("[");
    let lastKey = keys[0];
    // find target
    let target = obj;
    let lastObject = obj;
    keys.forEach((k: string): any => {
      if (k.indexOf("]") !== -1) {
        k = k.split("]")[0];
      }
      lastKey = k;
      lastObject = target;
      target = target[k];
    });
    if (parts.length === 1) {
      if (value && this.onReplaceCallback) {
        this.onReplaceCallback.apply(this, [
          value,
          lastObject[lastKey],
          lastObject
        ]);
        lastObject[lastKey] = value;
      }
      return target;
    } else {
      return this.find(target, parts.slice(1), value);
    }
  }
}
