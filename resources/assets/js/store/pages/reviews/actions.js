import store from '../../../store'
import * as types from '../../mutation-types'
import {handlePageVariablesUpdate} from "./../../helpers";

export const updateReviewsPageVariables = (store, params) => {
    return (handlePageVariablesUpdate('/advisor/' + params.advisor_id +'/reviews', types.REVIEWS_PAGE_VARIABLES))(store, params, false);
};

export const fetchPageReviews = ({ commit, state }, params) => {
    return new Promise(async (resolve, reject) => {
        store.dispatch('fetchReviews', {advisor_id: state.variables.advisor_id, variables: state.variables})
            .then((data)=>{
                let newReviews = data.data,
                    pagination = { per_page: 10, path: data.path, page: data.current_page },
                    currentReviews = store.getters.currentPageReviews,
                    reviews = _.concat(currentReviews, newReviews);
                commit(types.REVIEWS_PAGE_CURRENT_REVIEWS, { reviews });
                commit(types.REVIEWS_PAGE_PAGINATION, { pagination });
                resolve();
            })
            .catch(()=>{

            });
    })

};
export const clearPageReviews = ({ commit, state }, params) => {
    commit(types.REVIEWS_PAGE_CURRENT_REVIEWS_CLEAR);
};