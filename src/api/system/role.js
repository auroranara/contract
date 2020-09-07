import request from '@/utils/request'

// 获取所有的Role
export function getAll() {
  return request({
    url: '/end/roles',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/end/roles',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/end/roles/' + id,
    method: 'get'
  })
}

export function getLevel() {
  return request({
    url: '/end/roles/level',
    method: 'get'
  })
}

export function del(ids) {
  return request({
    url: '/end/roles',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/end/roles/' + data.id,
    method: 'post',
    data
  })
}

export function editMenu(data) {
  return request({
    url: '/end/roles/menu',
    method: 'put',
    data
  })
}

export function getResourcesByRoleId(roleId) {
  return request({
    url: '/end/roles/' + roleId + '/resources',
    method: 'get'
  })
}
export function getResourceIdsByRoleId(roleId) {
  return request({
    url: '/end/roles/' + roleId + '/childrenResources',
    method: 'get'
  })
}

export function saveRoleResource(data) {
  return request({
    url: '/end/roles/' + data.roleId + '/roleResources',
    method: 'post',
    data
  })
}

export function roleManage() {
  return request({
    url: '/end/roles',
    method: 'get'
  })
}

export default { add, edit, del, get, editMenu, getLevel, getResourcesByRoleId, getResourceIdsByRoleId, saveRoleResource, roleManage }
