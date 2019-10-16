import { executeQuery } from "./executeQuery"

export async function getFirstVariableByFolderId(folderId: string) {
  const res = await executeQuery(
    `{
      folder(id: "${folderId}") {
        name
        ...on UserArea {
          publicVariableList {
            name
            uid
          }		
        }
      }
    }`
  );

  console.log("public variable lists", res.data.folder.publicVariableList[1]);
  return res.data.folder.publicVariableList[1];
}