-- DROP DATABASE IF EXISTS sayKorean;
-- CREATE DATABASE IF NOT EXISTS sayKorean CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- DEFAULT CHARSET = utf8mb4
-- utf8mb4는 이모지, 한글, 일본어, 중국어 등 모든 유니코드 문자를 안전하게 저장할 수 있는 UTF-8의 확장판
-- COLLATE = utf8mb4_0900_ai_ci
-- 이 테이블의 문자 비교/정렬 규칙(Collation)
-- ci = 대소문자 구분 안 함(case-insensitive)
-- ai = 악센트 구분 안 함(accent-insensitive)
-- 0900은 MySQL 8.0 계열의 최신 유니코드 규칙
-- USE sayKorean;

-- [*] FK 순서대로 DROP 배치해야 실행됨!!!

-- [*] 외래키 체크 비활성화 (삭제 시)
SET FOREIGN_KEY_CHECKS = 0;

-- [*] 기존 테이블 전체 삭제
DROP TABLE IF EXISTS ranking;
DROP TABLE IF EXISTS testItem;
DROP TABLE IF EXISTS test;
DROP TABLE IF EXISTS audio;
DROP TABLE IF EXISTS exam;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS study;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS genre;
DROP TABLE IF EXISTS loading;

-- [*] 외래키 체크 재활성화
SET FOREIGN_KEY_CHECKS = 1;


-- =====================================================================
-- 1) 장르 테이블 (부모 - FK 없음)
-- =====================================================================
CREATE TABLE IF NOT EXISTS genre (
  genreNo   INT NOT NULL AUTO_INCREMENT,
  genreName VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (genreNo)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
-- 2) 사용자 테이블 (부모 - FK 없음)
-- =====================================================================
CREATE TABLE IF NOT EXISTS users (
  userNo       INT          NOT NULL AUTO_INCREMENT,
  name         VARCHAR(200) NOT NULL,
  email        VARCHAR(50)  NOT NULL UNIQUE,
  password     VARCHAR(50)  NOT NULL,
  nickName     VARCHAR(50)  NOT NULL DEFAULT '토돌이',
  phone        VARCHAR(15)  UNIQUE,
  signupMethod INT          NOT NULL DEFAULT 1,
  userState    INT          NOT NULL DEFAULT 1,
  userDate     DATETIME     NOT NULL DEFAULT NOW(),
  userUpdate   DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  PRIMARY KEY (userNo)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
-- 3) 로딩 테이블 (독립 - FK 없음)
-- =====================================================================
CREATE TABLE IF NOT EXISTS loading (
  loadNo       INT  NOT NULL AUTO_INCREMENT,
  loadTitle    TEXT NOT NULL,
  loadInfo     TEXT NOT NULL,
  loadFileName TEXT NOT NULL,
  PRIMARY KEY (loadNo)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
-- 4) 교육 주제 테이블 (1단계 - FK: genreNo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS study (
  studyNo   INT          NOT NULL AUTO_INCREMENT,
  themeKo   VARCHAR(255) NOT NULL UNIQUE,
  themeJp   VARCHAR(255) NOT NULL UNIQUE,
  themeCn   VARCHAR(255) NOT NULL UNIQUE,
  themeEn   VARCHAR(255) NOT NULL UNIQUE,
  themeEs   VARCHAR(255) NOT NULL UNIQUE,
  commenKo  TEXT         NOT NULL,
  commenJp  TEXT         NOT NULL,
  commenCn  TEXT         NOT NULL,
  commenEn  TEXT         NOT NULL,
  commenEs  TEXT         NOT NULL,
  genreNo   INT          NOT NULL,
  PRIMARY KEY (studyNo),
  CONSTRAINT fk_study_genre
    FOREIGN KEY (genreNo) REFERENCES genre(genreNo)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
-- 5) 출석 테이블 (1단계 - FK: userNo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS attendance (
  attenNo   INT      NOT NULL AUTO_INCREMENT,
  attenDate DATETIME NOT NULL,
  userNo    INT      NOT NULL,
  PRIMARY KEY (attenNo),
  UNIQUE KEY uq_attendance_user_datetime (userNo, attenDate),
  CONSTRAINT fk_attendance_user
    FOREIGN KEY (userNo) REFERENCES users(userNo)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
-- 6) 예문 테이블 (2단계 - FK: studyNo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS exam (
  examNo     INT          NOT NULL AUTO_INCREMENT,
  examKo     VARCHAR(500) NOT NULL UNIQUE,
  examRoman  VARCHAR(500) NOT NULL UNIQUE,
  examJp     VARCHAR(500) NOT NULL UNIQUE,
  examCn     VARCHAR(500) NOT NULL UNIQUE,
  examEn     VARCHAR(500) NOT NULL UNIQUE,
  examEs     VARCHAR(500) NOT NULL UNIQUE,
  imageName  VARCHAR(255) NOT NULL,
  imagePath  VARCHAR(255) NOT NULL,
  studyNo    INT          NOT NULL,
  PRIMARY KEY (examNo),
  CONSTRAINT fk_exam_study
    FOREIGN KEY (studyNo) REFERENCES study(studyNo)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
-- 7) 시험 테이블 (2단계 - FK: studyNo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS test (
  testNo    INT         NOT NULL AUTO_INCREMENT,
  testTitle VARCHAR(50) NOT NULL,
  studyNo   INT         NOT NULL,
  PRIMARY KEY (testNo),
  CONSTRAINT fk_test_study
    FOREIGN KEY (studyNo) REFERENCES study(studyNo)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
-- 8) 음성 파일 테이블 (3단계 - FK: examNo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS audio (
  audioNo   INT          NOT NULL AUTO_INCREMENT,
  audioName VARCHAR(255) NOT NULL,
  audioPath VARCHAR(255) NOT NULL,
  lang      INT          NOT NULL,
  examNo    INT          NOT NULL,
  PRIMARY KEY (audioNo),
  CONSTRAINT fk_audio_exam
    FOREIGN KEY (examNo) REFERENCES exam(examNo)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
-- 9) 시험문항 테이블 (3단계 - FK: examNo, testNo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS testItem (
  testItemNo INT      NOT NULL AUTO_INCREMENT,
  question   LONGTEXT NOT NULL,
  examNo     INT      NOT NULL,
  testNo     INT      NOT NULL,
  PRIMARY KEY (testItemNo),
  CONSTRAINT fk_testitem_exam
    FOREIGN KEY (examNo) REFERENCES exam(examNo)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_testitem_test
    FOREIGN KEY (testNo) REFERENCES test(testNo)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
-- 10) 랭킹 테이블 (4단계 - FK: testItemNo, userNo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS ranking (
  rankNo     INT          NOT NULL AUTO_INCREMENT,
  testRound  INT          NOT NULL,
  userAnswer VARCHAR(500) NOT NULL DEFAULT '객관식 문항이거나 공란으로 제출했습니다.',
  isCorrect  TINYINT      NOT NULL DEFAULT 0,
  resultDate DATETIME     NOT NULL DEFAULT NOW(),
  testItemNo INT          NOT NULL,
  userNo     INT          NOT NULL,
  PRIMARY KEY (rankNo),
  CONSTRAINT fk_ranking_testItem
    FOREIGN KEY (testItemNo) REFERENCES testItem(testItemNo)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ranking_user
    FOREIGN KEY (userNo) REFERENCES users(userNo)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;