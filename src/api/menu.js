import request from '@/utils/request'
export function fetchMenus(query) {
    return request({
      url: '/article/list',
      method: 'get',
      params: query
    })
  }