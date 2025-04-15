import multer from "multer";
import path from "path";
import fs from "fs";

//- uploads 폴더가 없으면 생성
try {
  fs.readdirSync("src/uploads");
} catch (error) {
  fs.mkdirSync("src/uploads");
}

//- 파일 저장 경로 및 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads"); //* 업로드 폴더 경로
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    ); //* 한글 파일명 인코딩 처리
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + "_" + Date.now() + ext); //* 파일 이름 설정
  },
});

//- multer 미들웨어 생성
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //* 파일 크기 제한 (5MB)
  },
});

export default upload;
