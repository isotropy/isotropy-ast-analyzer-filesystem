import myFS from "../my-fs";

async function createFile() {
  myFS.docs = myFS.docs.concat({
    dir: "path/to/docs/",
    filename: "report.txt",
    contents: "hello, world"
  });
}
