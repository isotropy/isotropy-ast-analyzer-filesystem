import myFs from "../my-fs";

async function deleteFolder() {
  myFs = myFs.filter(
    file => !(file.dir === "documents")
  );
}
