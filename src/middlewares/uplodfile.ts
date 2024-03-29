import path from "node:path";
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid';
import multer, { diskStorage, FileFilterCallback, Multer, StorageEngine  } from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage: StorageEngine = diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
    let pathname: string = selectPath(req.originalUrl.split("/")[2]);
    callback(null, path.join(pathname));
  },
  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    let extArr: string[] = file.originalname.split('.');
    let ext: string = extArr[extArr.length-1];
    callback(null, `img-${uuidv4()}.${ext}`);
  }
});

const upload: Multer = multer({ 
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      callback(null, true);
    }else {
      return callback(new Error('Invalid mime type'));
    }
  }
});

const selectPath = (path: string): string => {
  let pathname: string = "";
  switch(path){
    case 'device':
      pathname = 'public/images/device';
      break;
    case 'hospital':
      pathname = 'public/images/hospital';
      break;
    case 'user':
      pathname = 'public/images/user';
      break;
    case 'register':
      pathname = 'public/images/user';
      break;
    default:
      pathname = 'public/images';
  }
  return pathname;
}

export default upload;