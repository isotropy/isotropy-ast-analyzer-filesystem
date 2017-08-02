import myFs from "../my-fs";

async function deleteFile() {
  myFs = myFs.filter(
    file => !(file.dir === "documents" && file.filename === "report.txt")
  );
}
