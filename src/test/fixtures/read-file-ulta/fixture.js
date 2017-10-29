import myFS from "../my-fs";

async function readFile() {
  return myFS.docs.find(
    file => "path/to/docs/" === file.dir && "report.txt" === file.filename
  );
}
