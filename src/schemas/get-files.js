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
import { getFiles } from "../fs-statements";

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
              right: capture("val1")
            }
          }
        ],
        { key: "args" }
      )
    },
    {
      build: () => () => result => {
        return result instanceof Match
          ? (() => {
              const fs = result.value.fs;
              return result.value.args[0].params[0].fsIdentifier1 ===
                result.value.args[0].fsIdentifier2
                ? getFiles(
                    { dirNode: result.value.args[0].val1, recurse: false },
                    {
                      identifier: fs.identifier,
                      module: fs.module,
                      collection: fs.collection
                    }
                  )
                : new Skip(`File system access variables do not match`);
            })()
          : result;
      }
    }
  );
}
