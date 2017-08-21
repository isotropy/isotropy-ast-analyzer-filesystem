export function createCollection(source) {
  return { type: "fs", ...source }
}

export function create(args, source) {
  return { type: "fs_create", ...args, ...source }
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

export function read(args, source) {
  return { type: "fs_read", ...args, ...source }
}

export function update(args, source) {
  return { type: "fs_update", ...args, ...source }
}

export function getFiles(args, source) {
  return { type: "fs_getFiles", ...args, ...source }
}
