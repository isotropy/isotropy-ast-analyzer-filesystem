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
import { source, composite, clean, permute, permuteWith } from "isotropy-analyzer-utils";
import R from "ramda";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: wrap(collection(state, analysisState), {
          key: "fs",
          selector: "path"
        }),
        property: {
          type: "Identifier",
          name: "find"
        }
      },
      arguments: array(
        [
          {
            type: "ArrowFunctionExpression",
            params: [capture("param")],
            body: any(
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
        ],
        { key: "args" }
      )
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? {
              filename: result.value.args[0].body.filename,
              dir: result.value.args[0].body.dir,
              identifier: result.value.fs.identifier,
              path: result.value.fs.path,
              operation: "get-file"
            }
          : result
    }
  );
}
