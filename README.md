# 🏠 임대차계약서 자동 생성기 (Lease Contract Generator)

**한국 표준 임대차계약서를 1분 안에 자동 생성** — 직거래할 때 필요한 계약서를 빠르게 만들어줍니다.

![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)
![Python](https://img.shields.io/badge/python-3.9+-blue)
![Node](https://img.shields.io/badge/node-18+-blue)

---

## 🎯 기능

- ✅ **대법원 표준 양식** 기반 임대차계약서
- ✅ **전세/월세** 선택 지원
- ✅ **DOCX 형식** 다운로드 (즉시 사용 가능)
- ✅ **모바일 반응형** 디자인
- ✅ **다크모드** 지원
- ✅ **직거래 맞춤** (중개사 제외)

---

## 🚀 빠른 시작

### 1️⃣ 시스템 요구사항

- Python 3.9+
- Node.js 18+
- npm 또는 yarn

### 2️⃣ 백엔드 실행

```bash
cd backend
pip install -r requirements.txt
python main.py
```

**확인**: http://localhost:8000/docs (Swagger UI)

### 3️⃣ 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

**접속**: http://localhost:5173

---

## 📋 프로젝트 구조

```
lease-contract-generator/
├── backend/
│   ├── main.py                # FastAPI 앱
│   ├── requirements.txt        # Python 의존성
│   ├── Procfile               # Railway 배포
│   └── .env.example           # 환경 변수 예제
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # React 메인 컴포넌트
│   │   ├── App.css            # 스타일
│   │   └── main.tsx           # 진입점
│   ├── package.json           # Node 의존성
│   ├── vite.config.ts         # Vite 설정
│   └── .env.local             # 환경 변수
├── .gitignore
└── README.md
```

---

## 🛠️ 기술 스택

| 레이어 | 기술 |
|-------|------|
| **프론트엔드** | React 18 + TypeScript + Vite |
| **백엔드** | FastAPI + Uvicorn |
| **문서 생성** | python-docx |
| **배포** | Vercel (FE) + Railway (BE) |

---

## 📚 API 명세

### POST `/api/generate-contract`

계약서 생성

**요청**:
```json
{
  "landlord": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "address": "서울시 강남구 테헤란로 123"
  },
  "tenant": {
    "name": "김영희",
    "phone": "010-9876-5432",
    "occupation": "회사원"
  },
  "contract_type": "jeonse",
  "deposit": 30000000,
  "monthly_rent": 0,
  "start_date": "2026-08-01",
  "end_date": "2028-07-31",
  "special_clauses": "수도료, 가스료는 임차인 부담",
  "format": "docx"
}
```

**응답**:
```json
{
  "status": "success",
  "download_url": "/api/download/lease_contract_abc12345.docx",
  "filename": "임대차계약서_2026-08-01.docx",
  "message": "계약서가 성공적으로 생성되었습니다."
}
```

---

## 🚢 배포

### Railway (백엔드)

1. [railway.app](https://railway.app) 계정 생성
2. GitHub 레포 연결
3. 환경 변수 설정 (선택사항)
4. 자동 배포 시작

### Vercel (프론트엔드)

1. [vercel.com](https://vercel.com) 계정 생성
2. GitHub 레포 연결
3. 환경 변수 설정:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
4. 자동 배포 시작

---

## 🎨 스크린샷

### 입력 폼
```
📋 임대인 정보
  └─ 이름, 전화, 주소

👤 임차인 정보
  └─ 이름, 전화, 직업

💰 계약 조건
  └─ 계약 유형, 보증금, 월세, 기간

📝 특약사항 (선택)
  └─ 추가 조건

📥 포맷 선택 (DOCX 지원)
```

### 완성 화면
```
✅ 계약서가 생성되었습니다!
  ├─ 📥 계약서 다운로드 (DOCX)
  └─ 🔄 새 계약서 생성
```

---

## 🔧 개발

### 로컬 개발 서버

**Terminal 1** (백엔드):
```bash
cd backend
python main.py
```

**Terminal 2** (프론트엔드):
```bash
cd frontend
npm run dev
```

### 프로덕션 빌드

```bash
# Frontend
cd frontend
npm run build

# Backend (Railway는 자동 배포)
```

---

## 📊 로드맵

- [x] Phase 1: DOCX MVP ✅
- [ ] Phase 2: HWP + PDF 지원
- [ ] Phase 3: AI 특약 검토 (Claude API)
- [ ] Phase 4: 계약서 이력 관리
- [ ] Phase 5: 디지털 서명
- [ ] Phase 6: 결제 통합 (Toss/포트원)

---

## 🔐 보안

- ✅ CORS 미들웨어
- ✅ 파일명 검증 (경로 traversal 방지)
- ✅ 환경 변수 분리
- ✅ 에러 핸들링

---

## 📝 라이선스

MIT License - 자유롭게 사용하세요.

---

## 🤝 기여

버그 리포트, 기능 제안은 GitHub Issues에서 환영합니다.

---

## 📞 지원

문제 발생 시:
1. [Issues](https://github.com/garyrhee/lease-contract-generator/issues) 확인
2. FastAPI 로그 확인 (`--reload` 옵션)
3. 브라우저 DevTools 콘솔 확인

---

## ⚠️ 중요 공지

**이 서비스는 참고용입니다.**  
반드시 법적 검토 후 사용하세요.

---

**Made with ⚡ by Rheeman**

### 🚀 지금 시작하세요!
```bash
git clone https://github.com/garyrhee/lease-contract-generator.git
cd lease-contract-generator
```
