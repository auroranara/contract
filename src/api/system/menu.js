import request from '@/utils/request'

export function getMenusTree() {
  return request({
    url: '/end/menus/tree',
    method: 'get'
  })
}

export function buildMenus() {
  return request({
    url: '/end/menus/build',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/end/menus',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/end/menus',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/end/menus',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMenusTree }
