export const SET_SUBSCRIBED = "SET_SUBSCRIBED";

export const setSubscribed = (value: boolean) => ({
  type: SET_SUBSCRIBED,
  payload: value,
});
