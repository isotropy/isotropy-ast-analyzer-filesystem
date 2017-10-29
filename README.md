Isotropy AST Analyzer for FS
============================
This module abstracts AST analysis for common filesystem operations so that they don't have to be repeated in every filesystem plugin.
This is part of the isotropy framework (www.isotropy.org).

Create a module "fs.js" containing an array that mocks the filesystem.
The filename can be changed in configuration.
```javascript
//In fs.js
export default [
  {
    { dir: "pictures", filename: "stock_photo1.jpg", contents: "FF D8 FF ..." },
    { dir: "trash", filename: "not-passwords.txt", contents: "thisisnotpassword" }
  }
]
```

Create a file
```javascript
import myFS from "./my-fs.js";

async function createFile() {
  myFS.docs = myFS.docs.concat({
    dir: "documents",
    filename: "report.txt",
    contents: "hello, world"
  });
}

```

Read a file
```javascript
import myFS from "./my-fs.js";

async function readFile() {
  return myFS.docs.find(file => file.dir === "some/path/" && file.filename === "report.txt");
}
```

Get all files in a directory
```javascript
import myFS from "../my-fs";

async function getFiles() {
  return myFS.docs.filter(file => file.dir === "some/path/");
}
```

Get all files in a directory recursively down to the last level of directories
```javascript
import myFS from "../my-fs";

async function getFiles() {
  return myFS.docs.filter(
    file => file.dir === "some/path/" || file.dir.startsWith("some/path/")
  );
}
```

Update a file
```javascript
import myFS from "./my-fs.js";

async function updateFile() {
  myFS.docs = myFS.docs.map(
    file =>
      file.dir === "documents" && file.filename === "report.txt"
        ? { ...file, contents: "hello, universe" }
        : file
  );
}
```

Delete a file
```javascript
import myFS from "../my-fs";

async function deleteFile() {
  myFS.docs = myFS.docs.filter(
    file => !(file.dir === "documents" && file.filename === "report.txt")
  );
}
```

Delete a directory
```javascript
import myFS from "../my-fs";

async function deleteDir() {
  myFS.docs = myFS.docs.filter(file => !(file.dir === "documents"));
}
```

Move a file
```javascript
import myFS from "../my-fs";

async function moveFile() {
  myFS.docs = myFS.docs.map(
    file =>
      file.dir === "documents" && file.filename === "report.txt"
        ? { ...file, dir: "reports", filename: "report.txt" }
        : file
  );
}

```

Move a directory
```javascript
import myFS from "../my-fs";

async function moveFile() {
  myFS.docs = myFS.docs.map(
    file => (file.dir === "documents" ? { ...file, dir: "reports" } : file)
  );
}

```
