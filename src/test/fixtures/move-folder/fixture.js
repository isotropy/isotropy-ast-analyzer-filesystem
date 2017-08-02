import myFs from "../my-fs";

async function moveFile() {
  myFs =  myFs.map(file => file.dir === "documents") ?
    { ...file, dir = "reports" } : file;
}
