"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBusiness = void 0;
const BadRequestError_1 = require("../errors/BadRequestError");
const NotFoundError_1 = require("../errors/NotFoundError");
const User_1 = require("../models/User");
const types_1 = require("../types");
class UserBusiness {
    constructor(tokenMananger, hashManager, userDatabase, idGenerator) {
        this.tokenMananger = tokenMananger;
        this.hashManager = hashManager;
        this.userDatabase = userDatabase;
        this.idGenerator = idGenerator;
        this.signup = (input) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = input;
            if (typeof name !== "string") {
                throw new BadRequestError_1.BadRequestError("'name' deve ser string");
            }
            if (typeof email !== "string") {
                throw new BadRequestError_1.BadRequestError("'email' deve ser string");
            }
            if (typeof password !== "string") {
                throw new BadRequestError_1.BadRequestError("'password' deve ser string");
            }
            const hashPassword = yield this.hashManager.manager(password);
            const id = this.idGenerator.generateid();
            const newUserr = new User_1.User(id, name, email, hashPassword, types_1.USER_ROLES.NORMAL, new Date().toISOString());
            const newUserrDB = newUserr.toDBModel();
            yield this.userDatabase.insertUser(newUserrDB);
            const payload = {
                id: newUserr.getId(),
                name: newUserr.getName(),
                role: newUserr.getRole()
            };
            const token = this.tokenMananger.createTokenload(payload);
            const out = {
                message: "Cadastro realizado com sucesso",
                token
            };
            return out;
        });
        this.login = (input) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = input;
            if (typeof email !== "string") {
                throw new Error("'email' deve ser string");
            }
            if (typeof password !== "string") {
                throw new Error("'password' deve ser string");
            }
            const userDB = yield this.userDatabase.findUserByEmail(email);
            if (!userDB) {
                throw new NotFoundError_1.NotFoundError("'email' não encontrado");
            }
            const okPassword = yield this.hashManager.comparehash(password, userDB.password);
            if (!okPassword) {
                throw new BadRequestError_1.BadRequestError("Email ou senha incorretos!");
            }
            const user = new User_1.User(userDB.id, userDB.name, userDB.email, userDB.password, userDB.role, userDB.created_at);
            const tpayload = {
                id: user.getId(),
                name: user.getName(),
                role: user.getRole()
            };
            const token = this.tokenMananger.createTokenload(tpayload);
            const loutput = {
                message: "Login realizado com sucesso",
                token
            };
            return loutput;
        });
    }
}
exports.UserBusiness = UserBusiness;
//# sourceMappingURL=UserBusiness.js.map