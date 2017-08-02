import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";

export default function(analysisState) {
  return {
    analyzeAssignmentExpression(path, state) {
      return makeAnalyzer([
        schemas.create, schemas.update,
        schemas.delete_file, schemas.delete_folder,
        schemas.move_file, schemas.move_folder
      ], path, state, analysisState);
    }
  };
}
