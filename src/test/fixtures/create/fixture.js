import myFs from "../my-fs";

async function createFile() {
  myFs.docs = myFs.docs.concat({
    dir: "documents",
    filename: "report.txt",
    contents: "hello, world"
  });
}
