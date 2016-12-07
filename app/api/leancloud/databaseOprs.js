import AV from 'leancloud-storage'

export function currentUser() {
  return AV.User.current()
}

export function createObjWithoutSaving(payload) {
  let objName = payload.objName
  let NewObject = AV.Object.extend(objName)
  let obj = new NewObject()

  let keyNames = Object.keys(payload.args)
  keyNames.map((item, index, array) => {
    obj.set(item, payload.args[item])
  })

  return obj
}

export function createObj(payload) {
  let obj = createObjWithoutSaving(payload)

  return obj.save().then((saved) => {
    return saved
  }, (err) => {
    throw err
  })
}

export function createObjWithoutData(name, objId) {
  return AV.Object.createWithoutData(name, objId)
}

export function createUser() {
  return new AV.User()
}

export function createACL() {
  return new AV.ACL()
}

export function createRole(name, ACL) {
  return new AV.Role(name, ACL)
}

export function createRoleQuery() {
  return new AV.Query(AV.Role)
}

export function saveAll(objList) {
  return AV.Object.saveAll(objList)
}

export function updateObj(payload) {
  let name = payload.name
  let objectId = payload.objectId
  let obj = new AV.Object.createWithoutData(name, objectId)

  let keyNames = Object.keys(payload.setArgs)
  keyNames.map((item, index, array) => {
    obj.set(item, payload.setArgs[item])
  })

  keyNames = Object.keys(payload.increArgs)
  keyNames.map((item, index, array) => {
    obj.increment(item, payload.setArgs[item])
  })

  return obj.save().then((saved) => {
    return saved
  }, (err) => {
    throw err
  })
}

export function createQuery(name) {
  return new AV.Query(name)
}

export function createAndQuery(queryList) {
  return AV.Query.and(queryList)
}

export function retrieveObj(query) {
  return query.find().then((data) => {
    return data
  }, (err) => {
    throw err
  })
}

export function retrieveObjById(query, id) {
  return query.get(id).then((data)=> {
    return data
  }).catch((err)=> {
    throw err
  })
}

export function deleteObj(payload) {

}

export function createStatus(payload) {
  let status = new AV.Status(null, 'I post a feed using Status!')
  status.set('type', payload.type)
  status.set('query', payload.query)
  status.set('content', payload.content)
  return status
}

export function sendStatusToFollowers(payload) {
  return AV.Status.sendStatusToFollowers(payload).then((status) => {
    return status
  }, (err) => {
    throw err
  })
}

export function followerQuery(id) {
  return AV.User.followerQuery(id)
}

export function inboxQuery(user, inboxType) {
  return AV.Status.inboxQuery(user, inboxType)
}

export function outboxQuery(source) {
  return AV.Status.statusQuery(source)
}

export function andQuery(query1, query2) {
  return AV.Query.and(query1, query2)
}

export function orQuery(query1, query2) {
  return AV.Query.or(query1, query2)
}

export function follow(userId) {
  return AV.User.current().follow(userId).then(()=> {

  }).catch((error)=> {
    console.log("follow error is ", error)
  })
}

export function unfollow(userId) {
  return AV.User.current().unfollow(userId)
}

export function addUsersToRole(roleId, userList) {
  let roleQuery = new AV.Query(AV.Role)
  roleQuery.equalTo('objectId', roleId)

  return roleQuery.first().then((result) => {
    if (!result) {
      throw 'Target role isn\'t exist!'
    }
    let userRelation = result.relation('users')

    userList.forEach((user) => {
      userRelation.add(user)
    })
    return result.save()
  }).catch((error) => {
    throw error
  })
}

export function removeUsersFromRole(roleId, userList) {
  let roleQuery = new AV.Query(AV.Role)
  roleQuery.equalTo('objectId', roleId)

  return roleQuery.find().then((results) => {
    if (!results) {
      throw 'Target role isn\'t exist!'
    }
    let role = results[0]
    userList.forEach((user) => {
      role.getUsers().remove(user)
    })
    return role.save()
  }).catch((error) => {
    console.log('error:', error)
    throw error
  })
}

export function getRoleUserList(payload) {
  let role = createObjWithoutData('_Role', payload.roleId)
  let userRelation = role.relation('users')

  let query = userRelation.query()

  return query.find().then((results) => {
    return results.map((item) => {
      return item.id
    })
  }, (error) => {
    throw error
  })
}
