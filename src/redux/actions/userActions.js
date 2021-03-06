import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
} from '../types';
import axios from 'axios';

export const loginUser = (userData, history) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.post('/login', userData);
    setAuthorizationHeader(res.data.token);
    await dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });
    history.push('/');
  } catch (err) {
    console.log(err.response.data);
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIdToken');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    const res = await axios.get('/user');
    dispatch({
      type: SET_USER,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const signupUser = (newUserData, history) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.post('/signup', newUserData);
    setAuthorizationHeader(res.data.token);
    dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });
    history.push('/');
  } catch (err) {
    console.log(err.response.data);
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data,
    });
  }
};

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
};

export const markNotificationsRead = (notificationIds) => async (dispatch) => {
  try {
    await axios.post('/notifications', notificationIds);
    dispatch({ type: MARK_NOTIFICATIONS_READ });
  } catch (error) {
    console.log(error);
  }
};
