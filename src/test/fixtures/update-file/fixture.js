import myFS from "../my-fs";

async function updateFile() {
  myFS.docs = myFS.docs.map(
    file =>
      file.dir === "documents" && file.filename === "report.txt"
        ? { ...file, contents: "hello, universe" }
        : file
  );
}
