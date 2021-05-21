import mutations from "./mutations";
import * as actions from "./actions";
import * as getters from "./getters";

let state = {
    events: [],
    appointment: {},
    count_total:'',
    count_past:'',
    count_pending:'',
    count_upcoming:''
};


export default {mutations, actions, state, getters}
