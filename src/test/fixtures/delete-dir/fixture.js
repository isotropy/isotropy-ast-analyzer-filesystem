import myFS from "../my-fs";

async function deleteDir() {
  myFS.docs = myFS.docs.filter(file => !(file.dir === "documents"));
}
