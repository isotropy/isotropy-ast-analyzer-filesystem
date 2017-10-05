import myFs from "../my-fs";

async function writeError() {
  myFs.docs = myFs.docs.pop();
}
