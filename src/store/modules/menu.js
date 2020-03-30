import { fetchMenus } from '@/api/menu'

const menu = {
  state: {
    menu: []
  },

  mutations: {
    SET_MENU: (state, menu) => {
      state.menu = menu
    }
  },

  actions: {
    // 메뉴읽어오기
    fetchMenus({ commit }) {
      return new Promise((resolve, reject) => {
        fetchMenus().then(response => {
          const data = response.data
          console.log(data)
          commit('SET_MENU', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default menu
