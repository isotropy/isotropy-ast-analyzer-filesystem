export function createCollection(source) {
  return { type: "fs", ...source }
}

export function createFile(args, source) {
  return { type: "fs_createFile", ...args, ...source }
}

export function deleteFile(args, source) {
  return { type: "fs_deleteFile", ...args, ...source }
}

export function deleteDir(args, source) {
  return { type: "fs_deleteDir", ...args, ...source }
}

export function moveFile(args, source) {
  return { type: "fs_moveFile", ...args, ...source }
}

export function moveDir(args, source) {
  return { type: "fs_moveDir", ...args, ...source }
}

export function readFile(args, source) {
  return { type: "fs_readFile", ...args, ...source }
}

export function updateFile(args, source) {
  return { type: "fs_updateFile", ...args, ...source }
}

export function getFiles(args, source) {
  return { type: "fs_getFiles", ...args, ...source }
}
