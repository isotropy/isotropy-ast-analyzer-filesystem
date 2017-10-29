import myFS from "../my-fs";

async function moveDir() {
  myFS.docs = myFS.docs.map(
    file =>
      file.dir === "path/to/docs/"
        ? {
            ...file,
            dir: file.dir.replace("path/to/docs/", "path/to/new-docs/")
          }
        : file
  );
}
