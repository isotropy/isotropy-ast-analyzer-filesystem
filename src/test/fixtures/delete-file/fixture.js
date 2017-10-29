import myFS from "../my-fs";

async function deleteFile() {
  myFS.docs = myFS.docs.filter(
    file => !(file.dir === "path/to/docs/" && file.filename === "report.txt")
  );
}
