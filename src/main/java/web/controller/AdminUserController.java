package web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.AttendDto;
import web.model.dto.RankingDto;
import web.service.AdminUserService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

// [*] 예외 핸들러 : 전역으로도 사용 가능
@Log4j2
@RestControllerAdvice(assignableTypes = {AdminUserController.class}) // 해당 컨트롤러에서만 적용
class AdminUserExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        // 로그 에러 개발자에게 반환
        log.error("에러 발생 : {}", e.getMessage(), e);

        // 클라이언트에게 보낼 메시지는 명확하게!
        String userMessage = "요청 처리 중 오류 발생했습니다.";
        if (e.getMessage().contains("Duplicate entry")) {
            userMessage = "이미 존재하는 데이터입니다.";
        } else if (e.getMessage().contains("foreign key constraint")) {
            userMessage = "연관된 데이터가 있어 삭제할 수 없습니다.";
        }

        // 클라이언트 메시지 반환
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(userMessage);
    }
}

@RestController
@RequestMapping("/saykorean/admin/user")
@RequiredArgsConstructor
@Log4j2
public class AdminUserController {

    // [*] DI
    private final AdminUserService adminUserService;

    // [1] AU-01	회원 통계	getStaticUser()
    // ranking의 모든 정보를 불러오고 userNo 별로 묶어서 출력한다.
    // 매개변수 x
    // 반환 List<RankingDto>
    // URL : http://localhost:8080/saykorean/admin/user
    @GetMapping("")
    public ResponseEntity<List<Map<String, Object>>> getStaticUser() {
        log.info("[AU-01] 회원 통계 조회");
        List<Map<String, Object>> users = adminUserService.getStaticUser();
        return ResponseEntity.ok(users);
    }

    // [2] AU-02	회원 통계 상세검색	searchStaticUser()
    // 랭킹 테이블 레코드의 userNo를 사용자 테이블의 userNo와 join하여 두 테이블의 정보를 조회한다.
    // 매개변수 userNo
    // 반환 RankingDto
    // URL : http://localhost:8080/saykorean/admin/user/search
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchStaticUser (@RequestParam int userNo) {
        log.info("[AU-02] 회원 상세 조회: userNo={}" , userNo);
        Map<String , Object> userInfo = adminUserService.searchStaticUser(userNo);
        return ResponseEntity.ok(userInfo);
    }

    // [3] AU-03	회원 제재	updateRestrictUser()
    // users의 userState 상태를 (n)일간 -2로 변경한다. (제제된 상태) userState가 -2이면, 로그인 시 (n)일간 제제되었다고 출력시킨다.
    // 매개변수 userNo , int restrictDay
    // 반환 int(성공 1)
    // URL : http://localhost:8080/saykorean/admin/user/restrict
    @GetMapping("/restrict")
    public ResponseEntity<Integer> updateRestrictUser(
            @RequestParam int userNo,
            @RequestParam int restrictDay) {
        log.info("[AU-03] 회원 제재: userNo={} , restrictDay={}" , userNo, restrictDay);
        int result = adminUserService.updateRestrictUser(userNo, restrictDay);
        return ResponseEntity.ok(result);
    }

    // [4] AU-04	회원 권한 변경	updateRoleUser()
    // users의 urole를 "USER" 또는 "ADMIN"으로 변경한다.
    // 매개변수 userNo, urole
    // 반환 int(성공 1)
    // URL : http://localhost:8080/saykorean/admin/user/role
    @PutMapping("/role")
    public ResponseEntity<Integer> updateRoleUser(
            @RequestParam int userNo,
            @RequestParam String urole) {
        log.info("[AU-04] 권한 변경: userNo={} , urole={}" , userNo, urole);
        int result = adminUserService.updateRoleUser(userNo, urole);
        return ResponseEntity.ok(result);
    }

    // [5] AU-05	회원 출석 로그 조회	getAttendUser()
    // attend에서 userNo를 조건절로 입력받아 모든 출석 정보를 출력한다.
    // 매개변수 userNo
    // 반환 List<AttendDto>
    // URL : http://localhost:8080/saykorean/admin/user/attend
    @GetMapping("/attend")
    public ResponseEntity<List<AttendDto>> getAttendUser(@RequestParam int userNo) {
        log.info("[AU-05] 출석 로그 조회: userNo={}" , userNo);
        List<AttendDto> attendList = adminUserService.getAttendUser(userNo);
        return ResponseEntity.ok(attendList);
    }
    
    // [6] AU-06 회원 검색 및 필터링
    @GetMapping("/search/filter")
    public ResponseEntity<List<Map<String , Object>>> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer userState,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false , defaultValue = "userDate") String sortBy) {
    
        log.info("[AU-06] 회원 검색: keyword={}, userState={}, sortBy={}" , keyword, userState, sortBy);
        List<Map<String, Object>> users = adminUserService.searchUsers(
                keyword, userState, startDate, endDate, sortBy);
        return ResponseEntity.ok(users);
    }
    
    // [7] AU-07 회원 통계 대시보드
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestParam(defaultValue = "month") String period) {
        log.info("[AU-07] 대시보드 조회: period={}" , period);
        Map<String, Object> dashboard = adminUserService.getDashboard(period);
        return ResponseEntity.ok(dashboard);
    }
    
    // [8] AU-08 회원 시험 기록 EXCEL 다운로드
    @GetMapping("/excel")
    public ResponseEntity<ByteArrayResource> downloardExcel(@RequestParam int userNo) {
        log.info("[AU-08] Excel 다운로드: userNo={}" , userNo);

        try {
            // 시험 기록 조회
            List<Map<String, Object>> records = adminUserService.getUserTestRecords(userNo);

            // 엑셀 생성
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("시험 기록");

            // 헤더 생성
            Row headerRow = sheet.createRow(0);
            String[] headers = {"시험 회차", "문제", "시험명", "사용자 답변", "정답 여부", "제출 시각"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);

                // 헤더 스타일
                CellStyle headerStyle = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                headerStyle.setFont(font);
                headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
                headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                cell.setCellStyle(headerStyle);
            }
            
            // 데이터 입력
            int rowNum = 1;
            for (Map<String, Object> record : records) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(String.valueOf(record.get("testRound")));
                row.createCell(1).setCellValue(String.valueOf(record.get("question")));
                row.createCell(2).setCellValue(String.valueOf(record.get("testTitle")));
                row.createCell(3).setCellValue(String.valueOf(record.get("userAnswer")));
                row.createCell(4).setCellValue(
                        Integer.parseInt(String.valueOf(record.get("isCorrect"))) == 1 ? "정답" : "오답"
                );
                row.createCell(5).setCellValue(String.valueOf(record.get("resultDate")));
            }

            // 컬럼 너비 자동 조절
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Excel을 ByteArray로 변환
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();

            ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

            // 파일명 인코딩
            String fileName = URLEncoder.encode("회원_" + userNo + "_시험기록.xlsx" , StandardCharsets.UTF_8)
                    .replaceAll("\\+" , "%20");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + fileName)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(resource.contentLength())
                    .body(resource);

        } catch (IOException e) {
            log.error("Excel 생성 실패" , e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // [9] AU-09 회원 일괄 처리
    @PostMapping("/batch")
    public ResponseEntity<Integer> batchUpdate(@RequestBody Map<String, Object> request) {
        log.info("[AU-09] 일괄 처리: {}" , request);

        @SuppressWarnings("unchecked")
        List<Integer> userNos = (List<Integer>) request.get("userNos");
        String action = (String) request.get("action");
        Object value = request.get("value");

        int result = adminUserService.batchUpdate(userNos, action, value);
        return ResponseEntity.ok(result);
    }
    
    // [*] 특정 회원 시험 결과 목록
    @GetMapping("/rankings")
    public ResponseEntity<List<RankingDto>> getUserRankings(@RequestParam int userNo) {
        log.info("회원 시험 결과 조회: userNo={}" , userNo);
        List<RankingDto> rankings = adminUserService.getUserRankings(userNo);
        return ResponseEntity.ok(rankings);
    }



} // class end
