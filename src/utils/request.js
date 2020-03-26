import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // API의 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 각 요청에 토큰을 전달하십시오. [ 'X-Token']은 맞춤 키입니다. 실제 상황에 따라 수정하십시오
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => response,
  /**
  * 다음 주석은 응답에서 코드를 사용자 정의하여 요청 상태를 나타냅니다.
  * 코드가 다음 조건을 반환하면 권한에 문제가 있고 로그 아웃 한 후 로그인 페이지로 돌아 가기
  * xmlhttprequest를 사용하여 상태 코드를 식별하려는 경우 아래 오류로 논리를 작성할 수 있습니다.
  * 다음 코드는 예입니다. 필요에 따라 수정하십시오. 필요하지 않은 경우 삭제할 수 있습니다.
  */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008 : 잘못된 토큰; 50012 : 로그인 한 다른 클라이언트; 50014 : 토큰이 만료되었습니다.
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // MessageBox를 직접 소개 해주세요
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('로그 아웃했습니다.이 페이지에 머 무르려면 취소하거나 다시 로그인하여 '로그 아웃하십시오', '확인', {
  //         confirmButtonText: '다시 로그인',
  //         cancelButtonText: '취소',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() //버그를 피하기 위해 vue-router 객체를 다시 인스턴스화하려면
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
