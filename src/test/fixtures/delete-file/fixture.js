import myFS from "../my-fs";

async function deleteFile() {
  myFS.docs = myFS.docs.filter(
    file => !(file.dir === "documents" && file.filename === "report.txt")
  );
}
