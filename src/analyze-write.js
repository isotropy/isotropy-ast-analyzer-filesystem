import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";

export default function(analysisState) {
  return {
    analyzeAssignmentExpression(path, state) {
      return makeAnalyzer(
        [
          schemas.createFile,
          schemas.updateFile,
          schemas.deleteFile,
          schemas.deleteDir,
          schemas.moveFile,
          schemas.moveDir,
          schemas.writeError
        ],
        path,
        state,
        analysisState
      );
    }
  };
}
