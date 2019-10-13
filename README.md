# arrigo-dynamics-client

All live data views from Arrigo is divided in two parts. One initial payload with the object structure, and one with the updates.
Both makes use of the graphQL API.
Find a graphQL query which responds with a reference to a dynamics instance, for example a list of variables:

````
query folder(id:"someId"){

}

The `initialize` method is used to prepare the DynamicsClient with initial data.
The `patch` method updates the data structure.

```typescript
import { TestData } from ".";
import { DynamicsClient } from "../client";
const client = new DynamicsClient();
client.on("error", console.log);
client.on("data", console.log);

client.initialize({
  initialObject: TestData,
  onNewData: (path: string, value: any) => {
    console.log(path, value);
  }
});

client.patch("Cwl.Advise.A[0]", "23.5");

console.log("done", TestData);
````
