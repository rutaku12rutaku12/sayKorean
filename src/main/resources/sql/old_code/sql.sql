drop database if exists saykorean;
CREATE DATABASE IF NOT EXISTS sayKorean CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- DEFAULT CHARSET = utf8mb4
-- utf8mb4는 이모지, 한글, 일본어, 중국어 등 모든 유니코드 문자를 안전하게 저장할 수 있는 UTF-8의 확장판
-- COLLATE = utf8mb4_0900_ai_ci
-- 이 테이블의 문자 비교/정렬 규칙(Collation)
-- ci = 대소문자 구분 안 함(case-insensitive)
-- ai = 악센트 구분 안 함(accent-insensitive)
-- 0900은 MySQL 8.0 계열의 최신 유니코드 규칙
-- USE sayKorean;

-- =====================================================================
-- 1) 장르 테이블
-- =====================================================================
DROP TABLE IF EXISTS genre;
CREATE TABLE IF NOT EXISTS genre (                                       -- 장르 테이블 생성
  genreNo   INT UNSIGNED NOT NULL AUTO_INCREMENT,                        -- PK: 양수 자동증가
  genreName VARCHAR(50)  NOT NULL UNIQUE,                                -- 장르명: 필수 + 중복 불가
  PRIMARY KEY (genreNo)                                                  -- 기본키 지정
) ENGINE=InnoDB                                                          -- 트랜잭션/외래키 지원 엔진
  DEFAULT CHARSET = utf8mb4                                              -- 테이블 문자셋
  COLLATE = utf8mb4_0900_ai_ci;                                          -- 테이블 콜레이션

-- =====================================================================
-- 2) 교육 주제 테이블 (요청명: study)
-- =====================================================================
DROP TABLE IF EXISTS study;
CREATE TABLE IF NOT EXISTS study (                                       -- study 테이블 생성(교육 주제)
  studyNo   INT           NOT NULL AUTO_INCREMENT,                       -- PK: 교육번호 자동증가
  themeKo   VARCHAR(255)  NOT NULL UNIQUE,                               -- 한국어 주제: 필수, 고유
  themeJp   VARCHAR(255)  NOT NULL UNIQUE,                               -- 일본어 주제: 필수, 고유
  themeCn   VARCHAR(255)  NOT NULL UNIQUE,                               -- 중국어 주제: 필수, 고유
  themeEn   VARCHAR(255)  NOT NULL UNIQUE,                               -- 영어 주제: 필수, 고유
  themeEs   VARCHAR(255)  NOT NULL UNIQUE,                               -- 스페인어 주제: 필수, 고유
  commenKo  TEXT          NOT NULL,                                      -- 한국어 해설: 긴 텍스트
  commenJp  TEXT          NOT NULL,                                      -- 일본어 해설
  commenCn  TEXT          NOT NULL,                                      -- 중국어 해설
  commenEn  TEXT          NOT NULL,                                      -- 영어 해설
  commenEs  TEXT          NOT NULL,                                      -- 스페인어 해설
  genreNo   INT UNSIGNED  NOT NULL,                                      -- FK: 장르번호
  PRIMARY KEY (studyNo),                                                 -- 기본키 지정
  CONSTRAINT fk_study_genre                                              -- FK 이름
    FOREIGN KEY (genreNo) REFERENCES genre(genreNo)                      -- genre.genreNo 참조
    ON UPDATE CASCADE ON DELETE RESTRICT                                  -- 장르 변경 전파 / 삭제 제한
) ENGINE=InnoDB                                                          -- InnoDB 엔진
  DEFAULT CHARSET = utf8mb4                                              -- 문자셋
  COLLATE = utf8mb4_0900_ai_ci;                                          -- 콜레이션

CREATE INDEX idx_study_genreNo ON study(genreNo);                        -- FK 조회 성능용 인덱스

-- =====================================================================
-- 3) 예문 테이블
-- =====================================================================
DROP TABLE IF EXISTS exam;
CREATE TABLE IF NOT EXISTS exam (                                        -- exam 테이블 생성(예문)
  examNo     INT          NOT NULL AUTO_INCREMENT,                       -- PK: 예문번호 자동증가
  examKo     VARCHAR(500) NOT NULL UNIQUE,                               -- 한국어 예문: 고유
  examRoman  VARCHAR(500) NOT NULL UNIQUE,                               -- 발음/로마자: 고유
  examJp     VARCHAR(500) NOT NULL UNIQUE,                               -- 일본어 예문: 고유
  examCn     VARCHAR(500) NOT NULL UNIQUE,                               -- 중국어 예문: 고유
  examEn     VARCHAR(500) NOT NULL UNIQUE,                               -- 영어 예문: 고유
  examEs     VARCHAR(500) NOT NULL UNIQUE,                               -- 스페인어 예문: 고유
  imageName  VARCHAR(255) ,                                      		-- 그림 파일명
  imagePath  VARCHAR(255) ,                                      		-- 그림 파일 경로
  studyNo    INT          NOT NULL,                                      -- FK: 교육번호(study.themeNo)
  PRIMARY KEY (examNo),                                                  -- 기본키 지정
  CONSTRAINT fk_exam_study                                               -- FK 이름
    FOREIGN KEY (studyNo) REFERENCES study(studyNo)                      -- study.themeNo 참조
    ON UPDATE CASCADE ON DELETE CASCADE                                   -- 주제 변경 전파 / 삭제 연쇄
) ENGINE=InnoDB                                                          -- InnoDB 엔진
  DEFAULT CHARSET = utf8mb4                                              -- 문자셋
  COLLATE = utf8mb4_0900_ai_ci;                                          -- 콜레이션

CREATE INDEX idx_exam_studyNo ON exam(studyNo);                          -- FK 조회 성능 인덱스

-- =====================================================================
-- 4) 음성 파일 테이블
-- =====================================================================
DROP TABLE IF EXISTS audio;
CREATE TABLE IF NOT EXISTS audio (                                       -- audio 테이블 생성
  audioNo   INT          NOT NULL AUTO_INCREMENT,                        -- PK: 음성파일번호 자동증가
  audioName VARCHAR(255) ,                                       -- 음성 파일명
  audioPath VARCHAR(255) ,                                       -- 음성 파일 경로
  lang      INT          NOT NULL,                                       -- 언어 코드(예: 0=ko 등)
  examNo    INT          NOT NULL,                                       -- FK: 예문번호(exam.examNo)
  PRIMARY KEY (audioNo),                                                 -- 기본키 지정
  CONSTRAINT fk_audio_exam                                               -- FK 이름
    FOREIGN KEY (examNo) REFERENCES exam(examNo)                         -- exam.examNo 참조
    ON UPDATE CASCADE ON DELETE CASCADE                                   -- 예문 변경/삭제 연쇄
) ENGINE=InnoDB                                                          -- InnoDB 엔진
  DEFAULT CHARSET = utf8mb4                                              -- 문자셋
  COLLATE = utf8mb4_0900_ai_ci;                                          -- 콜레이션

CREATE INDEX idx_audio_examNo ON audio(examNo);                          -- FK 조회 성능 인덱스

-- =====================================================================
-- 5) 사용자 테이블 (백틱으로 시스템 테이블명 충돌 예방)
-- =====================================================================
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (                                      -- users 테이블 생성(백틱 사용)
  userNo       INT UNSIGNED     NOT NULL AUTO_INCREMENT,                 -- PK: 사용자번호 자동증가
  name         VARCHAR(200)     NOT NULL,                                -- 이름
  email        VARCHAR(50)      NOT NULL UNIQUE,                         -- 이메일: 고유
  password     VARCHAR(50)      NOT NULL,                                -- 비밀번호(예시 길이)
  nickName     VARCHAR(50)      NOT NULL DEFAULT '토돌이',               -- 닉네임 기본값
  phone        VARCHAR(15)      UNIQUE,                                  -- 연락처: 고유(옵션 필수X)
  signupMethod INT              NOT NULL DEFAULT 1,                      -- 가입방식 코드 기본 1
  userState    INT              NOT NULL DEFAULT 1,                      -- 상태 코드 기본 1
  userDate     DATETIME         NOT NULL DEFAULT NOW(),                  -- 가입일시 기본 now()
  userUpdate   DATETIME         NOT NULL DEFAULT NOW() ON UPDATE NOW(),  -- 수정일시 자동 갱신
  PRIMARY KEY (userNo)                                                   -- 기본키 지정
) ENGINE=InnoDB                                                          -- InnoDB 엔진
  DEFAULT CHARSET = utf8mb4                                              -- 문자셋
  COLLATE = utf8mb4_0900_ai_ci;                                          -- 콜레이션

-- =====================================================================
-- 6) 출석 테이블
-- =====================================================================
DROP TABLE IF EXISTS attendance;
CREATE TABLE IF NOT EXISTS attendance (                                  -- attendance 테이블 생성
  attenNo   INT          NOT NULL AUTO_INCREMENT,                        -- PK: 출석번호 자동증가
  attenDate DATETIME     NOT NULL,                                       -- 출석일시(정확한 시간)
  userNo    INT UNSIGNED NOT NULL,                                       -- FK: 사용자번호
  PRIMARY KEY (attenNo),                                                 -- 기본키 지정
  UNIQUE KEY uq_attendance_user_datetime (userNo, attenDate),            -- 동일시각 중복 출석 방지
  CONSTRAINT fk_attendance_user                                          -- FK 이름
    FOREIGN KEY (userNo) REFERENCES users(userNo)                       -- users.userNo 참조
    ON UPDATE CASCADE ON DELETE CASCADE                                   -- 사용자 삭제 시 출석도 삭제
) ENGINE=InnoDB                                                          -- InnoDB 엔진
  DEFAULT CHARSET = utf8mb4                                              -- 문자셋
  COLLATE = utf8mb4_0900_ai_ci;                                          -- 콜레이션