/**
* @Author: jianglei
* @Date:   2017-10-12 12:06:49
*/
'use strict'
import Vue from 'vue'
export default function treeToArray(data, expandAll, parent, level, item) {
  const marLTemp = []
  let tmp = []
  Array.from(data).forEach(function(record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandAll)
    }
    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)
    // 부모 요소가있는 경우
    if (parent) {
      Vue.set(record, 'parent', parent)
      // 부모 요소에 오프셋이 있으면이 오프셋에서 계산해야합니다.
      // 오프셋은 이전 형제 요소, 길이 및
      if (!marLTemp[_level]) {
        marLTemp[_level] = 0
      }
      Vue.set(record, '_marginLeft', marLTemp[_level] + parent._marginLeft)
      Vue.set(record, '_width', record[item] / parent[item] * parent._width)
      // 이번에는 다음 요소에 대한 오프셋을 계산 한 후 자신의 길이를 추가하십시오.
      marLTemp[_level] += record._width
    } else {
      // 루트면
      // 오프셋 스토리지 맵 초기화
      marLTemp[record.id] = []
      // map은 길이를 저장하는 배열이며
      // 처음에는 0
      marLTemp[record.id][_level] = 0
      Vue.set(record, '_marginLeft', 0)
      Vue.set(record, '_width', 1)
    }
    tmp.push(record)
    if (record.children && record.children.length > 0) {
      const children = treeToArray(record.children, expandAll, record, _level, item)
      tmp = tmp.concat(children)
    }
  })
  return tmp
}
