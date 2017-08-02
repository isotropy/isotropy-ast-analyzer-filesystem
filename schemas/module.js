import { capture, wrap, Match } from "chimpanzee";
import { root } from "./";
import composite from "../chimpanzee-utils/composite";

export default function(state, analysisState) {
  return composite(
    {
      type: "ExpressionStatement",
      object: wrap(root(state, analysisState), { key: "root", selector: "path" }),
    },
    {
      build: obj => context => result => {
        return result instanceof Match
          ? module({
              identifier: result.value.root.identifier,
              module: result.value.root.module
            })
          : result;
      }
    }
  );
}
