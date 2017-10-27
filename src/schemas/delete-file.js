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
import { source, composite, clean, permuteWith } from "isotropy-analyzer-utils";
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
              body: {
                type: "UnaryExpression",
                operator: "!",
                argument: any(
                  permuteWith(
                    [
                      [x => x.left, (x, v) => ({ ...x, left: v })],
                      [x => x.right, (x, v) => ({ ...x, right: v })]
                    ],
                    {
                      type: "LogicalExpression",
                      left: {
                        type: "BinaryExpression",
                        left: {
                          type: "MemberExpression",
                          object: capture("leftIdentifier"),
                          property: {
                            type: "Identifier",
                            name: "filename"
                          }
                        },
                        operator: "===",
                        right: capture("filename")
                      },
                      operator: "&&",
                      right: {
                        type: "BinaryExpression",
                        left: {
                          type: "MemberExpression",
                          object: capture("rightIdentifier"),
                          property: {
                            type: "Identifier",
                            name: capture("dir")
                          }
                        },
                        operator: "===",
                        right: capture("dir")
                      }
                    }
                  )
                )
              }
            }
          ],
          { key: "args" }
        )
      }
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? {
              filename: result.value.args[0].argument.filename,
              dir: result.value.args[0].argument.dir,
              identifier: result.value.right.identifier,
              path: result.value.right.path,
              operation: "delete-file"
            }
          : result
    }
  );
}
