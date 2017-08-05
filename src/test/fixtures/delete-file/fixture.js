import myFs from "../my-fs";

async function deleteFile() {
  myFs.docs = myFs.docs.filter(
    file => !(file.dir === "documents" && file.filename === "report.txt")
  );
}
