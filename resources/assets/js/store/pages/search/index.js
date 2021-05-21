import mutations from "./mutations";
import * as actions from "./actions";
import * as getters from "./getters";

let state = {
    variables: {
        offset: 0,
        per_page: 6,
        query_string: '',
        country: null,
        industries: [],
        offers: [],
        skills:[],
        min_rates: null,
        max_rates: null,
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null,
    },
    constants: {
        offset: {
            defaultValue: 0
        },
        per_page: {
            defaultValue: 6
        },
        query_string: {
            defaultValue: ''
        },
        country: {
            defaultValue: null
        },
        industries: {
            defaultValue: []
        },
        offers: {
            defaultValue: []
        },
        skills: {
            defaultValue: []
        },
        min_rates: {
            defaultValue: null
        },
        max_rates: {
            defaultValue: null
        },
        start_date: {
            defaultValue: null
        },
        end_date: {
            defaultValue: null
        },
        start_time: {
            defaultValue: null
        },
        end_time: {
            defaultValue: null
        },
    },
    pagination: null,
    currentPageAdvisors: []
};

export default {mutations, actions, state, getters}