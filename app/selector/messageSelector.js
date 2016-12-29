/**
 * Created by yangyang on 2016/12/21.
 */

export function messengerClient(state) {
  const client = state.MESSAGE.get('client')
  return client
}

export function getConversationById(state, id) {
  return state.MESSAGE.getIn(['conversationMap', id])
}

export function activeConversation(state) {
  return state.MESSAGE.get('activeConversation')
}

export function getMessages(state, cid) {
  let conversation = getConversationById(state, cid)
  if (conversation) {
    return conversation.get('messages').toJS()
  }
  return []
}