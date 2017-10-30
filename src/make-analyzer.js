import { Seq } from "lazily";
import { match, Match, Fault } from "chimpanzee";

export default function makeAnalyzer(schemas, path, state, analysisState) {
  return Seq.of(schemas)
    .map(schema => schema(state, analysisState))
    .map(schema => match(schema, path))
    .first(
      (x, i) =>
        (() => {
          console.log(">>>>>>", i, schemas.length);
        })() ||
        x instanceof Match ||
        (x instanceof Fault
          ? (() => {
              debugger;
            })() || x
          : x) ||
        i === schemas.length - 1
    );
}
