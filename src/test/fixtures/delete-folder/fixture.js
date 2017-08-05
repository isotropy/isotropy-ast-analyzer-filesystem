import myFs from "../my-fs";

async function deleteFolder() {
  myFs.docs = myFs.docs.filter(
    file => !(file.dir === "documents")
  );
}
