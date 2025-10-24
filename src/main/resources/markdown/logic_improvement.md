# 객관식 문항 생성 로직 개선 방안

안녕하세요! 현재 객관식 문항 생성 로직의 문제점을 해결하고 더 안정적으로 동작하도록 개선하는 방안을 안내해 드립니다.

## 1. 문제점 분석

현재 로직은 `TestService.java`의 `findTestItemWithOptions` 메소드에서 정답과 **동일한 `studyNo` 내에서** 오답을 찾고 있습니다.

```java
// TestService.java의 기존 로직 일부
List<ExamDto> allExams = adminStudyMapper.getExamsByStudyNo(correctExam.getStudyNo());
List<ExamDto> wrongExams = allExams.stream()
        .filter(e -> e.getExamNo() != correctExamNo)
        .collect(Collectors.toList());
// ...
```

이 방식은 해당 `studyNo`에 예문(`exam`)이 3개 미만일 경우, 2개의 오답을 생성하지 못하는 문제가 발생할 수 있습니다. 또한, 오답이 정답과 너무 유사한 내용이 될 수 있습니다.

## 2. 개선 방안

이 문제를 해결하기 위해, 오답을 현재 `studyNo`에 국한하지 않고 **전체 `exam` 테이블에서 랜덤으로** 가져오도록 로직을 변경합니다. 이렇게 하면 항상 충분한 오답 후보를 확보할 수 있습니다.

변경 사항은 `TestMapper.java`와 `TestService.java` 두 파일에 적용됩니다.

---

## 3. 코드 변경 사항

### 3.1. `TestMapper.java` 수정

`exam` 테이블에서 정답을 제외한 랜덤 예문 2개를 직접 가져오는 새로운 SQL 쿼리를 추가합니다.

`@Desktop/sayKorean/src/main/java/web/model/mapper/TestMapper.java` 파일에 아래 메소드를 추가해 주세요.

```java
// ... 기존 TestMapper.java 코드 ...

    // 3) 정답(예문) 조회: Gemini 채점용 ground truth 확보
    @Select("SELECT examNo, examKo, examEn, examJp, examCn, examEs FROM exam WHERE examNo = #{examNo}")
    ExamDto findExamByNo( int examNo );

    // [추가] N개의 랜덤 오답 예문 조회 (정답 제외)
    @Select("SELECT examNo, examKo FROM exam WHERE examNo != #{excludedExamNo} ORDER BY RAND() LIMIT #{limit}")
    List<ExamDto> findRandomExamsExcluding(@Param("excludedExamNo") int excludedExamNo, @Param("limit") int limit);

    // 전체 점수 출력 - 로직 : 랭킹테이블에 저장 -> 점수 집계
// ... 나머지 TestMapper.java 코드 ...
```
> **참고**: `ORDER BY RAND()`는 MySQL/MariaDB 기준입니다. 다른 데이터베이스(예: PostgreSQL의 `RANDOM()`, Oracle의 `dbms_random`)를 사용하신다면 해당 DB에 맞는 문법으로 수정해야 할 수 있습니다.

### 3.2. `TestService.java` 수정

`findTestItemWithOptions` 메소드에서 오답을 찾는 로직을 새로 추가한 `findRandomExamsExcluding` 메소드를 사용하도록 변경합니다. 이 과정에서 불필요해진 `AdminStudyMapper` 의존성도 제거합니다.

`@Desktop/sayKorean/src/main/java/web/service/TestService.java` 파일을 아래와 같이 수정하세요.

```java
package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.ExamDto;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemWithMediaDto;
// [제거] import web.model.mapper.AdminStudyMapper;
import web.model.mapper.TestMapper;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestMapper testMapper;
    // [제거] private final AdminStudyMapper adminStudyMapper;
    private final GeminiScoringService gemini;
    private static final int PASS_THRESHOLD = 60;

    // [1] 시험 목록
    public List<TestDto> getListTest() { return testMapper.getListTest(); }

    // [2] 문항 목록 (이미지/오디오 포함) - 난수화된 오답 추가 <수정됨>
    public List<Map<String , Object>> findTestItemWithOptions(int testNo) {
        // 1. 문항 목록 조회
        List<TestItemWithMediaDto> items = testMapper.findTestItemsWithMedia(testNo);
        List<Map<String , Object>> result = new ArrayList<>();

        for (TestItemWithMediaDto item : items){
            Map<String , Object> itemMap = new HashMap<>();
            itemMap.put("testItemNo" , item.getTestItemNo());
            itemMap.put("question" , item.getQuestion());
            itemMap.put("testNo" , item.getTestNo());
            itemMap.put("imageName" , item.getImageName());
            itemMap.put("imagePath" , item.getImagePath());
            itemMap.put("audios", item.getAudios());

            // 객관식 문항인 경우 (그림 , 음성)
            if (isMultipleChoice(item.getQuestion())) {
                // 정답 examNo
                int correctExamNo = item.getExamNo();
                ExamDto correctExam = testMapper.findExamByNo(correctExamNo);

                if (correctExam != null) {
                    // [수정된 로직]
                    // 정답을 제외한 2개의 랜덤 오답을 DB에서 직접 가져옴
                    List<ExamDto> selectedWrong = testMapper.findRandomExamsExcluding(correctExamNo, 2);

                    // 선택지 목록 생성 (정답 1개 + 오답 2개)
                    List<Map<String, Object>> options = new ArrayList<>();

                    // 정답 추가
                    Map<String, Object> correctOption = new HashMap<>();
                    correctOption.put("examNo", correctExam.getExamNo());
                    correctOption.put("examKo", correctExam.getExamKo());
                    correctOption.put("isCorrect", true);
                    options.add(correctOption);

                    // 오답 추가
                    for (ExamDto wrong : selectedWrong) {
                        Map<String, Object> wrongOption = new HashMap<>();
                        wrongOption.put("examNo", wrong.getExamNo());
                        wrongOption.put("examKo", wrong.getExamKo());
                        wrongOption.put("isCorrect", false);
                        options.add(wrongOption);
                    }

                    // 선택지 섞기
                    Collections.shuffle(options);
                    itemMap.put("options", options);
                }
            } else {
                // 주관식일 경우 정답 저장
                itemMap.put("correctExamNo" , item.getExamNo());
                itemMap.put("correctExamKo" , item.getExamKo());
            }

            result.add(itemMap);
        }
        return result;
    }

    // ... 이하 나머지 TestService.java 코드는 동일 ...
    // [3] 정답 예문 조회
    public ExamDto findExamByNo(int examNo) { return testMapper.findExamByNo(examNo); }
    // ...
}
```

## 4. 프론트엔드 및 컨트롤러

-   **`TestController.java`**: 변경이 필요 없습니다. 기존과 동일하게 서비스 메소드를 호출합니다.
-   **`Test.jsx`**: 변경이 필요 없습니다. 백엔드에서 보내주는 `options` 배열의 구조가 동일하므로, 기존 렌더링 로직을 그대로 사용할 수 있습니다.

---

위와 같이 수정하면, `studyNo`에 관계없이 항상 안정적으로 2개의 오답을 포함한 객관식 문항을 생성할 수 있습니다.
