import * as types from "../../mutation-types";

export default {
    [types.FETCH_PERSON_SUCCESS] (state, { person }) {
        person.industries.forEach((v,k)=>{
            delete person.industries[k].pivot;
        });
        person.offers.forEach((v,k)=>{
            delete person.offers[k].pivot;
        });
        state.person = person;
    },
    [types.FETCH_PERSON_FAILURE] (state) {
        state.person = null;
    }
}
