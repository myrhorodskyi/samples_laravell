import * as types from "../../mutation-types";

export default {
    [types.REVIEWS_PAGE_VARIABLES]: (state, variables) => state.variables = variables,
    [types.REVIEWS_PAGE_PAGINATION]: (state, reviewsPage) => state.pagination = reviewsPage.pagination,
    [types.REVIEWS_PAGE_CONSTANTS]: (state, reviewsPage) => state.constants = reviewsPage.constants,
    [types.REVIEWS_PAGE_CURRENT_REVIEWS]: (state, reviewsPage) => state.currentPageReviews = reviewsPage.reviews,
    [types.REVIEWS_PAGE_CURRENT_REVIEWS_CLEAR]: (state, reviewsPage) => state.currentPageReviews = []
}