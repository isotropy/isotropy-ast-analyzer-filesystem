import { collection } from "./";
import {
  capture,
  any,
  array,
  repeatingItem,
  map as mapResult,
  Match,
  wrap,
  Skip
} from "chimpanzee";
import { source } from "../chimpanzee-utils";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { createFile } from "../fs-statements";

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
            name: "concat"
          }
        },
        arguments: array(
          [
            {
              type: "ObjectExpression",
              properties: array([
                repeatingItem({
                  type: "ObjectProperty",
                  key: {
                    type: "Identifier",
                    name: capture("key")
                  },
                  value: capture("value")
                })
              ])
            }
          ],
          { key: "args" }
        )
      }
    },
    {
      build: obj => context => result => {
        debugger;
        return  result instanceof Match
          ? (() => {
              const source = result.value.left;
              const props = result.value.args[0].properties;
              let contents, dir, filename;
              props.forEach(prop => {
                if (prop.key === "contents") contents = prop.value;
                if (prop.key === "dir") dir = prop.value;
                if (prop.key === "filename") filename = prop.value;
              });
              return R.equals(result.value.left, result.value.right)
                ? contents && dir && filename
                  ? createFile(
                      {
                        contents,
                        dir,
                        filename
                      },
                      {
                        identifier: source.identifier,
                        module: source.module,
                        collection: source.collection
                      }
                    )
                  : new Skip(
                      `File creation must be accompanied by three values:
                  "dir", "filename", "contents"`
                    )
                : new Skip(
                    `The result of the concat() must be assigned to the fs module`
                  );
            })()
          : result;
      }
    }
  );
}
