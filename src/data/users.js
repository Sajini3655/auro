export let users = []

export function addUser(user) {
  users.push(user)
}

export function findUser(username) {
  return users.find(u => u.username === username)
}
