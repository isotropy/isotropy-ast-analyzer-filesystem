import path from "path";

export default function(analysisState) {
  return {
    analyzeImportDeclaration(babelPath, state) {
      // Incorrect config
      if (!state.opts.projects) return false;

      const moduleName = babelPath.get("source").node.value;
      const resolvedName = path.resolve(
        path.dirname(state.file.opts.filename),
        moduleName
      );

      let absolutePath = null;

      const fsProject = state.opts.projects.find(project => {
        const projectDir = project.dir.startsWith("./")
          ? project.dir
          : "./" + project.dir;
        absolutePath = path.resolve(projectDir) + "/";
        return resolvedName.startsWith(absolutePath);
      });

      // Not a fs project
      if (!fsProject) return false;
      fsProject.absolutePath = absolutePath;

      const fsModule = fsProject.modules.find(m => {
        absolutePath =
          (fsProject.absolutePath + m.source).replace(/\/\//g, "/") + "/";
        return resolvedName.startsWith(absolutePath);
      });

      // Current path not listed in modules
      if (!fsModule) return false;
      fsModule.absolutePath = absolutePath;

      const specifier = babelPath.get("specifiers.0").node.local.name;
      analysisState.importBindings = analysisState.importBindings.concat({
        module: fsModule.locations,
        binding: babelPath.scope.bindings[specifier]
      });
      return true;
    }
  };
}
