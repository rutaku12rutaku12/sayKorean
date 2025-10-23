# 한국어 시험 애플리케이션 로직 요약

이 문서는 제공된 소스 코드를 바탕으로 외국인 사용자가 한국어 시험을 치르는 전체 과정을 요약합니다.

## 전체 흐름

1.  **시험 목록 조회**: 사용자가 로그인하면 응시 가능한 시험 목록을 확인합니다.
2.  **시험 시작**: 사용자가 특정 시험을 선택하여 시험 페이지로 이동합니다.
3.  **문제 풀이 및 제출**: 사용자는 각 문항에 대한 답을 입력합니다. 서술형 문제의 경우, 사용자가 입력한 답변은 Gemini AI를 통해 실시간으로 채점됩니다.
4.  **결과 저장**: 각 문항의 채점 결과(정답 여부, 사용자 답변 등)는 데이터베이스에 즉시 저장됩니다.
5.  **점수 확인**: 전체 시험이 끝나면, 사용자는 누적된 점수를 바탕으로 최종 결과를 확인할 수 있습니다.

---

## 세부 로직 분석

### 1. Frontend (React)

-   **`TestList.jsx` (시험 목록 페이지)**
    -   페이지가 로드되면 백엔드 API(`GET /saykorean/test`)를 호출하여 응시 가능한 모든 시험의 목록을 가져옵니다.
    -   사용자가 로그인하지 않은 상태라면 에러 페이지로 리디렉션하여 접근을 제한합니다.
    -   사용자가 목록에서 특정 시험의 '이동' 버튼을 클릭하면, 해당 시험의 고유 번호(`testNo`)와 함께 시험 페이지(`Test.jsx`)로 이동합니다.

-   **`Test.jsx` (시험 진행 페이지)**
    -   URL 파라미터(`testNo`)를 이용해 현재 진행할 시험이 무엇인지 식별합니다.
    -   백엔드 API(`GET /saykorean/test/findtestitem`)를 호출하여 해당 시험의 모든 문항 데이터를 가져옵니다.
    -   사용자가 서술형 문항의 입력란에서 포커스를 잃으면(`onBlur`), `submitAnswer` 함수가 실행됩니다.
    -   `submitAnswer` 함수는 백엔드 API(`POST /saykorean/test/test/{testNo}/items/{testItemNo}/free`)로 사용자 답변을 전송합니다. 이 때, 시험 회차, 사용자 답변, 언어 힌트(`ko`) 등의 정보를 함께 보냅니다.

### 2. Backend (Spring Boot)

-   **`TestController.java` (API 컨트롤러)**
    -   `GET /saykorean/test`: `TestService`를 통해 DB에 저장된 시험 목록을 클라이언트에게 반환합니다.
    -   `POST /saykorean/test/test/{testNo}/items/{testItemNo}/free`: **서술형 답변 제출 및 채점의 핵심 엔드포인트입니다.**
        -   세션에서 현재 로그인한 사용자의 번호(`userNo`)를 가져옵니다.
        -   `TestService`의 `submitFreeAnswer` 메소드를 호출하여 답변 채점 및 저장을 위임합니다.
        -   채점된 점수를 클라이언트에게 반환합니다.

-   **`TestService.java` (비즈니스 로직)**
    -   **`submitFreeAnswer` (서술형 답변 처리 메소드)**
        1.  DB에서 현재 문항의 정보와 모범 답안(`groundTruth`)을 조회합니다.
        2.  `GeminiScoringService`를 호출하여 사용자의 답변을 채점합니다.
        3.  Gemini로부터 받은 점수가 합격 기준점(`PASS_THRESHOLD`, 60점) 이상이면 '정답'으로 처리합니다.
        4.  채점 결과(정답 여부, 사용자 답변, 점수 등)를 `RankingDto`에 담아 DB의 `ranking` 테이블에 저장(`upsertRanking`)합니다.
    -   `pickGroundTruthByLang`: 언어 힌트(ko, en, jp 등)에 따라 여러 언어로 준비된 모범 답안 중 적절한 것을 선택합니다.

-   **`GeminiScoringService.java` (AI 채점 서비스)**
    -   `score` 메소드는 Google Gemini API를 호출하여 서술형 답변을 채점하는 역할을 합니다.
    -   **프롬프트 구성**: "문항", "기준 정답", "사용자 답변", "언어 힌트"를 조합하여 Gemini에게 전달할 프롬프트를 생성합니다.
    -   **API 호출**: 생성된 프롬프트를 Gemini 모델(`gemini-1.5-flash`)에 보내 채점을 요청합니다.
    -   **결과 파싱**: API 응답에서 점수(0~100점 사이의 정수)를 추출하여 반환합니다. 만약 비정상적인 응답이 오면 안정성을 위해 0점을 반환합니다.

-   **`TestMapper.java` (데이터베이스 연동)**
    -   MyBatis 매퍼 인터페이스로, SQL 쿼리를 통해 DB와 상호작용합니다.
    -   `getListTest`: 시험 목록을 조회합니다.
    -   `findTestItemsWithMedia`: 특정 시험의 문항, 정답, 관련 미디어(이미지, 오디오)를 한 번에 조회합니다.
    -   `upsertRanking`: 사용자의 답변 기록을 `ranking` 테이블에 삽입합니다.
    -   `getScore`: 특정 사용자의 특정 시험 회차에 대한 총점과 전체 문항 수를 집계합니다.

---

## 데이터 모델

-   **`TestItemWithMediaDto.java`**: 문항(`question`), 정답 정보(`examKo`, `examEn` 등), 미디어(`imagePath`, `audios`)를 포함하는 복합 데이터 전송 객체(DTO)입니다.
-   **`RankingDto.java`**: 사용자의 답변 기록을 나타내는 DTO. 시험 회차, 사용자 답변, 정답 여부(`isCorrect`), 사용자 번호 등이 포함됩니다.
