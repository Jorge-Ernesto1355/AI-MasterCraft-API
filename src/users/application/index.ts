import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { GetUserById } from "./GetuserById";

const getUserbyId = new GetUserById();
const register = new Register();
const login = new Login();

export { getUserbyId, register, login };
