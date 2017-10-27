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

function matchLogical(obj, params = {}) {
  return any(
    permuteWith(
      [
        [x => x.left, (x, v) => ({ ...x, left: v })],
        [x => x.right, (x, v) => ({ ...x, right: v })]
      ],
      { ...obj, type: "LogicalExpression" }
    ),
    {
      build: obj => context => result =>
        result instanceof Match
          ? { ...result.value.left, ...result.value.right }
          : result,
      ...params
    }
  );
}

function matchBinary(key, obj, operator, params = {}) {
  return any(
    permuteWith(
      [
        [x => x.left, (x, v) => ({ ...x, left: v })],
        [x => x.right, (x, v) => ({ ...x, right: v })]
      ],
      {
        type: "BinaryExpression",
        left: obj,
        right: capture(`__${key}`),
        operator
      }
    ),
    {
      build: obj => context => result => {
        return result instanceof Match
          ? { [key]: result.value[`__${key}`] }
          : result;
      },
      ...params
    }
  );
}

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
            body: matchLogical({
              left: matchBinary(
                "filename",
                {
                  type: "MemberExpression",
                  object: capture("leftIdentifier"),
                  property: {
                    type: "Identifier",
                    name: "filename"
                  }
                },
                "==="
              ),
              operator: "&&",
              right: matchBinary(
                "dir",
                {
                  type: "MemberExpression",
                  object: capture("leftIdentifier"),
                  property: {
                    type: "Identifier",
                    name: "dir"
                  }
                },
                "==="
              )
            })
          }
        ],
        { key: "args" }
      )
    },
    {
      build: obj => context => result => {
        debugger;
        return result instanceof Match
          ? {
              filename: result.value.args[0].body.filename,
              dir: result.value.args[0].body.dir,
              identifier: result.value.fs.identifier,
              path: result.value.fs.path,
              operation: "get-file"
            }
          : result;
      }
    }
  );
}
