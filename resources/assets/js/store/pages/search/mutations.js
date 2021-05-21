import * as types from '../../mutation-types'
import { pushItem, setItem, updateIfExistsItem } from '../../helpers'

export default {
  [types.SEARCH_PAGE_VARIABLES]: (state, variables) => state.variables = variables,
  [types.SEARCH_PAGE_PAGINATION]: (state, pagination) => state.pagination = pagination,
  [types.SEARCH_PAGE_CONSTANTS]: (state, constants) => state.constants = constants,
  [types.SEARCH_PAGE_CURRENT_ADVISORS]: (state, advisors) => {
    if (!advisors) {
      return setItem(state, [], 'currentPageAdvisors')
    }
    return advisors.forEach((advisor) => {
      if (!updateIfExistsItem(state, advisor, 'id', 'currentPageAdvisors')) {
        pushItem(state, advisor, 'currentPageAdvisors')
      }
    })
  }
}
