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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const user_entity_1 = require("./entity/user.entity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_data_source_1 = require("../../app-data.source");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    create(signupInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = yield bcrypt_1.default.hash(signupInput.password, 10);
            const user = this.userRepository.create(Object.assign(Object.assign({}, signupInput), { password }));
            return yield this.userRepository.save(user);
        });
    }
    findOneByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            //only if  @Column({ select: false } )
            const user = yield this.userRepository
                .createQueryBuilder('user')
                .select('user')
                .addSelect('user.password')
                .where('email = :email', { email })
                .getOne();
            return user;
        });
    }
}
exports.UserService = UserService;
exports.userService = new UserService(app_data_source_1.AppDataSource.getRepository(user_entity_1.User));
