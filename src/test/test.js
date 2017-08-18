import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";
import makePlugin from "./plugin";
import sourceMapSupport from "source-map-support";
import clean from "../chimpanzee-utils/node-cleaner";

sourceMapSupport.install();

describe("isotropy-ast-analyzer-fs", () => {
  function run([description, dir, opts]) {
    it(`${description}`, () => {
      const fixturePath = path.resolve(
        __dirname,
        "fixtures",
        dir,
        `fixture.js`
      );
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
    ["create", "create"],
    ["read", "read"],
    ["update", "update"],
    ["get-files", "get-files"],
    ["getfiles-recursive", "get-files-recursive"],
    ["move-file", "move-file"],
    ["move-dir", "move-dir"],
    ["delete-file", "delete-file"],
    ["delete-dir", "delete-dir"]
  ];

  debugger;
  for (const test of tests) {
    run(test);
  }
});
