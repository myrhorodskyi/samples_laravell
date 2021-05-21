import axios from 'axios'
import * as types from '../../mutation-types'

export const fetchTargetUser = ({ commit }, id) => {
    return new Promise(async (resolve, reject) => {
        axios.get('/api/user/' + id)
            .then(({data}) => {
                let user = data;
                commit(types.PROFILE_USER, { user });
                resolve(user);
            })
            .catch(() => {
                commit(types.PROFILE_USER, null);
                reject();
            });
    })
};

export const fetchTargetUserByHash = ({ commit }, hash) => {
    return new Promise(async (resolve, reject) => {
        axios.get('/api/user/public/' + hash)
            .then(({data}) => {
                let user = data;
                commit(types.PROFILE_USER, { user });
                resolve(user);
            })
            .catch(() => {
                commit(types.PROFILE_USER, null);
                reject();
            });
    })
};

export const setPreviewMode = ({ commit }) => {
    commit(types.PROFILE_ADVISOR_SET_PREVIEW_MODE);
};
export const unsetPreviewMode = ({ commit }) => {
    commit(types.PROFILE_ADVISOR_UNSET_PREVIEW_MODE);
};