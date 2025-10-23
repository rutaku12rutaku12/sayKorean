package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.ExamDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemDto;
import web.model.mapper.AdminStudyMapper;
import web.model.mapper.AdminTestMapper;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminTestService {
    // [*] DI
    private final AdminTestMapper adminTestMapper;
    private final AdminStudyMapper adminStudyMapper;

    // [*] studyNo로 예문 목록 조회 (시험 문항 생성 시 사용)
    public List<ExamDto> getExamsByStudyNo(int studyNo) {
        return adminStudyMapper.getExamsByStudyNo(studyNo);
    }

    // [ATE-01] 시험 생성 createTest() 자동 문항 생성 포함
    // 시험 테이블 레코드를 추가한다
    // 매개변수 TestDto
    // 반환 int (PK)
    // 1) 셀렉트 박스 활용하여 Genre -> 하위 Study 테이블 -> 하위 Exam 테이블 조회 후 StudyNo 연동
    // 2) 시험제목(testTitle)을 입력받는다
    // 3) 해당하는 Study 테이블의 studyNo를 FK로 받는다."
    public int createTest(TestDto testDto) {
        adminTestMapper.createTest(testDto);
        return testDto.getTestNo(); // PK 반환
    }

    // [ATE-01-AUTO] 자동 시험 문항 생성
    public Map<String , Object> createTestWithItems(TestDto testDto , boolean autoGenerate) {
        // 1. 시험 생성
        adminTestMapper.createTest(testDto);
        int testNo = testDto.getTestNo();

        Map<String, Object> result = new HashMap<>();
        result.put("testNo" , testNo);

        if (autoGenerate) {
            // 2. studyNo에 해당하는 모든 예문 조회
            List<ExamDto> allExams = adminStudyMapper.getExamsByStudyNo(testDto.getStudyNo());
            // 3. 만약 해당 주제 예문이 없을 경우
            if (allExams.isEmpty()) {
                result.put("message" , "해당 주제에 예문이 없습니다.");
                result.put("itemsCreated" , 0);
                return result;
            }
            // 4. 예문을 섞어서 3개 선택하기 (그림, 음성, 주관식용)
            Collections.shuffle(allExams);

            List<TestItemDto> createdItems = new ArrayList<>();
            int itemCount = Math.min(3, allExams.size());
            String [] questionTypes = {"그림:" , "음성:", "주관식:"};

            for (int i = 0; i <itemCount; i++) {
                ExamDto exam = allExams.get(i);
                TestItemDto item = new TestItemDto();
                item.setTestNo(testNo);
                item.setExamNo(exam.getExamNo());

                // 문항 유형에 따른 질문 생성
                String questionType = questionTypes[i];
                String question = questionType + "올바른 표현을 고르세요.";

                if (questionType.equals("주관식:")) {
                    question = "주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.";
                }

                item.setQuestion(question);
                adminTestMapper.createTestItem(item);
                createdItems.add(item);
            }

            result.put("itemsCreated" , createdItems.size());
            result.put("items" , createdItems);
        }
        return result;
    }

    // [ATE-01-CUSTOM] 커스텀 시험 문항 생성
    public List<Integer> createCustomTestItems(int testNo , List<TestItemDto> items) {
        List<Integer> itemNos = new ArrayList<>();

        for (TestItemDto item : items) {
            item.setTestNo(testNo);
            adminTestMapper.createTestItem(item);
            itemNos.add(item.getTestItemNo());
        }

        return itemNos;
    }


    // [ATE-02] 시험 수정 updateTest()
    // 시험 테이블 레코드를 변경한다
    // 매개변수 TestDto
    // 반환 int
    // 1) ATE-01 로직에서 연결한 studyNo가 같은 study 테이블의 주제를 불러온다.
    // 2) 시험제목(testTitle)을 수정한다
    public int updateTest(TestDto testDto) {
        return adminTestMapper.updateTest(testDto);
    }

    // [ATE-03] 시험 삭제 deleteTest()
    // 시험 테이블 레코드를 삭제한다
    // 매개변수 int
    // 반환 int
    public int deleteTest(int testNo) {
        return adminTestMapper.deleteTest(testNo);
    }

    // [ATE-04] 시험 전체조회 getTest()
    // 시험 테이블 레코드를 모두 조회한다
    // 반환 List<TestDto>
    public List<TestDto> getTest () {
        return adminTestMapper.getTest();
    }

    // [ATE-05]	시험 개별조회	getIndiTest()
    // 시험 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 TestDto
    public TestDto getIndiTest(int testNo) {
        return adminTestMapper.getIndiTest(testNo);
    }
    
    // [ATE-06] 시험의 문항 목록 조회
    public List<TestItemDto> getTestItemsByTestNo(int testNo) {
        return adminTestMapper.getTestItem().stream()
                .filter(item -> item.getTestNo() == testNo)
                .collect(Collectors.toList());
    }

    // [ATI-01]	시험문항 생성	createTestItem()
    // 시험문항 테이블 레코드를 추가한다
    // 매개변수 TestItemDto
    // 반환 int(PK)
    // 1) ATE-01 로직 실행 후 examNo와 testNo를 이어받는다.
    // 2) 셀렉트박스로 질문유형(그림/음성/주관식)을 제공한다.
    // 3) 정기시험 형식으로 주제 당 그림, 음성, 주관식 총 3항목씩 만들기 (예문 하나씩 가져와서)
    // *) 생성할 때 최소 3개 이상의 시험문항이 있어야함!
    // *) 생성할 때 그림, 음성, 주관식 문항이 1개 이상씩 있어야함!
    public int createTestItem(TestItemDto testItemDto) {
        adminTestMapper.createTestItem(testItemDto);
        return testItemDto.getTestItemNo(); // PK 반환
    }

    // [ATI-02]	시험문항 수정	updateTestItem()
    // 시험문항 테이블 레코드를 변경한다
    // 매개변수 TestItemDto
    // 반환 int
    public int updateTestItem(TestItemDto testItemDto){
        return adminTestMapper.updateTestItem(testItemDto);
    }

    // [ATI-03]	시험문항 삭제	deleteTestItem()
    // 시험문항 테이블 레코드를 삭제한다
    // 매개변수 int
    // 반환 int
    public int deleteTestItem(int testItemNo) {
        return adminTestMapper.deleteTestItem(testItemNo);
    }

    // [ATI-04]	시험문항 전체조회	getTestItem()
    // 시험문항 테이블 레코드를 모두 조회한다
    // 반환 List<TestItemDto>
    public List<TestItemDto> getTestItem() {
        return adminTestMapper.getTestItem();
    }

    // [ATI-05]	시험문항 개별조회	getIndiTestItem()
    // 시험문항 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 TestItemDto
    // * 난수화해서 사용자가 시험을 풀 때 조회할 수 있게 한다.
    public TestItemDto getIndiTestItem(int testItemNo){
        return adminTestMapper.getIndiTestItem(testItemNo);
    }



}
