export function createCollection(source) {
  return { type: "fs", ...source }
}

export function createFile(args, source) {
  return { type: "createFile", ...args, ...source }
}

export function deleteFile(args, source) {
  return { type: "deleteFile", ...args, ...source }
}

export function deleteDir(args, source) {
  return { type: "deleteDir", ...args, ...source }
}

export function moveFile(args, source) {
  return { type: "moveFile", ...args, ...source }
}

export function moveDir(args, source) {
  return { type: "moveDir", ...args, ...source }
}

export function readFile(args, source) {
  return { type: "readFile", ...args, ...source }
}

export function updateFile(args, source) {
  return { type: "updateFile", ...args, ...source }
}

export function getFiles(args, source) {
  return { type: "getFiles", ...args, ...source }
}
