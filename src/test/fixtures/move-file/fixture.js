import myFs from "../my-fs";

async function moveFile() {
  myFs.docs = myFs.docs.map(
    file =>
      file.dir === "documents" && file.filename === "report.txt"
        ? { ...file, dir: "reports", filename: "report.txt" }
        : file
  );
}
