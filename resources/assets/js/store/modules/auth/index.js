import mutations from "./mutations";
import Cookies from 'js-cookie'
import * as actions from "./actions";
import * as getters from "./getters";

let state = {
    authToken: Cookies.get('token'),
    authUser: null
};

export default {mutations, actions, state, getters}
