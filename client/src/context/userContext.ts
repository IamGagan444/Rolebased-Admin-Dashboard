import { useContext, createContext } from "react";
import { User } from "../types/user";

export const userContext = createContext({
  userData:null,
  setUserData:(value:any|User)=>{}
});

export const UserContextProvider = userContext.Provider;

export default function CustomUser() {
  return useContext(userContext);
}
