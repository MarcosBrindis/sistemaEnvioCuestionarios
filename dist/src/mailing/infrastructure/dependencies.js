"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailingDependencies = void 0;
const MysqlEmailAccountRepository_1 = require("./database/mysql/MysqlEmailAccountRepository");
const CreateAccountUseCase_1 = require("../application/usecase/CreateAccountUseCase");
const GetAccountsUseCase_1 = require("../application/usecase/GetAccountsUseCase");
const UpdateAccountUseCase_1 = require("../application/usecase/UpdateAccountUseCase");
const DeleteAccountUseCase_1 = require("../application/usecase/DeleteAccountUseCase");
const emailAccountRepository = new MysqlEmailAccountRepository_1.MysqlEmailAccountRepository();
const createAccountUseCase = new CreateAccountUseCase_1.CreateAccountUseCase(emailAccountRepository);
const getAccountsUseCase = new GetAccountsUseCase_1.GetAccountsUseCase(emailAccountRepository);
const updateAccountUseCase = new UpdateAccountUseCase_1.UpdateAccountUseCase(emailAccountRepository);
const deleteAccountUseCase = new DeleteAccountUseCase_1.DeleteAccountUseCase(emailAccountRepository);
exports.mailingDependencies = {
    createAccountUseCase,
    getAccountsUseCase,
    updateAccountUseCase,
    deleteAccountUseCase,
};
