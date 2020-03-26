import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 가짜 주소
    method: 'get'
  })
}
