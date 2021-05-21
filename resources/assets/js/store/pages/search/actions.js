import {handlePageVariablesUpdate} from "./../../helpers";
import * as types from '../../mutation-types'
import axios from 'axios'

export const updateSearchPageVariables = handlePageVariablesUpdate('/search', types.SEARCH_PAGE_VARIABLES);

export const fetchAdvisorsByQuery = (store, page) => {
    let variables = store.state.variables,
        options = {
            params: Object.assign({page: page}, variables)
        };
    return axios.get(`/api/search`, options).then(response => {
        store.commit(types.SEARCH_PAGE_CURRENT_ADVISORS, response.data);
        return response;
    })
};
export const clearStoredAdvisors = (store) => {
    store.commit(types.SEARCH_PAGE_CURRENT_ADVISORS);
};