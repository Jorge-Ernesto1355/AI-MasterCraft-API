import { getRefreshToken } from "./auth/getRefreshToken";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { GetUserById } from "./GetuserById";

const getUserbyId = new GetUserById();
const register = new Register();
const login = new Login();
const refreshToken = new getRefreshToken();

export { getUserbyId, register, login, refreshToken };
