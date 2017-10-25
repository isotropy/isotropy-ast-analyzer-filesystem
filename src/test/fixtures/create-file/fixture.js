import myFS from "../my-fs";

async function createFile() {
  myFS.docs = myFS.docs.concat({
    dir: "documents",
    filename: "report.txt",
    contents: "hello, world"
  });
}
