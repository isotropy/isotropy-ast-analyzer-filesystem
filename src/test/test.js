import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";
import makePlugin from "./plugin";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install();

function clean(obj) {
  if (typeof obj !== "object") {
    return obj;
  } else {
    if (Array.isArray(obj)) {
      return obj.map(o => clean(o));
    } else {
      const newObj = {};
      for (const key in obj) {
        if (
          ![
            "start",
            "end",
            "loc",
            "computed",
            "shorthand",
            "extra",
            "__clone",
            "path"
          ].includes(key)
        ) {
          newObj[key] = clean(obj[key]);
        }
      }
      return newObj;
    }
  }
}

describe("isotropy-ast-analyzer-fs", () => {
  function run([description, dir, opts]) {
    it(`${description}`, () => {
      const fixturePath = path.resolve(__dirname, "fixtures", dir, `fixture.js`);
      const outputPath = path.resolve(__dirname, "fixtures", dir, `output.js`);
      const expected = require(`./fixtures/${dir}/expected`);
      const pluginInfo = makePlugin(opts);

      const babelResult = babel.transformFileSync(fixturePath, {
        plugins: [
          [
            pluginInfo.plugin,
            {
              filesystemModules: {
                todosFsModule: "./dist/test/fixtures/my-fs",
                backupFsModule: "./dist/test/fixtures/backup-fs"
              }
            }
          ],
          "transform-object-rest-spread"
        ],
        parserOpts: {
          sourceType: "module",
          allowImportExportEverywhere: true
        },
        babelrc: false
      });
      const result = pluginInfo.getResult();
      const actual = clean(result.analysis);
      actual.should.deepEqual(expected);
    });
  }

  const tests = [
    // ["create", "create"],
    // ["read", "read"],
    ["update", "update"]
    // ["get-files", "get-files"],
    // ["getfiles-r", "get-files-r"],
    // ["move-files", "move-files"],
    // ["move-folder"], ["move-folder"],
    // ["delete-file", "delete-file"],
    // ["delete-folder", "delete-folder"]
  ];

  debugger;
  for (const test of tests) {
    run(test);
  }
});
