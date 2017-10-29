import myFS from "../my-fs";

async function readFile() {
  return myFS.docs.find(
    file => file.dir === "path/to/docs/" && file.filename === "report.txt"
  );
}
