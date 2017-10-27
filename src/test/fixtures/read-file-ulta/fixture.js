import myFS from "../my-fs";

async function readFile() {
  return myFS.docs.find(
    file => "/some/path" === file.dir && "report.txt" === file.filename
  );
}
