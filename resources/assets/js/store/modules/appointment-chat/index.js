import mutations from "./mutations";
import * as actions from "./actions";
import * as getters from "./getters";

let state = {
    appointmentChats: [],
    chat: null,
    onlineUsers: [],
    openTok: {
        otKey: null,
        otToken: null,
        otSessionId: null,
        session: null,
        publisher: null,
        subscriber: null,
        stream: null,
        screenSharingPublisher:null
    },
    constants: {
        openTok : {
            otKey: {
                defaultValue: null
            },
            otToken: {
                defaultValue: null
            },
            otSessionId: {
                defaultValue: null
            },
            session: {
                defaultValue: null
            },
            publisher: {
                defaultValue: null
            },
            subscriber: {
                defaultValue: null
            },
            stream: {
                defaultValue: null
            },
            screenSharingPublisher: {
                defaultValue: null
            },

        }

    }
};


export default {mutations, actions, state, getters}
