import myFs from "../my-fs";

async function getFiles() {
  return myFs.docs.filter(file => file.dir === "/some/path")
}
