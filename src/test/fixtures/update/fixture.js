import myFs from "../my-fs";

async function updateFile() {
  myFs.docs = myFs.docs.map(
    file =>
      file.dir === "documents" && file.filename === "report.txt"
        ? { ...file, contents: "hello, universe" }
        : file
  );
}
