import axios from 'axios'
import * as types from '../../mutation-types'

export const personValidate = ({commit}, person) => {
    return person.post('/api/person/validate');
};

export const fetchPerson = ({ commit }, userId) => {
    return new Promise(async (resolve, reject) => {
        axios.get('/api/person/' + userId)
            .then(({data})=>{
                let person = data;
                commit(types.FETCH_PERSON_SUCCESS, { person });
                resolve(person);
            })
            .catch(() => {
                commit(types.FETCH_PERSON_FAILURE);
                resolve()
            });
    })
};
