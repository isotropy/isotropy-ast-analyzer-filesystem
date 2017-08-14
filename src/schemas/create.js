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
import { create } from "../fs-statements";

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
                  value: any([
                    mapResult(
                      {
                        type: "Identifier",
                        name: capture("value")
                      },
                      s => s.value
                    ),
                    mapResult(
                      {
                        type: "StringLiteral",
                        value: capture("value")
                      },
                      s => s.value
                    )
                  ])
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
        return result instanceof Match
          ? (() => {
              const source = result.value.left;
              const props = result.value.args[0].properties;
              const keyArray = [props[0].key, props[1].key, props[2].key];
              return R.equals(result.value.left, result.value.right)
                ? props.length === 3 &&
                  new Set(keyArray).size === 3 &&
                  keyArray.every((v, i) =>
                    ["contents", "dir", "filename"].includes(v)
                  )
                  ? create(
                      {
                        [props[0].key]: props[0].value,
                        [props[1].key]: props[1].value,
                        [props[2].key]: props[2].value
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
