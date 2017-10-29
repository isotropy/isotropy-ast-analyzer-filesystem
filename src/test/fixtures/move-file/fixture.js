import myFS from "../my-fs";

async function moveFile() {
  myFS.docs = myFS.docs.map(
    file =>
      file.dir === "documents" && file.filename === "doc.txt"
        ? { ...file, dir: "reports", filename: "report.txt" }
        : file
  );
}