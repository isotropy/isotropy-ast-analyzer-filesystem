import myFS from "../my-fs";

async function readFile() {
  return myFS.docs.find(
    file => file.dir === "/some/path" && file.filename === "report.txt"
  );
}
