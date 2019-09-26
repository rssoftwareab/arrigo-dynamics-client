import { TestData } from "../test";
import { DynamicsClient } from "../client";
const client = new DynamicsClient();
client.on("error", console.log);

const dataCallbacks: Array<any> = [];
client.on("data", (_event: string, payload: any) => {
  dataCallbacks.push(payload);
});

client.initialize({
  initialObject: TestData,
  onNewData: (path: string, value: any) => {
    console.log(path, value);
  }
});

test("testing patch", () => {
  client.patch("Cwl.Advise.A[0]", "23.5");
  expect(dataCallbacks[0].lastObject.Variable).toBe("23.5");
  expect(dataCallbacks[1].lastObject.Variable).toBe("23.5");
});
