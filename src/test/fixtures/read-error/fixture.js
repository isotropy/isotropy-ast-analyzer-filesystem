import myFs from "../my-fs";

async function readError() {
  return myFs.docs.pop();
}
