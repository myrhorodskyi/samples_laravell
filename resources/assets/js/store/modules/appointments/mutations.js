import * as types from "../../mutation-types";
import {removeItem, pushItem, setItem, unsetItem, addOrUpdateItem, removeEvent} from "../../helpers";

export default {
    [types.APPOINTMENT_EVENTS_PUSH_OR_REMOVE]: (state, item) => pushItem(state, item, 'events'),
    [types.APPOINTMENT_EVENTS_REMOVE]: (state, item) => removeItem(state, item, 'events'),
    [types.APPOINTMENT_ITEM_SET]: (state, item) =>  setItem(state, item, 'appointment'),
    [types.APPOINTMENT_ITEM_UNSET]: (state, item) =>  unsetItem(state, 'appointment'),
    [types.APPOINTMENT_EVENT_UNSET]: (state, item) => removeEvent(state, item, 'events'),
    [types.APPOINTMENT_COUNT_PENDING]: (state, item) => setItem(state, item, 'count_pending'),
    [types.APPOINTMENT_COUNT_UPCOMING]: (state, item) => setItem(state, item, 'count_upcoming'),
    [types.APPOINTMENT_COUNT_PAST]: (state, item) => setItem(state, item, 'count_past'),
}
