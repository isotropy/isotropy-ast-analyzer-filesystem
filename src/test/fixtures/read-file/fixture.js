import myFs from "../my-fs";

async function readFile() {
  return myFs.docs.find(
    file => file.dir === "/some/path" && file.filename === "report.txt"
  );
}
