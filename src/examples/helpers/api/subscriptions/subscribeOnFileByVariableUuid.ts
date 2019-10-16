import gql from "graphql-tag";

export async function subscribeOnFileByVariableUuid(uuid: string) {
  return gql`
  subscription {
    data(uid:"${uuid}")
    {
      path
      type
      value
    }
  }`;
}