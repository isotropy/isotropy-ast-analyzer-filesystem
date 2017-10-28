import myFS from "../my-fs";

async function moveFile() {
  myFS.docs = myFS.docs.map(
    file =>
      file.dir === "documents" && file.filename === "report.txt"
        ? { ...file, dir: "reports", filename: "new-report.txt" }
        : file
  );
}
