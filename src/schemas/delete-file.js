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
import { source, composite, clean } from "isotropy-analyzer-utils";
import R from "ramda";
import { deleteFile } from "../fs-statements";

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
                    right: capture("val1")
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
                    right: capture("val2")
                  }
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
              const props = result.value.args[0];
              const fs = result.value.left;
              let dir, filename;
              if (props.key1 === "dir") {
                dir = clean(props.val1);
                filename = clean(props.val2);
              }
              if (props.key1 === "filename") {
                filename = clean(props.val1);
                dir = clean(props.val2);
              }
              return R.equals(result.value.left, result.value.right)
                ? props.params[0].fsIdentifier1 === props.fsIdentifier2 &&
                    props.fsIdentifier2 === props.fsIdentifier3 &&
                    dir &&
                    filename
                  ? deleteFile(
                      {
                        dir,
                        filename
                      },
                      {
                        module: fs.module,
                        identifier: fs.identifier,
                        collection: fs.collection
                      }
                    )
                  : new Skip(`File deletion requires "dir" and "filename"`)
                : new Skip(
                    `The result of the filter() must be assigned to the same fs module.`
                  );
            })()
          : result;
      }
    }
  );
}
