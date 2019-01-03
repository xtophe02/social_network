import { GET_ERRORS } from "./types";
import mlab from "../components/api/Mlab";

// Register User
export const registerUser = (userData, history) => async dispatch => {
  mlab
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
  // try {
  //   const resp = await mlab.post("/api/users/register", userData);
  //   console.log(resp.data);
  // } catch (err) {
  //   dispatch({
  //     type: GET_ERRORS,
  //     payload: err.response.data
  //   });
  // }
};
