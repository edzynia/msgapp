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
exports.appModule = exports.AppModule = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const auth_resolvers_1 = require("./auth/auth.resolvers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_data_source_1 = require("./app-data.source");
class AppModule {
    constructor(resolvers) {
        this.resolvers = resolvers;
    }
    startApollo() {
        return __awaiter(this, void 0, void 0, function* () {
            yield app_data_source_1.AppDataSource.initialize();
            const typeDefs = (0, fs_1.readFileSync)('schema.graphql', { encoding: 'utf-8' });
            const app = (0, express_1.default)();
            const httpServer = http_1.default.createServer(app);
            const server = new apollo_server_express_1.ApolloServer({
                resolvers: this.resolvers,
                typeDefs,
                context: ({ req, res }) => {
                    let payload;
                    try {
                        payload = jsonwebtoken_1.default.verify(req.headers.authorization || '', process.env.JWT_KEY);
                    }
                    catch (err) {
                        payload = null;
                    }
                    return {
                        currentUser: payload,
                        req,
                        authorized: !!payload,
                    };
                },
            });
            yield server.start();
            server.applyMiddleware({ app });
            return { httpServer, server };
        });
    }
}
exports.AppModule = AppModule;
exports.appModule = new AppModule(auth_resolvers_1.authResolvers);
