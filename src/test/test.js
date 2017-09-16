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
              projects: [
                {
                  dir: "dist/test",
                  modules: [
                    {
                      source: "fixtures",
                      locations: [{ name: "docs", path: "/my-fs" }]
                    }
                  ]
                }
              ]
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
    // ["create-file", "create-file"],
    // ["read-file", "read-file"],
    // ["update-file", "update-file"],
    // ["get-files", "get-files"],
    // ["getfiles-recursive", "get-files-recursive"],
    // ["move-file", "move-file"],
    // ["move-dir", "move-dir"],
    // ["delete-file", "delete-file"],
    // ["delete-dir", "delete-dir"]
  ];

  for (const test of tests) {
    run(test);
  }
});
