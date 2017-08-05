import myFs from "../my-fs";

async function moveFile() {
  myFs = myFs.map(
    file =>
      file.dir === "documents" && file.filename === "report.txt"
        ? { ...file, dir: "reports", filename: "report.txt" }
        : file
  );
}
