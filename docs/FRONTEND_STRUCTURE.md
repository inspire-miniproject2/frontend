# MinwonON 프론트엔드 구조 가이드

> 기준 문서: `민원온_Wireframe_수정본.pdf` 12개 화면, `api-spec_MinwonON.md` v0.3 (2026-08-14)
> 대상: KRDS React 기반 반응형 데스크톱 웹앱, 1024px 축소 환경 포함

## 1. 문서 목적

이 문서는 MinwonON 프론트엔드 구현의 화면 구조, 라우팅, 권한, API 연결, 상태 관리, KRDS 적용, 접근성, 테스트 및 구현 순서를 정의한다. 화면 모양은 와이어프레임을 따르고, 데이터 계약과 권한은 API 명세를 우선한다.

### 기준 우선순위

1. 보안·권한·API 필드와 상태 전이: API 명세
2. 화면 정보 구조와 사용자 흐름: 와이어프레임
3. 컴포넌트·토큰·상호작용·접근성: KRDS 최신 가이드
4. 자료 간 충돌: 이 문서의 `14. 구현 전 확인 사항`에서 결정 후 반영

## 2. MVP 범위

### 포함

- 아이디·비밀번호 로그인, 시민 회원가입, 로그아웃
- 시민 민원 작성·확인·접수 완료·목록·상세 조회
- 민원 첨부파일 업로드·표시·권한 기반 다운로드
- 공개 답변 목록·상세 조회
- 공무원 업무함, 상태 변경, 공식 답변 등록
- 인앱 알림 목록·읽음 처리, 이메일 알림 선택
- 관리자 일별 민원 통계
- 역할 기반 접근 제어: `CITIZEN`, `OFFICER`, `ADMIN`

### API v0.3 기준 제외

- 보완 요청 편집 및 보완 파일 제출
- 내부 메모
- 답변 마감기한
- 카카오톡 알림
- 임시 저장 및 자동 저장
- 답변 첨부파일 등록
- 알림 모두 읽음 처리
- 자동 Access Token 재발급
- 공무원·관리자 공개 회원가입

## 3. 권장 기술 구조

| 영역 | 권장 | 용도 |
|---|---|---|
| UI | React + TypeScript | 화면과 타입 안전성 |
| 빌드 | Vite | SPA 개발·빌드 |
| 디자인 시스템 | `krds-react` + KRDS 토큰 | 공공서비스 UI 일관성 |
| 라우팅 | React Router Data Mode | 중첩 레이아웃, 권한 라우트, URL 기반 필터 |
| 서버 상태 | TanStack Query | 조회 캐시, 로딩·오류·재시도, mutation 무효화 |
| 폼 | React Hook Form + Zod | 폼 상태 및 API 규칙 기반 검증 |
| API 타입 | OpenAPI 기반 생성 또는 명시적 DTO | 백엔드 계약과 프론트 타입 동기화 |
| 컴포넌트 문서 | Storybook | KRDS 래퍼와 화면 상태 문서화 |
| 단위·통합 테스트 | Vitest + Testing Library + MSW | UI·API 상호작용 검증 |
| E2E | Playwright | 시민·공무원·관리자 핵심 흐름 검증 |
| 접근성 | axe + 수동 키보드·스크린리더 점검 | 자동·수동 접근성 검증 |

상태 라이브러리를 추가하기 전에 상태를 다음처럼 나눈다.

- 서버 상태: TanStack Query
- URL 상태: 검색어, 필터, 정렬, 페이지
- 로컬 화면 상태: 모달, 드롭다운, 알림 패널
- 인증 상태: 메모리 중심 세션 컨텍스트, 401 발생 시 세션 종료
- 다단계 신청 폼: 라우트 상위 컨텍스트의 비영속 상태

## 4. 전역 앱 셸

### 공통 셸

```text
SkipLink
OfficialGovernmentBanner
SiteHeader
  AgencyIdentifier / MinwonON Logo
  GlobalNavigation
  AuthActions 또는 UserMenu
  NotificationCenterTrigger(로그인 사용자)
Breadcrumb
Main
SiteFooter
GlobalDialogLayer
GlobalToastOrSnackbarLayer
```

### 역할별 메뉴

| 역할 | 기본 메뉴 |
|---|---|
| 비로그인 | 민원신청, 공개 답변, 이용안내, 로그인, 회원가입 |
| CITIZEN | 민원신청, 내 민원, 공개 답변, 이용안내, 알림, 로그아웃 |
| OFFICER | 공개 답변, 민원업무함, 알림, 로그아웃 |
| ADMIN | 공개 답변, 민원업무함, 민원처리현황, 알림, 로그아웃 |

### 반응형 규칙

- 기준 폭: 1440px, 콘텐츠 최대 폭 1200px, 중앙 정렬
- 1024px: 콘텐츠 좌우 여백 축소, 필터 줄바꿈, 2열 상세 화면 비율 조정
- 좁은 웹 폭: 표를 구조화 목록으로 전환하고 전역 메뉴는 텍스트 레이블이 유지되는 메뉴 패널로 제공
- 공무원 상세의 오른쪽 작업 패널은 1024px에서 폭을 줄이고, 그 이하에서는 본문 아래로 이동
- 차트는 잘리지 않게 리플로우하고 동일 데이터를 표로 제공
- 가로 스크롤이 필요한 표에는 스크롤 가능 영역임을 텍스트와 키보드 동작으로 알림

## 5. 라우팅 및 권한

```text
/
├─ /login                                  PublicOnly
├─ /signup                                 PublicOnly
├─ /complaints/new                         CITIZEN
│  ├─ /write                               CITIZEN
│  ├─ /confirm                             CITIZEN
│  └─ /complete/:complaintId               CITIZEN
├─ /my/complaints                          CITIZEN
├─ /my/complaints/:complaintId             CITIZEN
├─ /public-responses                       Public
├─ /public-responses/:responseId           Public
├─ /officer/complaints                     OFFICER | ADMIN
├─ /officer/complaints/:complaintId        OFFICER | ADMIN
├─ /admin/statistics                       ADMIN
├─ /notifications                          Authenticated
├─ /403
├─ /404
└─ /service-error
```

### 라우트 가드

- `PublicOnly`: 로그인 사용자가 접근하면 역할별 시작 화면으로 이동
- `Authenticated`: 유효한 Access Token 필요
- `RoleGuard`: JWT의 `role`을 UI 노출 판단에 사용하되 최종 권한은 서버 응답으로 검증
- 401: 인증 상태와 Query 캐시를 제거하고 로그인으로 이동
- 403: 권한 없음 화면
- 새로고침 시 현재 URL과 검색 조건 유지
- 로그인 후 원래 요청한 안전한 내부 경로로 복귀

## 6. 권장 디렉터리 구조

```text
src/
├─ app/
│  ├─ App.tsx
│  ├─ router.tsx
│  ├─ providers.tsx
│  └─ query-client.ts
├─ layouts/
│  ├─ PublicLayout.tsx
│  ├─ CitizenLayout.tsx
│  ├─ OfficerLayout.tsx
│  └─ AdminLayout.tsx
├─ pages/
│  ├─ auth/
│  ├─ complaint-application/
│  ├─ my-complaints/
│  ├─ public-responses/
│  ├─ officer-complaints/
│  ├─ admin-statistics/
│  └─ errors/
├─ features/
│  ├─ auth/
│  ├─ complaint-create/
│  ├─ complaint-search/
│  ├─ complaint-status/
│  ├─ response-register/
│  ├─ notifications/
│  └─ statistics-filter/
├─ entities/
│  ├─ user/
│  ├─ complaint/
│  ├─ attachment/
│  ├─ response/
│  ├─ notification/
│  └─ statistic/
├─ widgets/
│  ├─ app-header/
│  ├─ app-footer/
│  ├─ notification-center/
│  ├─ complaint-table/
│  ├─ complaint-timeline/
│  └─ statistics-panels/
├─ shared/
│  ├─ api/
│  │  ├─ client.ts
│  │  ├─ contracts.ts
│  │  ├─ errors.ts
│  │  └─ generated/
│  ├─ auth/
│  ├─ config/
│  ├─ hooks/
│  ├─ lib/
│  ├─ ui/
│  │  ├─ krds/
│  │  └─ states/
│  └─ styles/
├─ mocks/
└─ test/
```

### 구성 원칙

- `pages`: 라우트 조립만 담당하며 비즈니스 로직을 최소화한다.
- `features`: 사용자가 실행하는 행위 단위로 구성한다.
- `entities`: API DTO, 도메인 타입, 표시 포맷을 관리한다.
- `shared/ui/krds`: KRDS React 컴포넌트의 프로젝트 공통 래퍼만 둔다.
- 화면별로 KRDS를 다시 스타일링하지 않고 래퍼와 토큰을 재사용한다.
- API 응답 DTO와 화면 표시 모델을 분리한다.

## 7. 화면별 구현 매핑

| 화면 | Route | 핵심 API | 핵심 UI |
|---|---|---|---|
| 로그인 | `/login` | `POST /auth/login` | 로그인 폼, 오류 메시지 |
| 회원가입 | `/signup` | `POST /auth/signup` | 2열 폼, 검증, 공무원 계정 안내 |
| 내 민원 | `/my/complaints` | `GET /complaints/my` | 요약 필터, 검색, 표, 페이지네이션, 알림 패널 |
| 민원 작성 | `/complaints/new/write` | `GET /complaint-categories` | 단계 표시기, 폼, 파일 업로드 |
| 최종 확인 | `/complaints/new/confirm` | 제출 전 메모리 폼 상태 | 읽기 전용 요약, 확인 체크, 제출 모달 |
| 접수 완료 | `/complaints/new/complete/:id` | `POST /complaints` 결과 | 접수번호, 배정 결과, 상태 안내 |
| 민원 상세 | `/my/complaints/:id` | `GET /complaints/{id}`, `GET /complaints/{complaintId}/attachments/{attachmentId}` | 상태 단계, 본문, 첨부 다운로드, 처리 이력, 답변 |
| 공개 답변 목록 | `/public-responses` | `GET /public-responses` | 검색·필터, 제목 중심 목록 |
| 공개 답변 상세 | `/public-responses/:id` | `GET /public-responses/{id}` | 민원 제목·분야·일자, 답변 전문 |
| 공무원 업무함 | `/officer/complaints` | `GET /officer/complaints` | 신규 배정·처리 중·완료 요약, 검색, 표, 페이지네이션 |
| 공무원 처리 | `/officer/complaints/:id` | 상세 조회, 상태 변경, 답변 등록 | 2열 작업 화면, 상태 전이, 답변 본문·공개 여부 폼 |
| 관리자 통계 | `/admin/statistics` | `GET /admin/statistics/daily` | 기간·부서 필터, 접수·완료·상태·평균 처리시간 통계, 대체 표 |
| 알림 센터 | 전역 패널 및 `/notifications` | `GET /notifications`, `PATCH /notifications/{id}/read` | 미읽음 수, 목록, 읽음 처리 |

## 8. API 계층

### 공통 응답

```ts
type ApiSuccess<T> = {
  success: true;
  data: T;
  message: string;
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown | null;
  };
  requestId: string;
};
```

### API 클라이언트 책임

- Base URL `/api/v1`
- `Authorization: Bearer` 자동 첨부
- JSON과 `multipart/form-data` 분기
- ISO 8601 Asia/Seoul 표시 변환
- 공통 응답 unwrap
- 표준 에러를 `AppError`로 변환
- 401 세션 종료와 로그인 이동, 다중 401 처리 중복 방지
- 사용자 오류 화면에 `requestId` 제공
- 로그에 비밀번호, 토큰, 민원 본문, 개인정보를 남기지 않음

### Query key 예시

```ts
const complaintKeys = {
  all: ['complaints'] as const,
  myList: (params: MyComplaintParams) => ['complaints', 'my', params] as const,
  detail: (id: number) => ['complaints', 'detail', id] as const,
  officerList: (params: OfficerComplaintParams) => ['complaints', 'officer', params] as const,
};
```

### Mutation 후 갱신

- 민원 제출: 내 민원 목록 무효화
- 상태 변경: 해당 상세·공무원 목록·통계 무효화
- 답변 등록: 해당 상세·공개 답변 목록·알림 관련 데이터 무효화
- 알림 읽음: 알림 목록과 미읽음 수 동시 갱신
- 첨부 다운로드: Blob 응답과 `Content-Disposition` 파일명을 사용하고 오류 응답은 공통 에러로 변환

## 9. 인증 및 보안

- 시민 공개 회원가입만 허용한다.
- UI에서 역할 선택 기능을 제공하지 않는다.
- 로그인 응답의 Access Token과 Refresh Token을 받되, 현재 API에는 재발급 endpoint가 없으므로 자동 갱신을 구현하지 않는다.
- Access Token은 가능한 메모리에 보관한다. Refresh Token은 로그아웃 요청에만 필요하므로 보관 방식과 수명을 보안 문서에 명시한다.
- 401 또는 `TOKEN_EXPIRED` 발생 시 토큰과 사용자 상태를 제거하고 로그인 화면으로 이동한다.
- 로그아웃 시 서버 폐기 후 클라이언트 인증·Query 캐시를 제거한다.
- 버튼 숨김은 보안 통제가 아니며 모든 권한은 API가 재검증한다.
- 민원 본문과 첨부파일 URL은 소유자·담당부서·관리자 권한에 따라 서버가 제한한다.
- 민원 첨부파일 다운로드는 `GET /complaints/{complaintId}/attachments/{attachmentId}`만 사용하며 직접 저장소 URL을 만들지 않는다.
- 공개 답변 API는 민원 본문을 반환하거나 화면 상태에 저장하지 않는다.

## 10. 민원 상태 모델

```ts
type ComplaintStatus =
  | 'RECEIVED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED';
```

| API 상태 | 사용자 레이블 | 다음 허용 상태 |
|---|---|---|
| RECEIVED | 접수됨 | ASSIGNED |
| ASSIGNED | 배정됨 | IN_PROGRESS |
| IN_PROGRESS | 처리 중 | COMPLETED(답변 등록 후) |
| COMPLETED | 완료 | 없음 |

- 상태 순서는 서버의 source of truth를 따른다.
- 완료 버튼은 답변 등록 성공 전에는 활성화하지 않는다.
- `INVALID_STATUS_TRANSITION`은 현재 상태를 재조회한 뒤 사용자에게 충돌을 설명한다.
- 상태를 색상만으로 표현하지 않고 텍스트와 현재 단계 설명을 함께 제공한다.

## 11. 폼 및 파일 처리

### 회원가입

- `loginId`: 영문·숫자 6~20자
- `password`: 10자 이상, 영문·숫자·특수문자 포함
- `name`: 2~50자
- `email`: 이메일 형식
- `phone`: `010-0000-0000`
- `emailNotifyAgreed`: 선택, 기본 false

### 민원 신청

- `categoryId`: 활성 카테고리
- `title`: 5~100자
- `content`: 20~3000자
- `attachmentFiles[]`: 서버 허용 확장자·개수·용량 정책과 동기화
- `notifyChannels[]`: MVP에서는 `EMAIL`만 선택, `IN_APP`은 서버가 항상 생성

### 다단계 신청 흐름

1. 작성 화면에서 입력값과 파일을 React 메모리 상태에만 보관
2. 확인 화면에서 민원 본문을 편집 불가 상태로 표시
3. 사용자 확인 후 한 번만 `POST /complaints`
4. 처리 중 버튼 비활성화 및 중복 제출 방지 키 검토
5. 응답의 `currentStatus`가 `ASSIGNED`인지 `RECEIVED`인지에 따라 완료 안내 분기
6. 새로고침·직접 URL 접근·탭 종료 시 작성값이 유지되지 않음을 안내하고 작성 화면으로 안전하게 복귀

임시 저장과 자동 저장은 구현하지 않는다. `localStorage`, `sessionStorage`, IndexedDB에도 민원 본문과 첨부파일을 저장하지 않는다. 확인 화면은 작성 화면에서 정상 이동한 경우에만 접근할 수 있으며 메모리 상태가 없으면 작성 화면으로 되돌린다.

### 첨부파일 다운로드

- 인증된 사용자가 화면의 파일 링크를 실행할 때 명세의 다운로드 endpoint를 호출한다.
- 응답 `Content-Disposition`의 파일명을 안전하게 파싱하고 브라우저 Blob 다운로드를 실행한다.
- 403은 “다운로드 권한이 없습니다”, 404는 “파일을 찾을 수 없습니다”로 안내한다.
- 공개 답변 상세의 `attachments[]`는 API가 반환하는 읽기 전용 공개 첨부만 표시한다. 공무원 답변 등록 화면에는 첨부 등록 버튼을 제공하지 않는다.

## 12. 공통 화면 상태

모든 데이터 화면은 다음 상태를 명시적으로 구현한다.

| 상태 | 구현 원칙 |
|---|---|
| Initial | 입력 전 기본 상태 |
| Loading | 레이아웃 이동이 적은 스켈레톤, 진행 상태 텍스트 |
| Empty | 원인 설명과 다음 행동 제공 |
| No Result | 검색 조건 초기화 제공 |
| Validation Error | 필드 인접 오류 + 오류 요약 영역 |
| API Error | 사용자 메시지, 재시도, requestId |
| Forbidden | 권한 없음과 안전한 이동 경로 |
| Disabled | 비활성 이유를 인접 텍스트로 설명 |
| Submitting | 중복 제출 차단, 진행 중 텍스트 |
| Success | 결과 요약과 다음 행동 제공 |
| Partial Success | 접수 성공·알림 실패처럼 성공과 실패를 분리 설명 |
| Conflict | 최신 상태 재조회 후 작업 충돌 안내 |

## 13. KRDS 및 접근성 적용

### 필수 적용

- 공식 전자정부 배너, 운영기관 식별자, 헤더, 주 메뉴, 브레드크럼, 페이지 제목, 푸터
- Pretendard GOV 및 KRDS 토큰
- Skip link와 `<main>` 랜드마크
- 논리적인 `h1`-`h3` 계층
- 입력 레이블, 필수·선택 표시, 도움말, 인라인 오류 연결
- 키보드 포커스 가시성 및 DOM 순서와 시각 순서 일치
- 모달 focus trap, 닫기 후 트리거로 포커스 복귀
- 상태 배지는 비대화형 텍스트로 사용
- 표 제목·열 제목·정렬 상태·페이지네이션 접근성
- 차트의 직접 수치, 범례, 텍스트 요약, 데이터 표 대체 보기
- 최소 1024px에서 200% 확대 시 핵심 과업 수행 가능 여부 점검

### 프로젝트 시각 원칙

- 회색조와 절제된 KRDS 파란색 사용
- 오류·경고·성공은 KRDS 의미 토큰과 텍스트 병행
- 그라데이션, 글래스모피즘, 과도한 라운드·그림자·장식 배제
- 아이콘 단독 버튼보다 텍스트 레이블 우선
- 실제 한국어 예시 데이터 사용

## 14. API 정합성 결정 사항

`api-spec_MinwonON.md`를 프론트엔드 데이터 계약의 source of truth로 사용한다. 와이어프레임과 충돌하는 요소는 아래 확정사항에 따라 구현하고, API에 존재하더라도 MVP 화면에서 제외하기로 확정한 필드는 렌더링하지 않는다.

### A. 와이어프레임 충돌 및 확정사항

| 항목 | 최신 API 계약 | 확정사항 | 문서 반영 결과 | 상태 |
|---|---|---|---|---|
| 보완 대기/보완 필요 | 보완 요청 관련 API 없음 | 화면에서 제거 | 시민 목록·상세와 공무원 업무함·처리 화면에서 제거 | 적용 |
| 기한 임박·초과·처리 예정일 | 답변 마감기한 미정의. 통계 응답에는 기한 집계 필드가 남아 있음 | 모든 화면에서 제거 | 시민·공무원 목록의 기한 열과 관리자 KPI·위험 목록 제거. 통계 응답의 관련 필드는 무시 | 적용 |
| 알림 채널 | `IN_APP`, `EMAIL` | 카카오톡 제거 | 인앱은 기본, 이메일만 사용자 선택 | 적용 |
| 임시 저장 | 저장 API 없음 | 임시 저장 없음 | 버튼·저장 시각·자동 저장 문구 제거, 메모리 상태만 사용 | 적용 |
| 답변 첨부 등록 | 답변 등록 요청은 `responseContent`, `isPublic`만 지원 | 첨부 등록 버튼 제거 | 공무원 답변 폼에서 파일 업로드 제거 | 적용 |
| 공개 답변 첨부 조회 | 상세 응답에 `attachments[]` 존재 | API 응답만 읽기 전용 표시 | 공개 답변 상세에서 서버가 반환한 공개 첨부만 표시 | 적용 |
| 알림 모두 읽음 | 단건 읽음 endpoint만 존재 | 모두 읽음 제거 | 알림별 읽음 처리만 제공 | 적용 |
| Refresh Token | 로그인 응답·로그아웃 요청에 존재, 재발급 endpoint 없음 | 자동 재발급 미구현 | 401 시 세션 종료 후 로그인 이동 | 적용 |
| 민원 첨부 다운로드 | 인증 다운로드 endpoint 추가 | API 기준으로 다운로드 제공 | Blob 다운로드와 403·404 처리 추가 | 적용 |
| 민원 카테고리 | 접수 요청 필드는 `categoryId` | `categoryId` 사용 | 폼 값과 multipart 요청을 `categoryId`로 통일 | 적용 |

### B. 프론트엔드에서 사용하지 않는 API 필드

다음 필드는 최신 통계 응답에 존재하지만 확정사항에 따라 MVP UI·필터·정렬·클라이언트 계산에 사용하지 않는다.

- `deadlineApproachingCount`
- `overdueCount`

생성된 API 타입에 필드가 포함되는 것은 허용하되 도메인 표시 모델로 매핑하지 않는다.

### C. 남은 API 계약 확인 항목

- 목록 응답의 `totalPages`, `totalElements`, `number`, `size` 등 페이지 메타데이터
- 내 민원 요약의 `summary.completed` 포함 여부
- 공개 답변 목록의 페이지·정렬 파라미터
- 공개 답변 첨부파일의 실제 다운로드 URL 또는 endpoint
- 알림 항목의 생성 시각, 타입, 이동 대상, 읽음 상태 필드
- Refresh Token 보관 기간과 로그아웃 실패 시 클라이언트 처리
- 서버 파일 제한값, 허용 MIME type, 안전한 원본 파일명 정책
- 통계 CSV/XLSX 다운로드 endpoint

확정되지 않은 기능은 정상 작동하는 UI처럼 만들지 않는다. 페이지네이션처럼 화면 구현에 필수인 계약은 mock 단계에서 별도 adapter로 격리하고 실제 API 필드가 확정되면 교체한다.

## 15. 테스트 전략

### 단위·컴포넌트

- 상태 코드→한국어 레이블 매핑
- 날짜·시간·민원번호 포맷
- 권한별 메뉴와 RouteGuard
- 회원가입·민원·답변 검증 스키마
- KRDS 래퍼의 키보드·접근성 상태

### 통합

- 로그인 성공·실패·토큰 만료
- 민원 작성→확인→제출 성공
- 자동 배정 성공(`ASSIGNED`)과 대기(`RECEIVED`) 분기
- 내 민원 필터와 URL 동기화
- 공무원 답변 등록 후 완료 전이
- 알림 읽음 처리
- 관리자 통계 필터

### E2E 핵심 시나리오

1. 시민 가입→로그인→민원 제출→상세 확인
2. 공무원 로그인→배정 민원 조회→처리 중 전환→답변 등록→완료
3. 비로그인 사용자 공개 답변 조회
4. 시민이 공무원·관리자 경로 접근 시 403
5. 키보드만으로 로그인·민원 제출·공무원 답변 완료
6. 1024px에서 모든 핵심 흐름과 표 대체 레이아웃 확인

## 16. 구현 순서

1. React·TypeScript·Vite, 품질 도구, 환경 설정
2. KRDS React 설치 검증과 전역 토큰·폰트·앱 셸
3. API 클라이언트, 공통 응답·에러, 인증·RouteGuard
4. 로그인·회원가입
5. 민원 작성→확인→접수 완료
6. 내 민원 목록·상세
7. 공개 답변 목록·상세
8. 공무원 업무함·처리 화면
9. 알림 센터
10. 관리자 통계
11. 1024px 반응형·접근성·오류 상태 보강
12. API 계약 테스트, E2E, 성능·보안 검토

## 17. 추천 Docs 목록

### 프로젝트 내부에서 먼저 작성할 문서

| 문서                              | 목적                                                    |
|-----------------------------------|---------------------------------------------------------|
| `README.md`                       | 실행, 환경 변수, 명령어, 배포 개요                      |
| `docs/frontend-architecture.md`   | 이 문서의 확정본, 의존 방향과 상태 소유권               |
| `docs/routes-and-roles.md`        | URL, 권한, 메뉴, 리다이렉트 규칙                        |
| `docs/tasks.md`                   | 작업문서                                                |
| `docs/execution.md`               | 수행문서                                                |
| `docs/api-contract.md`            | 프론트가 사용하는 endpoint·DTO·오류·미확정 항목         |
| `docs/design-system.md`           | KRDS 버전, 토큰, 래퍼, 허용된 커스텀 스타일             |
| `docs/accessibility.md`           | KWCAG 체크리스트와 수동 점검 절차                       |
| `docs/auth-security.md`           | 토큰 저장·갱신·로그아웃·권한·민감 로그 정책             |
| `docs/testing-strategy.md`        | 테스트 피라미드, MSW, E2E, 접근성 검사                  |
| `docs/error-handling.md`          | 오류 코드→화면 메시지·재시도·requestId 정책(날짜별기록) |
| `docs/adr/`                       | 기술 선택과 API 충돌 해결 기록                          |

### 외부 공식 문서

| 우선순위 | 문서 | 구현 시 확인할 내용 |
|---|---|---|
| 필수 | [KRDS 개발자 가이드](https://www.krds.go.kr/html/site/outline/outline_03.html) | React 설치, Pretendard GOV, 토큰, 스타일 사용자화 |
| 필수 | [KRDS 컴포넌트](https://www.krds.go.kr/html/site/component/component_summary.html) | 헤더·푸터·폼·표·배지·모달·알림의 사용성과 접근성 |
| 필수 | [KRDS 서비스 패턴](https://www.krds.go.kr/html/site/service/service_summary.html) | 로그인, 신청, 검색 등 사용자 여정 |
| 필수 | [KRDS React 저장소](https://github.com/KRDS-community/krds-react) | 제공 컴포넌트, 버전, Storybook, 알려진 이슈 |
| 필수 | [React 공식 문서](https://react.dev/) / [React TypeScript](https://react.dev/learn/typescript) | 컴포넌트·상태·타입 패턴 |
| 필수 | [Vite 공식 가이드](https://vite.dev/guide/) | 환경 변수, 빌드, 정적 자산, 배포 기준 |
| 필수 | [React Router 모드 선택](https://reactrouter.com/start/modes) | Data Mode, 중첩 라우트, pending·error 처리 |
| 필수 | [TanStack Query React](https://tanstack.com/query/latest/docs/framework/react) | query key, 캐시, 재시도, mutation 무효화 |
| 필수 | [React Hook Form](https://react-hook-form.com/get-started) / [Zod](https://zod.dev/) | 폼 상태와 API 검증 규칙 |
| 권장 | [Storybook](https://storybook.js.org/docs) | KRDS 래퍼, 상태별 스토리, interaction 테스트 |
| 권장 | [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) / [Vitest](https://vitest.dev/guide/) | 사용자 중심 컴포넌트·통합 테스트 |
| 권장 | [MSW](https://mswjs.io/docs/) | API 성공·오류·지연·충돌 mock |
| 권장 | [Playwright](https://playwright.dev/docs/intro) | 역할별 E2E와 1024px 검증 |
| 필수 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) / [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) | 접근성 기준과 복합 위젯 키보드 패턴 |
| 권장 | [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) | DTO·클라이언트 생성 및 계약 검증 |

`krds-react`는 공식 KRDS 개발자 페이지에서 설치 대상으로 안내되지만, 실제 저장소의 릴리스·지원 컴포넌트·이슈를 확인하고 프로젝트에서 사용할 버전을 고정한다. 필요한 컴포넌트가 빠져 있으면 KRDS HTML Kit의 마크업과 토큰을 참고해 프로젝트 래퍼로 보완하되, KRDS React 내부를 직접 수정하지 않는다.

## 18. 완료 기준

- 12개 와이어프레임 화면이 실제 라우트와 연결된다.
- API에 없고 14번에서 제거로 확정한 기능은 화면·필터·정렬·클라이언트 계산에 남아 있지 않다.
- 역할별 메뉴·라우트·API 권한이 일치한다.
- 각 화면에 loading·empty·error·disabled·success 상태가 있다.
- 민원 상태와 알림 채널이 API enum과 일치한다.
- 1024px에서 핵심 업무를 가로 잘림 없이 수행할 수 있다.
- 키보드와 스크린리더로 주요 과업을 완료할 수 있다.
- 차트와 상태 정보는 색상 없이도 이해할 수 있다.
- 핵심 흐름 E2E와 자동 접근성 테스트가 통과한다.
- `14. API 정합성 결정 사항`의 적용 항목이 구현·테스트에 반영되고 남은 계약 확인 항목이 해소되어 있다.
