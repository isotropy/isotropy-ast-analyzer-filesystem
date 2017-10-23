import { collection } from "./";
import {
  capture,
  any,
  array,
  map as mapResult,
  wrap,
  Match,
  Skip
} from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import clean from "../chimpanzee-utils/node-cleaner";
import R from "ramda";
import { moveDir } from "../fs-statements";

export default function(state, analysisState) {
  const spreadFilesNode = {
    type: "SpreadProperty",
    argument: {
      type: "Identifier",
      name: capture("fsIdentifier3")
    }
  };

  const dir = {
    type: "ObjectProperty",
    key: {
      type: "Identifier",
      name: "dir"
    },
    value: capture("newdir")
  };

  return composite(
    {
      type: "AssignmentExpression",
      operator: "=",
      left: wrap(collection(state, analysisState), {
        key: "left",
        selector: "path"
      }),
      right: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: wrap(collection(state, analysisState), {
            key: "right",
            selector: "path"
          }),
          property: {
            type: "Identifier",
            name: "map"
          }
        },
        arguments: array(
          [
            {
              type: "ArrowFunctionExpression",
              params: [
                {
                  type: "Identifier",
                  name: capture("fsIdentifier1")
                }
              ],
              body: {
                type: "ConditionalExpression",
                test: {
                  type: "BinaryExpression",
                  left: {
                    type: "MemberExpression",
                    object: {
                      type: "Identifier",
                      name: capture("fsIdentifier2")
                    },
                    property: {
                      type: "Identifier",
                      name: "dir"
                    }
                  },
                  operator: "===",
                  right: capture("dir")
                },
                consequent: {
                  type: "ObjectExpression",
                  properties: any([
                    [spreadFilesNode, dir],
                    [dir, spreadFilesNode]
                  ])
                },
                alternate: {
                  type: "Identifier",
                  name: capture("fsIdentifier4")
                }
              }
            }
          ],
          { key: "args" }
        )
      }
    },
    {
      build: obj => context => result => {
        return result instanceof Match
          ? (() => {
	      debugger;
              const fsIdentifierArray = [
                result.value.args[0].params[0].fsIdentifier1,
                result.value.args[0].fsIdentifier2,
                result.value.args[0].properties[0].fsIdentifier3,
                result.value.args[0].fsIdentifier4
              ];
              const fs = result.value.left;

              return R.equals(result.value.left, result.value.right)
                ? new Set(fsIdentifierArray).size === 1
                  ? moveDir(
                      {
                        dir: clean(result.value.args[0].dir),
                        newdir: clean(
                          result.value.args[0].properties[1].newdir
                        )
                      },
                      {
                        module: fs.module,
                        identifier: fs.identifier,
                        collection: fs.collection
                      }
                    )
                  : new Skip(
                      `Make sure you are using the same access variable.`
                    )
                : new Skip(
                    `The result of the map() must be assigned to the same fs module.`
                  );
            })()
          : result;
      }
    }
  );
}
