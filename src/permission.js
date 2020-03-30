import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 현재 사용자가 user_info 정보 가져 오기를 완료했는지 확인
        store.dispatch('GetUserInfo').then(res => { // user_info 풀
          const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('fetchMenus')
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 역할 권한을 기반으로 액세스 가능한 라우팅 테이블 생성
            router.addRoutes(store.getters.addRouters) // 액세스 가능한 라우팅 테이블을 동적으로 추가
            next({ ...to, replace: true }) // addRoutes가 완료되었는지 확인하기 위해 해킹 방법, replace : true를 설정하여 탐색이 히스토리 레코드를 남기지 않도록하십시오
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 권한을 동적으로 변경할 필요가 없으며, 바로 다음 () 권한 판단을 삭제할 수 있습니다 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // ↑ 삭제 가능
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 로그인이없는 화이트리스트에 직접 입력하십시오
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 그렇지 않으면 모든 로그인 페이지로 리디렉션
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
