
import { DynamicsClient } from "../client";
import { OnDataPayload } from "../client/OnDataPayload";
import { getFileContentByVariableUuid } from "./helpers/api/queries/getFileContentByVariableUuid"
import { getFirstVariableByFolderId } from "./helpers/api/queries/getFirstVariableByFolderId"
import { subscribeOnFileByVariableUuid } from "./helpers/api/subscriptions/subscribeOnFileByVariableUuid"
import { apolloClient } from "./helpers/apolloClient"

async function run() {
  const pvl = await getFirstVariableByFolderId("QXJlYV9B")
  const content = await getFileContentByVariableUuid(pvl.uid)
  const client = await apolloClient()
  const subscriptionQuery = await subscribeOnFileByVariableUuid(pvl.uid)

  const dynamicsClient = new DynamicsClient();
  dynamicsClient.initialize({
    initialObject: content,
    onNewData: console.log
  });

  dynamicsClient.on("data", (_event: string, payload: OnDataPayload) => {
    console.log(
      `New data: path:${payload.path}, newValue:${payload.newValue}, oldValue:${payload.oldValue}`
    );
  });

  const observer = client.subscribe({
    query: subscriptionQuery
  });

  observer.subscribe({
    next(data) {
      dynamicsClient.patch(data.data.data.path, data.data.data.value);
    },
    error(err) {
      console.error("err", err);
    }
  });
  console.log(observer);
}

run();
