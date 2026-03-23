"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileDependencies = void 0;
const UploadFile_1 = require("../application/usecase/UploadFile");
const GetFile_1 = require("../application/usecase/GetFile");
const DeleteFile_1 = require("../application/usecase/DeleteFile");
const uploadFile = new UploadFile_1.UploadFile();
const getFile = new GetFile_1.GetFile();
const deleteFile = new DeleteFile_1.DeleteFile();
exports.fileDependencies = {
    uploadFile,
    getFile,
    deleteFile,
};
