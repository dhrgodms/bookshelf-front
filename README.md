# 📚 Bookshelf

> 흩어진 책들을 한곳에 모아 나만의 방식으로 정리하고 새로운 책을 발견해 보세요!

## 🎯 프로젝트 소개

Bookshelf는 개인 도서 관리 및 독서 커뮤니티 플랫폼입니다. 사용자들이 자신의 책장을 만들고, 책을 검색하고, 다른 사용자들과 독서 경험을 공유할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📖 **책 검색**: 도서 검색 및 정보 조회
- 📱 **바코드 스캔**: ISBN 바코드를 통한 빠른 책 추가
- 📚 **개인 책장**: 나만의 책장 생성 및 관리
- 🔍 **책장 검색**: 다른 사용자들의 책장 탐색
- 👥 **회원 관리**: 로그인/회원가입 및 프로필 관리
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 🛠️ 기술 스택

### Frontend
- **Framework**: Vue.js 3
- **UI Framework**: Quasar Framework
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Build Tool**: Vite

### 주요 라이브러리
- `quagga`: 바코드 스캔 기능
- `@capacitor/camera`: 카메라 기능
- `@quasar/extras`: Quasar 추가 기능

## 🚀 시작하기

### Prerequisites
- Node.js (v18 이상)
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone [repository-url]
   cd bookshelf-front
   ```

2. **의존성 설치**
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:9000
   ```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 린트 체크
npm run lint

# 코드 포맷팅
npm run format
```

## 📁 프로젝트 구조

```
src/
├── assets/          # 정적 파일 (이미지, 폰트 등)
├── boot/            # 앱 시작 시 실행되는 파일들
├── components/      # 재사용 가능한 컴포넌트
│   ├── dto/        # 데이터 전송 객체
│   └── skeleton/   # 스켈레톤 로딩 컴포넌트
├── css/            # 스타일 파일
├── layouts/        # 레이아웃 컴포넌트
├── pages/          # 페이지 컴포넌트
│   ├── default/    # 기본 페이지 (로그인, 회원가입 등)
│   └── shelf/      # 책장 관련 페이지
├── router/         # 라우팅 설정
├── services/       # API 서비스
├── stores/         # Pinia 스토어
└── App.vue         # 루트 컴포넌트
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary Green**: `#427957` - 메인 컬러
- **Primary Light**: `#5a8c6e` - 호버 효과
- **Primary Dark**: `#345f45` - 강조
- **Soft Dark**: `#36454f` - 제목
- **Soft Grey**: `#696969` - 본문 텍스트
- **Light BG**: `#f8f8f8` - 배경색
- **Light Green**: `#edf5f0` - 강조 섹션

## 🔧 개발 환경 설정

### 환경 변수
프로젝트 루트에 `.env` 파일을 생성하고 필요한 환경 변수를 설정하세요.

```env
VITE_API_BASE_URL=설정
```


## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👥 팀

- **개발자**: dhrgodms <dhrgodms123@gmail.com>

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**Bookshelf** - 당신만의 완벽한 책장을 만들어보세요! 📚✨
