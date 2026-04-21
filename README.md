# ZRC Twitter Clone Backend (Next.js Beginner Course)

이 프로젝트는 ZeroCho님의 "Next.js로 시작하는 웹 서비스 개발" 강의를 기반으로 한 트위터 클론 프로젝트의 백엔드 서버입니다. Express와 Sequelize를 사용하여 구축되었으며, 사용자 인증, 게시글 관리, 이미지 업로드 등의 기능을 제공합니다.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL (Sequelize ORM)
- **Authentication**: Passport.js (Local Strategy)
- **Image Upload**: Multer
- **Development Tool**: Nodemon, ts-node

## ✨ Key Features

- **사용자 관리**: 회원가입, 로그인/로그아웃, 닉네임 수정
- **게시글 관리**: 게시글 작성/삭제, 이미지 업로드(Multer), 해시태그 추출
- **상호작용**: 게시글 좋아요/취소, 댓글 작성, 리트윗
- **관계 관리**: 팔로우/언팔로우, 팔로워/팔로잉 목록 조회
- **보안**: bcrypt를 통한 비밀번호 암호화, CORS 설정, 세션 기반 인증

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ 권장)
- MySQL Server

### Installation

```bash
# 저장소 클론
git clone <repository-url>
cd zrc_next_beginner_backend

# 의존성 설치
npm install
```

### Environment Variables

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 설정을 입력합니다.

```env
PORT=3065
FRONT_SERVER_HOST=http://localhost:3000
COOKIE_SECRET=your_cookie_secret
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=zrc_twitter
MYSQL_HOST=127.0.0.1
```

### Running the App

```bash
# 개발 모드 (Nodemon)
npm run start:dev

# 빌드 및 프로덕션 모드
npm run build
npm run start
```

## 📂 Directory Structure

```text
src/
├── config/        # Sequelize 및 환경 설정
├── middlewares/   # 로그인 여부 확인 등 커스텀 미들웨어
├── migrations/    # DB 마이그레이션 파일
├── models/        # Sequelize 데이터베이스 모델
├── passport/      # Passport 인증 전략 (Local)
├── routes/        # API 라우터 (User, Post, Posts, Hashtag)
├── seeders/       # 초기 데이터 시딩
├── uploads/       # 업로드된 이미지 저장 디렉토리
└── index.ts       # 서버 엔트리 포인트
```

## 🔗 API Endpoints (Main)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/user/login` | 로그인 |
| POST | `/user` | 회원가입 |
| GET | `/posts` | 전체 게시글 조회 |
| POST | `/post` | 게시글 작성 |
| POST | `/post/:postId/comment` | 댓글 작성 |
| PATCH | `/post/:postId/like` | 게시글 좋아요 |
| POST | `/post/:postId/retweet` | 리트윗 |

---

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.
