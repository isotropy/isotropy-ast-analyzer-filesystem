import myFs from "../my-fs";

async function moveFile() {
  myFs.docs = myFs.docs.map(
    file => (file.dir === "documents" ? { ...file, dir: "reports" } : file)
  );
}
