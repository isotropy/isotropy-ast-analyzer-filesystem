import myFS from "../my-fs";

async function moveDir() {
  myFS.docs = myFS.docs.map(
    file => (file.dir === "path/to/docs" || file.dir.startsWith("documents/") ? { ...file, dir: file.dir.replace() } : file)
  );
}
