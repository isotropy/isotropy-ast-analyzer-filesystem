import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";
import makePlugin from "./plugin";
import sourceMapSupport from "source-map-support";
import * as utils from "isotropy-plugin-dev-utils";

sourceMapSupport.install();

describe("isotropy-ast-analyzer-filesystem", () => {
  function run([description, dir, opts]) {
    it(`${description}`, () => {
      const fixturePath = path.resolve(
        __dirname,
        "fixtures",
        dir,
        `fixture.js`
      );

      const pluginInfo = makePlugin(opts);

      const callWrapper = () => {
        babel.transformFileSync(fixturePath, {
          plugins: [
            [
              pluginInfo.plugin,
              {
                projects: [
                  {
                    dir: "dist/test",
                    modules: [
                      {
                        source: "dist/test/fixtures/my-fs",
                        locations: {
                          docs: { path: "home/office/docs" }
                        }
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
        return pluginInfo.getResult();
      };

      return dir.includes("error")
        ? should(() => callWrapper()).throw(
            /Compilation failed. Not a valid isotropy operation./
          )
        : (() => {
            const expected = require(`./fixtures/${dir}/expected`);
            const result = callWrapper();
            const actual = utils.astCleaner.clean(result.analysis);
            actual.should.deepEqual(expected);
          })();
    });
  }

  const tests = [
    // ["create-file", "create-file"],
    // ["delete-file", "delete-file"],
    // ["delete-dir", "delete-dir"],
    // ["get-files", "get-files"],
    // ["getfiles-recursive", "get-files-recursive"],
    // ["move-file", "move-file"],
    // ["move-dir", "move-dir"],
    ["read-file", "read-file"],
    // ["read-file-ulta", "read-file-ulta"],
    // ["update-file", "update-file"],
  ];

  for (const test of tests) {
    run(test);
  }
});
