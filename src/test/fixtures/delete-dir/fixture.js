import myFs from "../my-fs";

async function deleteDir() {
  myFs.docs = myFs.docs.filter(file => !(file.dir === "documents"));
}
