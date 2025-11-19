import { SET_SUBSCRIBED } from "./subscriptionActions";

const initialState = {
  subscribed: false,
};

export default function subscriptionReducer(state = initialState, action: any) {
  switch (action.type) {
    case SET_SUBSCRIBED:
      return { ...state, subscribed: action.payload };

    default:
      return state;
  }
}
