# MinwonON Frontend

민원온 공공 민원 통합 플랫폼의 React + TypeScript 프론트엔드입니다.

## 기술 스택

- React
- TypeScript
- Vite
- KRDS React (`krds-react`)

## 실행

```bash
pnpm install
pnpm dev
```

## 검증

```bash
pnpm typecheck
pnpm build
```

## CI/CD

- Pull Request에서는 커밋 제목 규칙, 타입 검사, production build를 검증하고 `develop` push에서는 타입 검사와 build를 수행합니다.
- `develop` push 시 CD가 타입 검사와 production build를 다시 검증한 뒤 해당 커밋의 Docker 이미지를 GHCR에 게시하고 EC2 개발 서버에 배포합니다.
- 수동 배포는 GitHub Actions의 `Frontend CD`에서 실행할 수 있습니다.
- 배포 컨테이너는 백엔드의 `g-civil-network`에 연결되며 Nginx가 `/api/` 요청을 `gateway-service:8080`으로 전달합니다.
- 배포 health check가 실패하면 직전 프론트엔드 이미지로 자동 복구합니다.

GitHub 저장소의 `development` Environment에 다음 Secrets를 등록해야 합니다.

| Secret | 용도 |
| --- | --- |
| `EC2_HOST` | 개발 EC2 공개 IP 또는 도메인 |
| `EC2_USER` | SSH 사용자(예: `ubuntu`) |
| `EC2_SSH_KEY` | EC2 SSH private key 전체 내용 |
| `EC2_HOST_FINGERPRINT` | EC2 SSH host key의 SHA256 fingerprint |
| `GHCR_USER` | EC2에서 GHCR 로그인에 사용할 GitHub 사용자 |
| `GHCR_READ_TOKEN` | `read:packages` 권한만 가진 GitHub token |

EC2에는 Docker와 백엔드 Compose가 먼저 실행되어 `g-civil-network` 및 `gateway-service`가 존재해야 합니다. 보안 그룹은 사용자 접속용 TCP 80과 GitHub Actions SSH 배포용 TCP 22를 허용해야 합니다.

## 디자인 기준

- KRDS 구조와 컴포넌트 및 디자인 토큰 사용
- 1440px 데스크톱 기준, 1024px 반응형 지원
- 상태는 색상과 텍스트를 함께 사용
- 키보드 포커스와 논리적인 제목 구조 유지
