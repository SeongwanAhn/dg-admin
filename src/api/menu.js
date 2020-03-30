import request from '@/utils/request'

export function fetchMenus(query) {
  return request({
    url: '/api/v1/menus',
    method: 'get',
    params: query
  })
}

export function saveMenu(menu) {
  return request({
    url: '/api/v1/menus',
    method: 'post',
    data: menu
  })
}

