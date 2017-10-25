import myFS from "../my-fs";

async function writeError() {
  myFS.docs = myFS.docs.pop();
}
