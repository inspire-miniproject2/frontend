# MinwonON Frontend

민원온(MinwonON)은 민원 접수부터 담당 부서 배정, 처리 상태 변경, 공식 답변, 알림과 관리자 통계까지 한곳에서 제공하는 공공 민원 통합 플랫폼입니다. 이 저장소는 MinwonON의 반응형 웹 프론트엔드이며 API Gateway를 통해 백엔드 서비스와 통신합니다.

## 주요 기능

### 공통·비회원

- 아이디·비밀번호 기반 로그인 및 회원가입
- 민원 제목과 공개 답변 내용을 조회하는 공개 답변 목록·상세
- KRDS 기반 전자정부 배너, 헤더, 메뉴, 브레드크럼, 페이지 제목, 푸터

### 민원인 (`CITIZEN`)

- 민원 신청서 작성 → 내용 확인 → 접수 완료의 3단계 신청 흐름
- 민원 분야 선택, 첨부파일 업로드, 알림 채널 설정
- 본인 민원 목록 검색 및 처리 상태별 필터
- 민원 상세, 처리 이력, 공식 답변과 첨부파일 조회
- 알림 목록, 헤더 미읽음 뱃지, 플로팅 패널, 단건 읽음 처리

### 공무원 (`OFFICER`)

- 담당 민원 업무함 조회 및 상태별·키워드 검색
- 허용된 상태 전이 처리
- 공식 답변 등록 및 공개 여부 설정
- 알림 목록과 읽음 처리

### 관리자 (`ADMIN`)

- 공무원 민원 업무 기능 접근
- 기간·부서 조건에 따른 일별 민원 처리 통계 조회
- 접수·완료 건수, 상태별 현황, 처리 완료율, 평균 처리시간 확인
- 알림 목록과 읽음 처리

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| UI | React 19, KRDS React |
| 언어 | TypeScript |
| 라우팅 | React Router 7 |
| 빌드 | Vite 8 |
| API Mock | MSW 2 |
| 패키지 관리 | pnpm 11 |

요구 런타임은 Node.js `24.15.0`, pnpm `11.19.0`입니다.

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

`.env.example`을 복사해 `.env.local`을 만들고 실행 환경에 맞게 값을 변경합니다.

```dotenv
# 실제 API 사용
VITE_ENABLE_MOCKS=false

# Vite 개발 서버의 프록시를 통해 Gateway 호출
VITE_API_BASE_URL=/api/v1
```

브라우저에서 `http://localhost:5173/api/v1/...`로 보이는 요청은 개발 서버가 `/api` 요청을 `http://localhost:8080`의 API Gateway로 프록시합니다.

### 3. 개발 서버 실행

```bash
pnpm dev
```

- 프론트엔드: `http://localhost:5173`
- 기본 API Gateway: `http://localhost:8080`

실제 API를 사용할 때는 필요한 백엔드 서비스와 Gateway를 먼저 실행해야 합니다.

## Mock API 사용

백엔드 개발일정을 기다리지 않고 API 연동 로직 구현을 테스트하기 위해 MSW를 사용했습니다.
백엔드 없이 일부 화면을 확인하려면 `.env.local`에서 Mock을 활성화합니다.

```dotenv
VITE_ENABLE_MOCKS=true
VITE_API_BASE_URL=/api/v1
```

Mock은 브라우저의 MSW Service Worker를 사용합니다. `src/mocks`에는 인증, 민원 신청, 내 민원, 공개 답변, 공무원 민원 관련 데이터와 핸들러가 있습니다. 실제 API 통합 검증 시에는 `VITE_ENABLE_MOCKS=false`로 실행합니다.

## 주요 라우트와 접근 권한

| 화면 | 경로 | 접근 권한 |
| --- | --- | --- |
| 공개 답변 목록 | `/public-responses` | Public |
| 공개 답변 상세 | `/public-responses/:responseId` | Public |
| 로그인 | `/login` | 비로그인 사용자 |
| 회원가입 | `/signup` | 비로그인 사용자 |
| 민원 작성 | `/complaints/new/write` | `CITIZEN` |
| 제출 전 확인 | `/complaints/new/confirm` | `CITIZEN` |
| 접수 완료 | `/complaints/new/complete/:complaintId` | `CITIZEN` |
| 내 민원 목록 | `/my/complaints` | `CITIZEN` |
| 내 민원 상세 | `/my/complaints/:complaintId` | `CITIZEN` |
| 공무원 업무함 | `/officer/complaints` | `OFFICER`, `ADMIN` |
| 공무원 민원 처리 | `/officer/complaints/:complaintId` | `OFFICER`, `ADMIN` |
| 관리자 통계 | `/admin/statistics` | `ADMIN` |
| 알림 목록 | `/notifications` | 로그인 사용자 |

`RequireRole`이 인증 여부와 역할을 검사하며 권한이 없는 사용자는 역할에 맞는 화면으로 이동합니다.

## API 연동 방식

- 공통 기준 경로: `/api/v1`
- 공통 클라이언트: `src/shared/api/client.ts`
- 기능별 요청·응답 타입 및 API 함수: `src/features/*`
- 성공 응답의 `data` 반환, 실패 응답은 `ApiError`로 통합 처리
- 인증된 API 요청에 `Authorization: Bearer <accessToken>` 자동 추가
- `401 Unauthorized` 응답 시 현재 세션 제거
- 파일 업로드는 `FormData`, 첨부파일 조회는 Blob 다운로드 사용

로그인 결과(access token, refresh token, 사용자 정보)는 현재 탭의 `sessionStorage`에 저장됩니다. 탭을 닫거나 로그아웃하면 세션이 제거됩니다. 로그인 화면의 ‘아이디 저장’은 인증 정보가 아닌 아이디만 `localStorage`에 저장합니다.

## 디렉터리 구조

```text
src/
├─ features/                 # 도메인 타입, API 함수, 상태 컨텍스트
│  ├─ auth/
│  ├─ complaint-application/
│  ├─ my-complaints/
│  ├─ notifications/
│  ├─ officer-complaints/
│  ├─ public-responses/
│  └─ statistics/
├─ layouts/                  # 공통 앱 셸
├─ mocks/                    # MSW 데이터, 핸들러, 브라우저 설정
├─ pages/                    # 라우트 단위 화면
│  ├─ admin-statistics/
│  ├─ auth/
│  ├─ complaint-application/
│  ├─ errors/
│  ├─ my-complaints/
│  ├─ officer-complaints/
│  └─ public-responses/
├─ shared/
│  ├─ api/                   # 공통 API 클라이언트와 응답 계약
│  └─ ui/                    # KRDS 래퍼와 공통 아이콘
├─ styles/                   # 전역·앱 스타일
├─ App.tsx                   # 라우트 및 역할별 접근 제어
└─ main.tsx                  # 앱 부트스트랩과 Mock 초기화
```

## 검증 및 빌드

```bash
# TypeScript 타입 검사
pnpm typecheck

# 타입 검사 후 프로덕션 번들 생성
pnpm build

# 생성된 번들 로컬 확인
pnpm preview
```

## CI/CD

- Pull Request에서는 커밋 제목 규칙, 타입 검사, production build를 검증하고 `develop` push에서는 타입 검사와 build를 수행합니다.
- `develop` CI가 성공하면 해당 커밋의 Docker 이미지를 GHCR에 게시하고 EC2 개발 서버에 배포합니다.
- 수동 배포는 GitHub Actions의 `Frontend CD`에서 실행할 수 있습니다.
- 배포 컨테이너는 백엔드의 `g-civil-network`에 연결되며 Nginx가 `/api/` 요청을 `gateway-service:8080`으로 전달합니다.
- 배포 health check가 실패하면 직전 프론트엔드 이미지로 자동 복구합니다.

GitHub Actions은 OIDC로 `GitHubActionsFrontendDeploy` IAM Role을 임시로 인수하고, Systems Manager Run Command로 배포합니다. AWS access key와 EC2 SSH private key를 GitHub Secrets에 저장하지 않습니다. IAM Role의 신뢰 정책은 `repo:inspire-miniproject2/frontend:environment:development`로 제한합니다.

EC2에는 SSM Agent, Docker, 백엔드 Compose가 먼저 실행되어 `g-civil-network` 및 `gateway-service`가 존재해야 합니다. 또한 `ubuntu` 사용자로 GHCR `read:packages` 로그인이 1회 완료되어야 합니다. 보안 그룹은 사용자 접속용 TCP 80만 외부에 허용하며 GitHub Actions 배포를 위해 TCP 22를 열 필요가 없습니다.

## 디자인 기준

- KRDS React 컴포넌트와 디자인 토큰 우선 사용
- 1440px 데스크톱과 1024px 축소 화면을 고려한 반응형 웹 구성
- 회색조와 절제된 KRDS 파란색 사용
- 상태를 색상만으로 구분하지 않고 텍스트·아이콘을 함께 제공
- 명확한 폼 레이블, 키보드 포커스, 충분한 색상 대비 적용
- 논리적인 제목 구조와 로딩·오류·빈 결과·비활성·완료 상태 제공
