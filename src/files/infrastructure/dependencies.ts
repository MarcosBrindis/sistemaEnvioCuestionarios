import { UploadFile } from '../application/usecase/UploadFile';
import { GetFile } from '../application/usecase/GetFile';
import { DeleteFile } from '../application/usecase/DeleteFile';

const uploadFile = new UploadFile();
const getFile = new GetFile();
const deleteFile = new DeleteFile();

export const fileDependencies = {
  uploadFile,
  getFile,
  deleteFile,
};
