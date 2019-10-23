import { executeQuery } from "./executeQuery"

export async function getFileContentByVariableUuid(variableUuid: string) {
  const fileQuery = await executeQuery(
    `{data(uid:"${variableUuid}"){content}}`,
  );
  
  const content = fileQuery.data.data.content;
  console.log("filecontent", content);
  return content
}