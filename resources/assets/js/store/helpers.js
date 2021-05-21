// import makeRouter from './util/router';
// const router = makeRouter(routes)
import { router } from './../app';
import Vue from "vue";

export const addOrUpdateItem = (state, item, key = 'id', node = 'items') => {
    if (_itemExists(state[node], item, key)) {
        Vue.set(state, node, _listWithUpdatedItem(state[node], item, key));
    } else {
        Vue.set(state, node, [...state[node], item]);
    }
};

export const updateIfExistsItem = (state, item, key = 'id', node = 'items') => {
    if (_itemExists(state[node], item, key)) {
        Vue.set(state, node, _listWithUpdatedItem(state[node], item, key));
        return true;
    }
    return false;
};

export const setItem = (state, item, node = 'item') => {
    Vue.set(state, node, item);
};
export const unsetItem = (state, node = 'item') => {
    Vue.set(state, node, null);
};

export const pushItem = (state, item, node = 'items') => {
    if(_.isArray(state[node])){
        state[node].push(item);
    }
};
export const removeItem = (state, item, node = 'items') => {
    if(_.isArray(state[node])){
        if(state[node].length){
            state[node].forEach((i,index) => {
                if(_.isEqual(i, item))
                    state[node].splice(index, 1);
            })
        }
    }
};

/**
 * @param state
 * @param item
 * @param node
 * remove appointment time slot
 */

export const removeEvent = (state, item, node = 'items') => {
    if(_.isArray(state[node])){
        if(state[node].length){
            state[node].forEach((i,index) => {
                console.log(i, item);
                if(i.id === item.id) {
                    state[node].splice(index, 1);
                }
            })
        }
    }
};

export const findItem = (state, value, key = 'id', node = 'items') => {
    return _.find(state[node], existing => existing[key] == value);
};

const _listWithUpdatedItem = (items, item, key) => {
    return _.map(items, existing => {
        if (existing[key] === item[key]) {
            return Object.assign(existing, item)
        }
        return existing;
    })
};

const _itemExists = (items, item, key) => {
    return _.findIndex(items, existing => existing[key] === item[key]) > -1;
};
/**
 * Creates a function which updates the url and commits page variables to the store
 *
 * Example: ./modules/pages/admin-messages/actions.js
 *
 * @param pageUrl
 * @param variablesMutation
 * @returns {Function}
 */

export const handlePageVariablesUpdate = (pageUrl, variablesMutation) => {
    return (store, variables, shouldReplace = true) => {
        let constants = store.state.constants,
            copy = Object.assign({}, variables),
            old = Object.assign({}, store.state.variables),
            query = {}, changes;

        changes = objDifference(copy, old);

        if (variablesMutation.page && _.without(changes, 'page').length) {
            copy['page'] = 1;
        }

        for (let param in copy) {
            if (copy[param] != constants[param].defaultValue) {
                query[param] = copy[param];
            }
        }
        if(shouldReplace){
            router.replace({path: pageUrl, query: query});
        }

        store.commit(variablesMutation, copy);

        return changes;
    }
};

/**
 * Returns o1 keys values of which don't much with o2
 * @param o1
 * @param o2
 * @returns {Array}
 */

export const objDifference = (o1, o2) => {
    let result = [];

    for (let key in o1) {
        if (o1[key] instanceof Object) {
            var diff = objDifference(o1[key], o2[key] instanceof Object ? o2[key] : {})
            for (var i in diff) {
                result.push(key + '.' + diff[i]);
            }
        } else {
            if (o1[key] != o2[key]) result.push(key);
        }
    }

    return result;
};