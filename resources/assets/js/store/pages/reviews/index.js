import mutations from "./mutations";
import * as actions from "./actions";
import * as getters from "./getters";

let state = {
    variables: {
        per_page: 10,
        advisor_id: null,
        baseUrl: '/api/review/',
        page: 0
    },
    constants: {
        per_page: {
            defaultValue: 10
        },
        baseUrl: {
            defaultValue: '/api/review/'
        },
        page: {
            defaultValue: 0
        },
        path: {
            defaultValue: null
        },
        currentPageReviews: {
            defaultValue: []
        },
        advisor_id: {
            defaultValue: null
        }
    },
    pagination: null,
    currentPageReviews: []


};


export default {mutations, actions, state, getters}