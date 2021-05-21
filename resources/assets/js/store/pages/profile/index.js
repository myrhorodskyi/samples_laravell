import mutations from "./mutations";
import * as actions from "./actions";
import * as getters from "./getters";

let state = {
    targetUser: {},
    isPreviewMode: false
};

export default {mutations, actions, state, getters}