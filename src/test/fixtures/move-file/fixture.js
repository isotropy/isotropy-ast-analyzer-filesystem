import myFS from "../my-fs";

async function moveFile() {
  myFS.docs = myFS.docs.map(
    file =>
      file.dir === "path/to/docs" && file.filename === "doc.txt"
        ? { ...file, dir: "path/to/reports", filename: "report.txt" }
        : file
  );
}