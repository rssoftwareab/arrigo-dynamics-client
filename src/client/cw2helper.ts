import { JsonHelper } from "./jsonHelper";

export class Cw2Helper {
  private jsonHelper = new JsonHelper();

  public getPaths(obj: any, path: string): string[] {
    const key = Object.keys(obj)[0];
    const o = obj[key];

    const paths: string[] = [];
    if (path.indexOf(".Advise.")) {
      path = path.replace(".Advise.", ".AdviseRefs.");
    }

    const adviseRefs = this.jsonHelper.get(obj, path);
    // array of references to element paths.
    const that = this;
    adviseRefs.map((elementIndex: any) => {
      // for each references to element path

      const elementPath = o.ElementRefs[elementIndex];
      const childrenPath: number[] = elementPath[0];
      const attributeIndex = elementPath[1];
      const attributes = `${key}.${childrenPath
        .map((index: number) => {
          return `children[${index}]`;
        })
        .join(".")}.attributes`;
      const attrs = that.jsonHelper.get(obj, attributes);
      const attributeName = Object.keys(attrs)[attributeIndex];
      paths.push(attributes + "." + attributeName);
    });

    return paths;
  }
}
