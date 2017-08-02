import { source } from "../chimpanzee-utils";
import { module } from "./";
import { capture, any, array, Match, Skip } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { create } from "../fs-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "AssignmentExpression",
      operator: "=",
      left: source([module])(state, analysisState),
      right: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: source([module])(state, analysisState),
          property: {
            type: "Identifier",
            name: "concat"
          }
        },
        arguments: array(
          [
            repeatingItem({
              type: "ObjectExpression",
              properties: [
                type: "ObjectProperty",
                key: {
                  type: "Identifier",
                  name: capture("key")
                },
                any([
                  mapResult(
                    value: {
                      type: "StringLiteral",
                      value: capture("value")
                    },
                    s => s.value
                  )
                  value: {
                    type: "Identifier",
                    value: capture("value")
                  }
                ])
              ]
            })
          ],
          { key: "args" }
        )
      }
    },
    {
      build: obj => context => result => {
        const keyArray = [
          result.value.args[0].key,
          result.value.args[1].key,
          result.value.args[2].key
        ]
        return result instanceof Match
          ? R.equals(result.value.left, result.value.object)
            ? result.value.args.length === 3
              && new Set(keyArray).size === 3
              && keyArray.every((v, i) => ['contents', 'dir', 'filename'].includes(v.key))
              ? create({ [result.value.args[0].key]: result.value.args[0].value,
                [result.value.args[1].key]: result.value.args[1].value,
                [result.value.args[2].key]: result.value.args[2].value }, result.value.left)
              : new Skip(`File creation must be accompanied by three values:
                "dir", "filename", "contents"`);
            : new Skip(`The result of the concat() must be assigned to the fs module`)
          : result
      }
    }
  );
}
