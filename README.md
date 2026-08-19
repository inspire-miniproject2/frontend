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
- `develop` CI가 성공하면 해당 커밋의 Docker 이미지를 GHCR에 게시하고 EC2 개발 서버에 배포합니다.
- 수동 배포는 GitHub Actions의 `Frontend CD`에서 실행할 수 있습니다.
- 배포 컨테이너는 백엔드의 `g-civil-network`에 연결되며 Nginx가 `/api/` 요청을 `gateway-service:8080`으로 전달합니다.
- 배포 health check가 실패하면 직전 프론트엔드 이미지로 자동 복구합니다.

GitHub Actions은 OIDC로 `GitHubActionsFrontendDeploy` IAM Role을 임시로 인수하고, Systems Manager Run Command로 배포합니다. AWS access key와 EC2 SSH private key를 GitHub Secrets에 저장하지 않습니다. IAM Role의 신뢰 정책은 `repo:inspire-miniproject2/frontend:environment:development`로 제한합니다.

EC2에는 SSM Agent, Docker, 백엔드 Compose가 먼저 실행되어 `g-civil-network` 및 `gateway-service`가 존재해야 합니다. 또한 `ubuntu` 사용자로 GHCR `read:packages` 로그인이 1회 완료되어야 합니다. 보안 그룹은 사용자 접속용 TCP 80만 외부에 허용하며 GitHub Actions 배포를 위해 TCP 22를 열 필요가 없습니다.

## 디자인 기준

- KRDS 구조와 컴포넌트 및 디자인 토큰 사용
- 1440px 데스크톱 기준, 1024px 반응형 지원
- 상태는 색상과 텍스트를 함께 사용
- 키보드 포커스와 논리적인 제목 구조 유지
