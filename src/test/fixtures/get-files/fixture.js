import myFS from "../my-fs";

async function getFiles() {
  return myFS.docs.filter(file => file.dir === "path/to/docs/");
}
