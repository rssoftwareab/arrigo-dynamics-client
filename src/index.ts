import { DynamicsClient } from "./client";
import { TestData } from "./test";
const client = new DynamicsClient();
client.on("error", console.log);
client.on("data", console.log);
client.initialize({
  type: "pvl",
  initialObject: TestData,
  onNewData: (path: string, value: any) => {
    console.log(path, value);
  }
});

client.patch("Cwl.Advise.A[0]", "23.5");

console.log("done", TestData);
