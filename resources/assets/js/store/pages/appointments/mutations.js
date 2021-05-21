import * as types from "../../mutation-types";
import {removeItem, pushItem, setItem, updateIfExistsItem} from "../../helpers";

export default {
    [types.APPOINTMENTS_PAGE_VARIABLES]: (state, item) => state.appointments = setItem(state, item, 'variables'),
    [types.APPOINTMENTS_PAGE_CONSTANTS]: (state, item) => setItem(state, item, 'constants'),
    [types.APPOINTMENTS_PAGE_CURRENT_ITEMS]: (state, items) => {
        if(!items){
            return setItem(state, [], 'items')
        }
        return items.forEach((item) => {
            pushItem(state, item, 'items')
        });
    },
    [types.APPOINTMENTS_PAGE_CURRENT_ITEMS_UPDATE_ITEM]: (state, item) => updateIfExistsItem(state, item),

}

