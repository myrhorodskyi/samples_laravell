export const appointmentChats = state => state.appointmentChats;
export const activeChat = state => state.chat;
export const session = state => state.openTok.session;
export const publisher = state => state.openTok.publisher;
export const onlineUsers = state => state.onlineUsers;
export const isConnected = state => _.isEmpty(state.openTok.session) ? false : state.openTok.session.currentState === 'connected';
export const isPublished = state => !_.isEmpty(state.openTok.publisher);
export const isScreenShared = state => !_.isEmpty(state.openTok.screenSharingPublisher);
