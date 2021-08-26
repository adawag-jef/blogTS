import { postAPI } from "../../utils/FetchData";
import { IUserLogin } from "../../utils/interfaces";

export const login = (userLogin: IUserLogin) => async (dispatch: any) => {
  try {
    const res = await postAPI("login", userLogin);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
