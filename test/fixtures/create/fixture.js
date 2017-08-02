import myFs from "../my-fs";

async function createFile() {
  myFs = myFs.concat({
    dir: "documents",
    filename: "report.txt",
    contents: "hello, world"
  });
}
