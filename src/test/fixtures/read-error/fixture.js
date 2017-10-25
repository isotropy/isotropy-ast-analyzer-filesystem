import myFS from "../my-fs";

async function readError() {
  return myFS.docs.pop();
}
