export function module(source) {
  return { type: "fs", ...source }
}

export function create(args, source) {
  return { type: "create", ...args, ...source }
}

export function deleteF(args, source) {
  return { type: "delete", ...args, ...source }
}

export function move(args, source) {
  return { type: "move", ...args, ...source }
}

export function read(args, source) {
  return { type: "read", ...args, ...source }
}

export function update(args, source) {
  return { type: "update", ...args, ...source }
}

export function getFiles(args, source) {
  return { type: "getFiles", ...args, ...source }
}
