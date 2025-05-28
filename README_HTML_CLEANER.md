# HTML 파일 정리 도구 (HTML Cleaner)

🧹 HTML 파일에서 외부 요청을 일으키거나 로그인 페이지로 리다이렉트를 발생시키는 코드들을 제거하는 도구입니다.

## 📋 목차

- [개요](#개요)
- [주요 기능](#주요-기능)
- [설치 및 실행](#설치-및-실행)
- [사용법](#사용법)
- [제거되는 요소들](#제거되는-요소들)
- [예시](#예시)
- [주의사항](#주의사항)
- [라이선스](#라이선스)

## 📖 개요

단일 HTML 파일을 다운로드했을 때, 해당 파일 내부에 외부 사이트를 호출하거나 요청하는 코드가 있어서 로그인 페이지로 이동하는 문제를 해결하기 위해 만들어진 도구입니다.

이 도구는 HTML 파일에서 다음과 같은 외부 요청을 일으킬 수 있는 코드들을 자동으로 제거합니다:

- JavaScript 코드 (script 태그)
- 외부 리소스 링크
- 이벤트 핸들러
- iframe 임베드
- 외부 CSS 링크
- 기타 외부 요청 관련 코드들

## ⭐ 주요 기능

### 🔍 제거 대상

1. **Script 태그**: 모든 JavaScript 코드 제거
2. **Noscript 태그**: JavaScript 비활성화 시 대체 컨텐츠 제거
3. **iframe 태그**: 외부 사이트 임베드 제거
4. **외부 CSS 링크**: `https://` 또는 `http://`로 시작하는 CSS 링크 제거
5. **외부 이미지**: 외부 URL의 이미지 src 속성 제거
6. **외부 링크**: 외부 사이트로의 하이퍼링크 제거
7. **Form action**: 외부 서버로의 폼 전송 속성 제거
8. **이벤트 핸들러**: onclick, onload 등 모든 이벤트 핸들러 제거
9. **Meta 리다이렉트**: http-equiv="refresh" 메타 태그 제거
10. **Data 속성**: 외부 요청 관련 data- 속성들 제거
11. **배경 이미지**: CSS의 background-image URL 제거

### 📊 기능

- **단일 파일 처리**: 특정 HTML 파일 하나만 정리
- **배치 처리**: 디렉토리 내의 모든 HTML 파일을 한 번에 정리
- **크기 비교**: 정리 전후의 파일 크기 비교 및 감소량 표시
- **안전한 처리**: 원본 파일은 보존하고 새로운 파일로 저장

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js (v12 이상)

### 설치
```bash
# 프로젝트 클론 또는 파일 다운로드
git clone [repository-url]
cd [project-directory]

# 또는 html-cleaner.js 파일만 다운로드하여 사용
```

## 📚 사용법

### 1. 도움말 보기
```bash
node html-cleaner.js
```

### 2. 단일 파일 정리
```bash
# 기본 사용 (원본파일명_cleaned.html로 저장)
node html-cleaner.js input.html

# 출력 파일명 지정
node html-cleaner.js input.html output.html
```

### 3. 디렉토리 내 모든 HTML 파일 정리
```bash
# 현재 디렉토리의 모든 HTML 파일 정리
node html-cleaner.js --all

# 특정 디렉토리의 모든 HTML 파일 정리
node html-cleaner.js --all ./downloads
```

## 🗑️ 제거되는 요소들

### JavaScript 관련
```html
<!-- 제거됨 -->
<script src="external.js"></script>
<script>
  window.location.href = "https://example.com/login";
</script>
<noscript>JavaScript가 비활성화되었습니다.</noscript>
```

### 외부 리소스
```html
<!-- 제거됨 -->
<link rel="stylesheet" href="https://cdn.example.com/style.css">
<iframe src="https://example.com/embed"></iframe>

<!-- 변경됨 -->
<img src="https://example.com/image.jpg" alt="이미지"> 
<!-- → <img src="" alt="이미지"> -->

<a href="https://example.com">링크</a>
<!-- → <a href="#">링크</a> -->
```

### 이벤트 핸들러
```html
<!-- 제거됨 -->
<button onclick="redirectToLogin()">버튼</button>
<!-- → <button>버튼</button> -->

<body onload="checkAuth()">
<!-- → <body> -->
```

### 기타
```html
<!-- 제거됨 -->
<form action="https://example.com/submit" method="post">
<!-- → <form method="post"> -->

<meta http-equiv="refresh" content="0;url=https://example.com">
<div data-url="https://example.com" data-api="https://api.example.com">
```

## 💡 예시

### 실행 예시
```bash
$ node html-cleaner.js lesson.html

📖 HTML 파일 읽는 중: lesson.html
🧹 외부 요청 코드 제거 중...
✅ 정리 완료! 저장된 파일: lesson_cleaned.html
📊 원본 크기: 17555.10 KB
📊 정리 후 크기: 15797.22 KB
📊 감소량: 1757.89 KB
```

### 배치 처리 예시
```bash
$ node html-cleaner.js --all

📂 3개의 HTML 파일을 찾았습니다.

🔄 [1/3] 처리 중: lesson1.html
📖 HTML 파일 읽는 중: lesson1.html
🧹 외부 요청 코드 제거 중...
✅ 정리 완료! 저장된 파일: lesson1_cleaned.html
📊 원본 크기: 1250.5 KB
📊 정리 후 크기: 1100.2 KB
📊 감소량: 150.3 KB

🔄 [2/3] 처리 중: lesson2.html
...

🎉 모든 HTML 파일 정리가 완료되었습니다!
```

## ⚠️ 주의사항

### 1. 백업 권장
- 원본 파일은 자동으로 보존되지만, 중요한 파일의 경우 별도 백업을 권장합니다.

### 2. 기능 제한
- 정리 후 HTML 파일은 정적인 내용만 표시됩니다.
- JavaScript 기반의 동적 기능은 모두 제거됩니다.
- 외부 스타일시트가 제거되어 스타일이 변경될 수 있습니다.

### 3. 파일 크기
- 매우 큰 HTML 파일의 경우 처리 시간이 오래 걸릴 수 있습니다.
- 메모리 사용량을 고려하여 적절한 크기의 파일만 처리하세요.

### 4. 파일명 제한
- 특수 문자가 포함된 파일명의 경우 `--all` 옵션을 사용하는 것을 권장합니다.

## 🔧 커스터마이징

코드를 수정하여 다음과 같은 커스터마이징이 가능합니다:

### 제거 규칙 추가
```javascript
// html-cleaner.js의 cleanHtmlContent 함수에 추가
cleanedContent = cleanedContent.replace(/새로운_패턴/gi, '');
```

### 제거 규칙 비활성화
특정 규칙을 비활성화하려면 해당 줄을 주석 처리하세요:
```javascript
// cleanedContent = cleanedContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
```

## 🛠️ API 사용

모듈로 사용할 경우:

```javascript
const { cleanHtmlContent, cleanHtmlFile, cleanAllHtmlFiles } = require('./html-cleaner');

// HTML 내용 직접 정리
const cleanedHtml = cleanHtmlContent(htmlString);

// 파일 정리
cleanHtmlFile('input.html', 'output.html');

// 디렉토리 내 모든 파일 정리
cleanAllHtmlFiles('./html-files/');
```

## 🐛 문제 해결

### 파일을 찾을 수 없다는 오류
- 파일 경로가 올바른지 확인하세요.
- 파일명에 특수문자가 있는 경우 `--all` 옵션을 사용하세요.

### 메모리 부족 오류
- 파일 크기가 너무 큰 경우 발생할 수 있습니다.
- 파일을 나누어 처리하거나 더 작은 파일로 테스트해보세요.

### 예상과 다른 결과
- 정리 후 HTML 파일의 주석을 확인하여 어떤 요소들이 제거되었는지 확인하세요.

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

버그 리포트, 기능 제안, 풀 리퀘스트는 언제나 환영합니다!

---

**만든이**: 개발자  
**버전**: 1.0.0  
**최종 업데이트**: 2024년 5월 