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
exports.authResolvers = void 0;
const user_service_1 = require("./user/user.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const graphql_1 = require("graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.authResolvers = {
    Mutation: {
        signup(parent, { input }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const existingUser = yield user_service_1.userService.findOneByEmail(input.email);
                if (existingUser)
                    throw new graphql_1.GraphQLError('user already exist ', {
                        extensions: { code: 'BAD_REQUEST' },
                    });
                const user = yield user_service_1.userService.create(input);
                const jwtToken = jsonwebtoken_1.default.sign({ email: input.email, id: user.id }, process.env.JWT_KEY, { expiresIn: '7 days' });
                return { user, jwt: jwtToken };
            });
        },
        signin(parent, { input }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield user_service_1.userService.findOneByEmail(input.email);
                if (!user)
                    throw new graphql_1.GraphQLError('wrong credentials ', {
                        extensions: { code: 'BAD_REQUEST' },
                    });
                const correctPwd = yield bcrypt_1.default.compare(input.password, user.password);
                if (!correctPwd)
                    throw new graphql_1.GraphQLError('wrong credentials ', {
                        extensions: { code: 'BAD_REQUEST' },
                    });
                const jwtToken = jsonwebtoken_1.default.sign({ email: input.email, id: user.id }, process.env.JWT_KEY, { expiresIn: '7 days' });
                return { user, jwt: jwtToken };
            });
        },
    },
    Query: {
        currentUser(parent, {}, context) {
            if (!context.authorized)
                throw new graphql_1.GraphQLError('not authorized', {
                    extensions: { code: 'UNOTHORIZED' },
                });
            return context.currentUser;
        },
    },
};
