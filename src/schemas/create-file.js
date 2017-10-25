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
        arguments: capture()
      }
    },
    {
      build: obj => context => result =>
        result instanceof Match 
          ? {
              ...result.value.right.object,
              files: arguments
            }
          : result
    }
  );
}
