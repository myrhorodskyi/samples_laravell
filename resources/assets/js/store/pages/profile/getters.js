import store from '../../../store'

export const targetUser = state => {
    return state.targetUser;
};
export const isProfileOwner = state => {
    if(_.isEmpty(state.targetUser) || _.isEmpty(store.getters.authUser)) return false;
    return state.targetUser.id === store.getters.authUser.id
};
export const isPreviewMode = state => {
    return state.isPreviewMode;
};