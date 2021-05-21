import store from '../../../store'
import * as types from '../../mutation-types'
import {handlePageVariablesUpdate} from "./../../helpers";

export const updateAppointmentsPageVariables = (store, params) => {
    return (handlePageVariablesUpdate('/appointments', types.APPOINTMENTS_PAGE_VARIABLES))(store, params, false);
};

export const fetchPageAppointments = ({ commit, state }) => {
    return new Promise(async (resolve, reject) => {
        store.dispatch('fetchAppointments', { variables: state.variables})
            .then(({data, current_page, total}) => {
                commit(types.APPOINTMENTS_PAGE_CURRENT_ITEMS, data);
                state.variables.page = current_page;
                state.total = total;
                resolve(data);
            })
            .catch(()=>{

            });
    })

};

export const clearPageAppointments = ({ commit, state }) => {
    commit(types.APPOINTMENTS_PAGE_CURRENT_ITEMS);
};