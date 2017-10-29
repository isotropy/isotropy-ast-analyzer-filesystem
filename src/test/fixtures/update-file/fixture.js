import myFS from "../my-fs";

async function updateFile() {
  myFS.docs = myFS.docs.map(
    file =>
      file.dir === "path/to/docs" && file.filename === "report.txt"
        ? { ...file, contents: "hello, universe" }
        : file
  );
}
