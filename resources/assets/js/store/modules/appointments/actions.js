import * as types from '../../mutation-types';
import axios from 'axios';

export const validateAppointment = ({commit}, appointment) => {
    return new Promise(async (resolve, reject) => {
        params.schedule.post('/api/person/' + params.userId + '/schedule/');
    })
};

export const addAppointmentItem = ({commit}, item) => {
    commit(types.APPOINTMENT_EVENTS_PUSH_OR_REMOVE, item);
};
export const removeAppointmentItem = ({commit}, item) => {
    commit(types.APPOINTMENT_EVENTS_REMOVE, item);
};

export const removeDraftAppointmentItem = ({commit, dispatch}, item) => {
    return new Promise(async (resolve, reject) => {
        commit(types.APPOINTMENT_EVENT_UNSET, item);
        dispatch('removeDailyEvent', item);
        resolve(item);
    });
};

export const createAppointment = ({commit}, appointment) => {
    return new Promise(async (resolve, reject) => {
        appointment.post('/api/appointments')
            .then(({data})=>{
                resolve(data);
            })
            .catch((rej)=>{
                reject(rej);
            });
    })
};

export const pay = ({commit}, props) => {
    return new Promise(async (resolve, reject) => {
        axios.post('/api/pay', props)
            .then(({data})=>{
                resolve(data);
            })
            .catch((rej)=>{
                reject();
            });
    })
};

export const attachCode = ({commit, dispatch}, data) => {
    return new Promise(async (resolve, reject) => {
        data.form.post('/api/appointments/' + data.appointment_id + '/attach-code')
            .then(({data})=>{
                    commit(types.APPOINTMENT_ITEM_SET, data);
                dispatch('setAppointmentChats', data.chats);
                resolve(data);
            })
            .catch((rej)=>{
                reject();
            });
    })
};

export const attachBalance = ({commit, dispatch}, data) => {
    return new Promise(async (resolve, reject) => {
        data.form.post('/api/appointments/' + data.appointment_id + '/attach-balance')
            .then(({data})=>{
                commit(types.APPOINTMENT_ITEM_SET, data);
                dispatch('setAppointmentChats', data.chats);
                resolve(data);
            })
            .catch((rej)=>{
                reject();
            });
    })
};

export const removeCode = ({commit, dispatch}, props) => {
    return new Promise(async (resolve, reject) => {
        axios.post('/api/appointments/' + props.appointment_id + '/remove-code')
            .then(({data})=>{
                commit(types.APPOINTMENT_ITEM_SET, data);
                dispatch('setAppointmentChats', data.chats);
                resolve(data);
            })
            .catch((rej)=>{
                reject();
            });
    })
};

export const removeBalance = ({commit, dispatch}, props) => {
    return new Promise(async (resolve, reject) => {
        axios.post('/api/appointments/' + props.appointment_id + '/remove-balance')
            .then(({data})=>{
                commit(types.APPOINTMENT_ITEM_SET, data);
                dispatch('setAppointmentChats', data.chats);
                resolve(data);
            })
            .catch((rej)=>{
                reject();
            });
    })
};

export const  getAppointment = ({commit, dispatch}, appointment_id) => {
    return new Promise(async (resolve, reject) => {
        axios.get('/api/appointments/' + appointment_id)
            .then(({data})=>{
                commit(types.APPOINTMENT_ITEM_SET, data);
                dispatch('setAppointmentChats', data.chats);
                resolve(data);
            })
            .catch((rej)=>{
                reject(rej);
            });
    })
};

export const  clearAppointmentData = ({commit}) => {
    commit(types.APPOINTMENT_ITEM_UNSET);
};

export const fetchAppointments = ({ commit }, params) => {
    return new Promise(async (resolve, reject) => {
        axios.get('/api/appointments', {params: params.variables})
            .then(({data}) => {
                resolve(data);
            })
            .catch((rej) => {
                reject(rej);
            });
    });
};

export const confirmAppointment = ({ commit }, appointment_id) => {
    return new Promise(async (resolve, reject) => {
        axios.post('/api/appointments/' + appointment_id + '/confirm')
            .then(({data}) => {
                commit(types.APPOINTMENT_ITEM_SET, data);
                commit(types.APPOINTMENTS_PAGE_CURRENT_ITEMS_UPDATE_ITEM, data);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const cancelAppointment = ({ commit }, appointment_id) => {
    return new Promise(async (resolve, reject) => {
        axios.post('/api/appointments/' + appointment_id + '/cancel')
            .then(({data}) => {
                commit(types.APPOINTMENT_ITEM_SET, data);
                commit(types.APPOINTMENTS_PAGE_CURRENT_ITEMS_UPDATE_ITEM, data);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const rejectAppointment = ({ commit }, appointment_id) => {
    return new Promise(async (resolve, reject) => {
        axios.post('/api/appointments/' + appointment_id + '/reject')
            .then(({data}) => {
                commit(types.APPOINTMENT_ITEM_SET, data);
                commit(types.APPOINTMENTS_PAGE_CURRENT_ITEMS_UPDATE_ITEM, data);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

