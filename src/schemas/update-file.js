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
import { updateFile } from "../fs-statements";

export default function(state, analysisState) {
  const spreadFilesNode = {
    type: "SpreadProperty",
    argument: {
      type: "Identifier",
      name: capture("fsIdentifier4")
    }
  };

  const contentNode = {
    type: "ObjectProperty",
    key: {
      type: "Identifier",
      name: "contents"
    },
    value: capture("newContentNode")
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
                  type: "LogicalExpression",
                  left: {
                    type: "BinaryExpression",
                    left: {
                      type: "MemberExpression",
                      object: {
                        type: "Identifier",
                        name: capture("fsIdentifier2")
                      },
                      property: {
                        type: "Identifier",
                        name: capture("key1")
                      }
                    },
                    operator: "===",
                    right: capture("valueNode1")
                  },
                  operator: "&&",
                  right: {
                    type: "BinaryExpression",
                    left: {
                      type: "MemberExpression",
                      object: {
                        type: "Identifier",
                        name: capture("fsIdentifier3")
                      },
                      property: {
                        type: "Identifier",
                        name: capture("key2")
                      }
                    },
                    operator: "===",
                    right: capture("valueNode2")
                  }
                },
                consequent: {
                  type: "ObjectExpression",
                  properties: any([
                    [spreadFilesNode, contentNode],
                    [contentNode, spreadFilesNode]
                  ])
                },
                alternate: {
                  type: "Identifier",
                  name: capture("fsIdentifier5")
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
              const shouldContain = ["dir", "filename"];
              const fsIdentifierArray = [
                result.value.args[0].params[0].fsIdentifier1,
                result.value.args[0].fsIdentifier2,
                result.value.args[0].fsIdentifier3,
                result.value.args[0].properties[0].fsIdentifier4,
                result.value.args[0].fsIdentifier5
              ];
              const keyArray = [
                result.value.args[0].key1,
                result.value.args[0].key2
              ];
              const valueArray = [
                result.value.args[0].valueNode1,
                result.value.args[0].valueNode2,
                result.value.args[0].properties[1].newContentNode
              ];
              const fs = result.value.left;

              return R.equals(result.value.left, result.value.right)
                ? new Set(fsIdentifierArray).size === 1
                  ? keyArray[0] !== keyArray[1] &&
                    keyArray.every((v, i) => shouldContain.includes(v))
                    ? updateFile(
                        {
                          [keyArray[0]]: clean(valueArray[0]),
                          [keyArray[1]]: clean(valueArray[1]),
                          content: clean(valueArray[2])
                        },
                        {
                          module: fs.module,
                          identifier: fs.identifier,
                          collection: fs.collection
                        }
                      )
                    : new Skip(
                        `The result of the filter() must be assigned to the same fs module.`
                      )
                  : new Skip(
                      `The fields "dir" and "filename" are required for updating.`
                    )
                : new Skip(`Make sure you are using the same access variable.`);
            })()
          : result;
      }
    }
  );
}
