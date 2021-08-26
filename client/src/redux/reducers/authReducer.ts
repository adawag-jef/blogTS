import { AUTH, IAuth, IAuthType } from "../types/authTypes";

const authReducer = (state: any = {}, action: IAuthType): IAuth => {
  switch (action.type) {
    case AUTH:
      return action.payload;

    default:
      return state;
  }
};

export default authReducer;
