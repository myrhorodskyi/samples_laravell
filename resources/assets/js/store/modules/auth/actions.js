import axios from 'axios'
import { router } from './../../../app';
import * as types from '../../mutation-types'
import store from '../../../store'

export const login = ({ commit }, formData) => {
    return new Promise((resolve, reject) => {
        formData.post('/api/login')
            .then(({ data }) => {
                commit(types.SAVE_AUTH_TOKEN, {token: data.token, expires_in: data.expires_in});
                resolve();
            })
            .catch(() => reject());
    })
};
export const logout = ({ commit }) => {
    axios.post('/api/logout')
        .then(() => {
            commit(types.REMOVE_AUTH_TOKEN);
            commit(types.REMOVE_AUTH_USER);
            router.push({path:'/auth/login'});
        })
        .catch((rej) => {
            swal({
                title: 'Oops!',
                html: '<p>Something went wrong!</p><p>Please reload the page and try again</p>',
                allowOutsideClick: false
            })
        })
};

export const becomeAnUser = ({ commit }, formData) => {
    return new Promise((resolve, reject) => {
        formData.post('/api/become-an-user')
            .then(({ data }) => {
                let user = data;
                commit(types.SAVE_AUTH_USER, {user});
                resolve();
            })
            .catch(() => reject());
    })
};

export const verifyUser = ({commit}, code) => {
    return new Promise((resolve, reject) => {
        axios.get('/api/verify/' + code)
            .then(({ data }) => {
                if(data.success){
                    commit(types.SAVE_AUTH_TOKEN, {token: data.token, expires_in: data.expires_in});
                    resolve();
                } else {
                    reject();
                }
            })
            .catch(() => reject());
    })
};

export const registerUser = ({ commit }, formData) => {
    return new Promise((resolve, reject) => {
        formData.post('/api/register').then(({data}) => {
          resolve(data)
        })
          /*  .then(({ data }) => {
                commit(types.SAVE_AUTH_TOKEN, {token: data.token, expires_in: data.expires_in});
                resolve();
            })*/
            .catch((rej) => {
                if(formData.errors.has('email') && formData.errors.errors.email.indexOf('The email has already been taken') > -1){
                    ifEmailRegistered(formData.email);
                }
                reject();
            });
    })
};

export const userValidate = ({commit}, user) => {
    return new Promise((resolve, reject) => {
        let endpoint = store.getters.authCheck ? '/api/user/validate' : '/api/auth/user/validate';

        user.post(endpoint)
            .then(()=>resolve())
            .catch(()=>{
                if(user.errors.has('email') && user.errors.errors.email.indexOf('The email has already been taken') > -1){
                    ifEmailRegistered(user.email);
                }
                reject();
            })
    })
};
const ifEmailRegistered = (email) => {
    swal({
        title: 'This email address is already registered',
        showCancelButton: true,
        text: "Would you like to to sign into this account",
        type: "warning",
        confirmButtonText: "Login",
    })
        .then((ok) => {
          if (ok) {
            router.push({ name: 'auth.login', params: {email:  email} });
          }
        })
};

export const fetchAuthUser = ({ commit }) => {
    return new Promise(async (resolve, reject) => {
        axios.get('/api/auth/user')
            .then( ({data}) => {
                let user = data;
                commit(types.SAVE_AUTH_USER, {user});
                resolve(user);
            })
            .catch(() => {
                commit(types.REMOVE_AUTH_TOKEN);
                commit(types.REMOVE_AUTH_USER);
                reject();
            });
    })
};

export const setActiveRole = ({ state, commit }, payload) => {
    return new Promise(async (resolve, reject) => {
        if(_.indexOf(state.authUser.roles, payload) > -1){
            commit(types.ACTIVE_ROLE, payload);
            resolve();
        } else {
            reject();
        }
    })
};


export const getAuthUserTimezone = ({ commit }) => {
    return new Promise(async (resolve, reject) => {
        axios.get('/api/auth/user/timezone')
            .then(({data}) => {
                resolve(data);
            }).catch((rej) => {
                reject(rej);
            });
    })
};

export const sendCloseRegister = ({ commit }, formData) => {

	return new Promise((resolve, reject) => {
		formData.post('/api/close-register')
			.then(({ data }) => {
				resolve(data);
			})
			.catch(() => reject());
	})
};

