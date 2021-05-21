import mutations from "./mutations";
import * as actions from "./actions";
import * as getters from "./getters";
import {
    APPOINTMENT_STATUS_CONFIRMED,
    APPOINTMENT_STATUS_PENDING,
    APPOINTMENT_STATUS_COMPLETED,
    APPOINTMENT_STATUS_PROGRESS,
    APPOINTMENT_STATUS_PASSED,
} from '../../../constants';

let state = {
    variables: {
        page: 1,
        per_page: 6,
        status: '',
        type: 'all'
    },
    constants: {
        page: {
            defaultValue: 1
        },
        per_page: {
            defaultValue: 6
        },
        status: {
            defaultValue: [APPOINTMENT_STATUS_CONFIRMED, APPOINTMENT_STATUS_PROGRESS],
            //defaultValue: [APPOINTMENT_STATUS_CONFIRMED, APPOINTMENT_STATUS_PROGRESS, APPOINTMENT_STATUS_PENDING],
            options: [
                {value: [APPOINTMENT_STATUS_CONFIRMED, APPOINTMENT_STATUS_PROGRESS], label: 'Upcoming'},
                {value: [APPOINTMENT_STATUS_PENDING], label: 'Pending'},
                {value: [APPOINTMENT_STATUS_COMPLETED, APPOINTMENT_STATUS_PASSED], label: 'Past'},
            ]
        },
        type: {
            defaultValue: 'all',
            options: [
                {value: 'all', label: 'All Appointments'},
                {value: 'user', label: 'Advisor Appointments'},
                {value: 'advisor', label: 'Advisee Appointments'},
            ]
        },
    },
    total: null,
    items: [],
};

export default {mutations, actions, state, getters}
