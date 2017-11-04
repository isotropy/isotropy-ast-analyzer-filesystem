Isotropy AST Analyzer for FS
============================

First, we need to create a JS file while represents or emulates our file system on the client-side.
Here's how you do that.

```javascript
import fs from "isotropy-lib-fs";

fs.init([
  {
    type: "dir",
    name: "home",
    contents: [
      {
        type: "dir",
        name: "docs",
        contents: [
          {
            type: "file",
            name: "report.txt",
            contents: "2017: 200; 2016: 150"
          },
          {
            type: "file",
            name: "old-report.txt",
            contents: "2017: 220; 2016: 100"
          }
        ]
      },
      {
        type: "file",
        name: "placeholder.txt",
        contents: "This is empty."
      }
    ]
  }
])
```

You should then be able to query from anywhere else.

```javascript
import fs from "isotropy-lib-fs";

//Read a file
//Create a file
fs.createFile("/home/reports/report-2015.txt", "2015: 40");

// returns { contents: "2015: 40" }
fs.readFile("/home/reports/report-2015.txt");

//Update a file
fs.updateFile("/home/reports/report-2015.txt", "2015: 60");

//Delete a file
fs.deleteFile("/home/reports/report-2015.txt");

//Move a file
fs.moveFile("/home/reports/report-2015.txt", "/home/reports/totals-2015.txt")

//Create a directory
fs.createDir("/home/reports/older");

//Move a dir
fs.moveDir("/home/reports/older", "/home/reports/archived");

//Delete dir
fs.deleteDir("/home/reports/archived")
```

