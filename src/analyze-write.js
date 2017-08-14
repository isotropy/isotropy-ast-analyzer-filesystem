import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";

export default function(analysisState) {
  return {
    analyzeAssignmentExpression(path, state) {
      return makeAnalyzer(
        [
          schemas.create,
          schemas.update,
          schemas.deleteFile,
          schemas.deleteDir,
          schemas.moveFile,
          schemas.moveDir
        ],
        path,
        state,
        analysisState
      );
    }
  };
}
