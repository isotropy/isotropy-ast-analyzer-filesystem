import myFs from "../my-fs";

async function getFiles() {
  return myFs.filter(file => file.dir === "/some/path" || file.dir.startsWith("/some/path/"))
}
