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
import { deleteDir } from "../fs-statements";

export default function(state, analysisState) {
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
            name: "filter"
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
                type: "UnaryExpression",
                operator: "!",
                argument: {
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
                  right: capture("dirNode")
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
          ? R.equals(result.value.left, result.value.right)
            ? result.value.args[0].params[0].fsIdentifier1 ===
              result.value.args[0].fsIdentifier2
              ? deleteDir(
                  {
                    dir: clean(result.value.args[0].dirNode)
                  },
                  {
                    module: result.value.left.module,
                    identifier: result.value.left.identifier,
                    collection: result.value.left.collection
                  }
                )
              : new Skip(
                  `The result of the filter() must be assigned to the same fs module.`
                )
            : new Skip(`Incorrect access variable for array operation`)
          : result;
      }
    }
  );
}
