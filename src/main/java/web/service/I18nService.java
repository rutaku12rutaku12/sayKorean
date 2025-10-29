package web.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class I18nService {

    // i18n 메모리 저장소 (언어별 동일 키 세트)
    private static final Map<String, Map<String, String>> MEMORY = Map.of(

            // ===================== 한국어 =====================
            "ko", Map.ofEntries(
                    Map.entry("language.title", "언어 선택"),
                    Map.entry("language.changed", "언어가 변경되었습니다!"),

                    Map.entry("mypage.title", "마이페이지"),
                    Map.entry("mypage.nickname", "닉네임"),
                    Map.entry("mypage.joinDate", "가입일자"),
                    Map.entry("mypage.totalAttendance", "총 출석일수"),
                    Map.entry("mypage.currentStreak", "현재 연속 출석일수"),
                    Map.entry("mypage.genre", "내가 선택한 장르"),
                    Map.entry("mypage.language", "내가 선택한 언어"),
                    Map.entry("mypage.updateInfo", "회원정보 수정"),
                    Map.entry("mypage.selectGenre", "장르 설정"),
                    Map.entry("mypage.selectLanguage", "언어 설정"),

                    Map.entry("home.welcome", "환영합니다!"),
                    Map.entry("study.start", "학습 시작"),
                    Map.entry("study.theme", "오늘의 주제"),
                    Map.entry("exam.title", "시험 보기"),
                    Map.entry("exam.result", "결과 보기"),

                    Map.entry("common.days", "일"),
                    Map.entry("common.notset", "미설정"),
                    Map.entry("home.logout", "로그아웃"),
                    Map.entry("home.signup", "회원가입"),
                    Map.entry("home.login", "로그인"),
                    Map.entry("account.findEmailTitle", "이메일 찾기"),
                    Map.entry("account.findPasswordTitle", "비밀번호 찾기"),
                    Map.entry("account.name", "이름"),
                    Map.entry("account.phone", "연락처"),
                    Map.entry("account.email", "이메일"),
                    Map.entry("account.namePlaceholder", "이름을 입력해주세요."),
                    Map.entry("account.phonePlaceholder", "연락처를 입력해주세요."),
                    Map.entry("account.emailPlaceholder", "이메일을 입력해주세요."),
                    Map.entry("common.confirm", "확인"),

                    Map.entry("common.loading", "로딩 중..."),

                    // ================= Ranking =================
                    Map.entry("ranking.title", "한국어 학습 랭킹"),
                    Map.entry("ranking.tab.accuracy", "정답왕"),
                    Map.entry("ranking.tab.challenge", "도전왕"),
                    Map.entry("ranking.tab.persistence", "끈기왕"),

                    Map.entry("ranking.error.load", "랭킹을 불러오는 중 오류가 발생했습니다."),
                    Map.entry("ranking.empty", "아직 랭킹 데이터가 없습니다."),

                    Map.entry("ranking.th.place", "순위"),
                    Map.entry("ranking.th.nickname", "닉네임"),
                    Map.entry("ranking.th.accuracy", "정답률"),
                    Map.entry("ranking.th.correct", "정답 수"),
                    Map.entry("ranking.th.total", "총 문제 수"),
                    Map.entry("ranking.th.totalSolved", "총 풀이 수"),
                    Map.entry("ranking.th.avgRetry", "평균 재도전"),
                    Map.entry("ranking.th.uniqueItems", "시도한 문항 수"),
                    Map.entry("ranking.th.totalAttempts", "총 시도 수"),

                    Map.entry("ranking.placeN", "{{n}}위"),
                    Map.entry("ranking.unit.times", "회"),

                    Map.entry("ranking.info.title", "랭킹 기준 설명"),
                    Map.entry("ranking.info.accuracy", "정답률이 높은 순서로 순위를 매깁니다. (최소 5문제 이상 풀이 필요)"),
                    Map.entry("ranking.info.challenge", "가장 많은 문제를 푼 사용자 순서로 순위를 매깁니다."),
                    Map.entry("ranking.info.persistence", "같은 문제를 여러 번 재도전한 평균 횟수가 높은 순서로 순위를 매깁니다."),

                    // ================= Genre =================
                    Map.entry("genre.title", "장르 선택"),
                    Map.entry("genre.name.daily", "일상회화"),
                    Map.entry("genre.name.society", "현대사회"),
                    Map.entry("genre.name.media", "미디어"),
                    Map.entry("genre.name.kpop", "K-POP"),
                    Map.entry("genre.name.tradition", "전통"),
                    Map.entry("genre.name.digital", "디지털"),
                    Map.entry("genre.name.dialect", "방언"),

                    // ================= Test =================
                    Map.entry("beforeStudy.title", "한국어를 배워보아요"),
                    Map.entry("beforeStudy.start", "학습 시작"),
                    Map.entry("test.title", "시험 문항"),
                    Map.entry("test.empty", "문항이 없습니다."),
                    Map.entry("test.options.loadError", "선택지를 불러올 수 없습니다."),
                    Map.entry("test.subjective.placeholder", "답을 입력하세요"),
                    Map.entry("test.submit", "제출"),
                    Map.entry("test.feedback.correct", "✅ 정답!"),
                    Map.entry("test.feedback.wrong", "❌ 오답!"),
                    Map.entry("test.score.unit", "점"),
                    Map.entry("test.next", "다음 문제"),
                    Map.entry("test.result.view", "결과 보기"),

                    Map.entry("testList.title", "테스트 선택"),
                    Map.entry("testList.fallbackTitle", "테스트 #{{num}}"),
                    Map.entry("testList.go", "이동"),

                    Map.entry("signup.title", "회원가입"),
                    Map.entry("signup.button", "회원가입"),
                    Map.entry("account.check", "중복 확인"),
                    Map.entry("account.password", "비밀번호"),
                    Map.entry("account.passwordPlaceholder", "비밀번호를 입력해주세요."),
                    Map.entry("account.nickname", "닉네임"),
                    Map.entry("account.nicknamePlaceholder", "닉네임을 입력해주세요."),

                    Map.entry("successList.title", "내가 완수한 주제 목록 조회"),
                    Map.entry("successList.fallbackTitle", "주제 #{{num}}"),
                    Map.entry("successList.go", "이동"),
                    Map.entry("successList.empty", "완수한 주제가 아직 없습니다."),

                    Map.entry("login.title", "로그인 페이지"),
                    Map.entry("login.button", "로그인"),
                    Map.entry("login.find", "이메일 찾기/비밀번호 찾기"),

                    Map.entry("mypage.mySuccessedStudy", "완수한 주제 목록"),


                    // ================= SignUpPage.jsx =================
                    Map.entry("signup.signup" , "회원가입"),
                    Map.entry("signup.inputName" , "이름을 입력해주세요." ),
                    Map.entry("signup.inputEmail" , "이메일을 입력해주세요." ),
                    Map.entry("signup.duplCheck" , "중복 확인"),
                    Map.entry("signup.inputPassword" , "비밀번호를 입력해주세요."),
                    Map.entry("signup.inputNick" , "닉네임을 입력해주세요."),
                    Map.entry("signup.inputPhone" , "연락처를 입력해주세요."),


                    // ================= Ranking.jsx =================
                    Map.entry("ranking.accyracyKing" , "정답왕 (정답률 높은 순)"),
                    Map.entry("ranking.challengeKing" , "도전왕 (문제 많이 푼 순)"),
                    Map.entry("ranking.persistenceKing" , "끈기왕 (재도전 많이 한 순)"),
                    Map.entry("ranking.ranking" , "랭킹"),

                    // ================= LoadingPage.jsx =================
                    Map.entry("loading.sungrye" , "숭례문"),
                    Map.entry("loading.bookchon" , "북촌"),
                    Map.entry("loading.guckjungback" , "국립중앙박물관"),
                    Map.entry("loading.muryung" , "무령왕릉"),
                    Map.entry("loading.gwanghan" , "광한루원"),
                    Map.entry("loading.hanra" , "한라산"),
                    Map.entry("loading.sungryeInfo" , "숭례문은 조선의 수도였던 서울(한양)의 사대문 중 하나로, 흔히 남대문이라고도 불립니다."),
                    Map.entry("loading.bookchonInfo" ,  "북촌은 서울 북쪽에 위치한 한옥마을이며, 조선왕조 때 왕족, 양반, 관료 등이 살았던 고급가옥이 많아 양반촌이라고도 불렸습니다."),
                    Map.entry("loading.guckjungbackInfo" , "국립중앙박물관은 역사와 문화가 살아 숨쉬고, 과거와 현재, 미래가 공존하는 감동의 공간입니다."),
                    Map.entry("loading.muryungInfo" , "공주에 위치한 무령왕릉은 백제의 무령왕과 그 왕비가 묻힌 고분입니다. 아치형 구조가 눈에 띄는 벽돌무덤입니다."),
                    Map.entry("loading.gwanghanInfo" , "전북 남원의 광한루원에는 견우와 직녀의 슬픈 이야기가 깃든 오작교가 있습니다."),
                    Map.entry("loading.hanraInfo", "남한의 최고봉인 제주도 중앙에 있는 한라산 정상에는 화산호수 백록담이 있습니다. 금강산, 지리산과 함께 삼신산이라 불렸습니다."),
                    Map.entry("loading.grading", "토돌이 시험 채점하는 중..."),

                    // ================= Page404.jsx =================
                    Map.entry("page404.toLogin" , "로그인으로"),

                    // ================= MyInfoUpdate.jsx =================
                    Map.entry("myInfoUpdate.updateUserInfo" , "사용자 정보 수정"),
                    Map.entry("myInfoUpdate.duplCheck" , "중복 확인"),
                    Map.entry("myInfoUpdate.update" , "수정"),
                    Map.entry("myInfoUpdate.updatePassword" , "비밀번호 수정"),
                    Map.entry("myInfoUpdate.oldPassword" , "기존 비밀번호"),
                    Map.entry("myInfoUpdate.newPassword" , "새 비밀번호"),
                    Map.entry("myInfoUpdate.checkNewPassword" , "새 비밀번호 확인"),
                    Map.entry("myInfoUpdate.deleteUser" , "회원탈퇴"),
                    Map.entry("myInfoUpdate.delete" , "탈퇴"),

                    // ================= Study.jsx =================
                    Map.entry("study.korAudio" , "한국어 듣기"),
                    Map.entry("study.engAudio" , "영어 듣기"),
                    Map.entry("study.prev" , "이전"),
                    Map.entry("study.next" , "다음"),
                    Map.entry("study.eduEnd" , "교육 종료"),


                    // ================= Footer.jsx =================
                    Map.entry("footer.home" , "홈"),
                    Map.entry("footer.myPage" , "내정보"),
                    Map.entry("footer.study" , "학습"),
                    Map.entry("footer.test" , "시험"),
                    Map.entry("footer.ranking" , "순위"),

                    // ================= TestResult.jsx =================
                    Map.entry("test.result.loadError", "점수를 불러올 수 없습니다."),
                    Map.entry("test.result.title", "시험 결과"),
                    Map.entry("test.result.return", "테스트 화면으로 돌아가기"),
                    Map.entry("test.result.score", "정답"),
                    Map.entry("test.result.total", "총"),
                    Map.entry("test.result.perfect", "완벽합니다!"),
                    Map.entry("test.result.pass", "합격!"),
                    Map.entry("test.result.fail", "불합격")

            ),

            // ===================== 일본어 =====================
            "ja", Map.ofEntries(
                    Map.entry("language.title", "言語を選択"),
                    Map.entry("language.changed", "言語が変更されました！"),

                    Map.entry("mypage.title", "マイページ"),
                    Map.entry("mypage.nickname", "ニックネーム"),
                    Map.entry("mypage.joinDate", "登録日"),
                    Map.entry("mypage.totalAttendance", "総出席日数"),
                    Map.entry("mypage.currentStreak", "現在の連続出席日数"),
                    Map.entry("mypage.genre", "選択したジャンル"),
                    Map.entry("mypage.language", "選択した言語"),
                    Map.entry("mypage.updateInfo", "情報を修正"),
                    Map.entry("mypage.selectGenre", "ジャンル設定"),
                    Map.entry("mypage.selectLanguage", "言語設定"),

                    Map.entry("home.welcome", "ようこそ！"),
                    Map.entry("study.start", "学習を始める"),
                    Map.entry("study.theme", "今日のテーマ"),
                    Map.entry("exam.title", "テストを受ける"),
                    Map.entry("exam.result", "結果を見る"),

                    Map.entry("common.days", "日"),
                    Map.entry("common.notset", "未設定"),
                    Map.entry("home.logout", "ログアウト"),
                    Map.entry("home.signup", "新規登録"),
                    Map.entry("home.login", "ログイン"),
                    Map.entry("account.findEmailTitle", "メールアドレス検索"),
                    Map.entry("account.findPasswordTitle", "パスワード検索"),
                    Map.entry("account.name", "名前"),
                    Map.entry("account.phone", "電話番号"),
                    Map.entry("account.email", "メールアドレス"),
                    Map.entry("account.namePlaceholder", "名前を入力してください。"),
                    Map.entry("account.phonePlaceholder", "電話番号を入力してください。"),
                    Map.entry("account.emailPlaceholder", "メールアドレスを入力してください。"),
                    Map.entry("common.confirm", "確認"),

                    Map.entry("common.loading", "読み込み中..."),

                    // Ranking
                    Map.entry("ranking.title", "韓国語学習ランキング"),
                    Map.entry("ranking.tab.accuracy", "正答王"),
                    Map.entry("ranking.tab.challenge", "挑戦王"),
                    Map.entry("ranking.tab.persistence", "根気王"),

                    Map.entry("ranking.error.load", "ランキングの取得中にエラーが発生しました。"),
                    Map.entry("ranking.empty", "まだランキングデータがありません。"),

                    Map.entry("ranking.th.place", "順位"),
                    Map.entry("ranking.th.nickname", "ニックネーム"),
                    Map.entry("ranking.th.accuracy", "正答率"),
                    Map.entry("ranking.th.correct", "正答数"),
                    Map.entry("ranking.th.total", "総問題数"),
                    Map.entry("ranking.th.totalSolved", "総解答数"),
                    Map.entry("ranking.th.avgRetry", "平均再挑戦回数"),
                    Map.entry("ranking.th.uniqueItems", "試した問題数"),
                    Map.entry("ranking.th.totalAttempts", "総試行回数"),

                    Map.entry("ranking.placeN", "{{n}}位"),
                    Map.entry("ranking.unit.times", "回"),

                    Map.entry("ranking.info.title", "ランキング基準の説明"),
                    Map.entry("ranking.info.accuracy", "正答率が高い順に順位を付けます（少なくとも5問以上の解答が必要）。"),
                    Map.entry("ranking.info.challenge", "最も多くの問題を解いたユーザー順に順位を付けます。"),
                    Map.entry("ranking.info.persistence", "同じ問題への平均再挑戦回数が高い順に順位を付けます。"),

                    // Genre
                    Map.entry("genre.title", "ジャンルを選択"),
                    Map.entry("genre.name.daily", "日常会話"),
                    Map.entry("genre.name.society", "現代社会"),
                    Map.entry("genre.name.media", "メディア"),
                    Map.entry("genre.name.kpop", "K-POP"),
                    Map.entry("genre.name.tradition", "伝統"),
                    Map.entry("genre.name.digital", "デジタル"),
                    Map.entry("genre.name.dialect", "方言"),

                    // Test
                    Map.entry("beforeStudy.title", "韓国語を学びましょう"),
                    Map.entry("beforeStudy.start", "学習を始める"),
                    Map.entry("test.title", "テスト問題"),
                    Map.entry("test.empty", "問題がありません。"),
                    Map.entry("test.options.loadError", "選択肢を読み込めませんでした。"),
                    Map.entry("test.subjective.placeholder", "答えを入力してください"),
                    Map.entry("test.submit", "提出"),
                    Map.entry("test.feedback.correct", "✅ 正解！"),
                    Map.entry("test.feedback.wrong", "❌ 不正解！"),
                    Map.entry("test.score.unit", "点"),
                    Map.entry("test.next", "次の問題"),
                    Map.entry("test.result.view", "結果を見る"),

                    Map.entry("testList.title", "テストを選択"),
                    Map.entry("testList.fallbackTitle", "テスト #{{num}}"),
                    Map.entry("testList.go", "移動"),

                    Map.entry("signup.title", "新規登録"),
                    Map.entry("signup.button", "新規登録"),
                    Map.entry("account.check", "重複確認"),
                    Map.entry("account.password", "パスワード"),
                    Map.entry("account.passwordPlaceholder", "パスワードを入力してください。"),
                    Map.entry("account.nickname", "ニックネーム"),
                    Map.entry("account.nicknamePlaceholder", "ニックネームを入力してください。"),

                    Map.entry("successList.title", "達成したテーマ一覧"),
                    Map.entry("successList.fallbackTitle", "テーマ #{{num}}"),
                    Map.entry("successList.go", "移動"),
                    Map.entry("successList.empty", "まだ達成したテーマがありません。"),

                    Map.entry("login.title", "ログインページ"),
                    Map.entry("login.button", "ログイン"),
                    Map.entry("login.find", "メールアドレス/パスワードを探す"),

                    Map.entry("mypage.mySuccessedStudy", "達成したテーマ一覧"),

                    // SignUpPage.jsx
                    Map.entry("signup.signup" , "会員登録"),
                    Map.entry("signup.inputName" , "お名前を入力してください。" ),
                    Map.entry("signup.inputEmail" , "メールアドレスを入力してください。" ),
                    Map.entry("signup.duplCheck" , "重複確認"),
                    Map.entry("signup.inputPassword" , "パスワードを入力してください。"),
                    Map.entry("signup.inputNick" , "ニックネームを入力してください。"),
                    Map.entry("signup.inputPhone" , "連絡先を入力してください。"),

                    // Ranking.jsx
                    Map.entry("ranking.accyracyKing" , "正解王（正解率順）"),
                    Map.entry("ranking.challengeKing" , "挑戦王（問題数順）"),
                    Map.entry("ranking.persistenceKing" , "根気王（再挑戦数順）"),
                    Map.entry("ranking.ranking" , "ランキング"),

                    // LoadingPage.jsx
                    Map.entry("loading.sungrye" , "崇礼門"),
                    Map.entry("loading.bookchon" , "北村"),
                    Map.entry("loading.guckjungback" , "国立中央博物館"),
                    Map.entry("loading.muryung" , "武寧王陵"),
                    Map.entry("loading.gwanghan" , "広寒楼苑"),
                    Map.entry("loading.hanra" , "漢拏山"),
                    Map.entry("loading.sungryeInfo" , "崇礼門は朝鮮の首都だったソウル（漢陽）の四大門の一つで、一般的に南大門とも呼ばれています。"),
                    Map.entry("loading.bookchonInfo" ,  "北村はソウルの北側に位置する韓屋村で、朝鮮王朝時代に王族、両班、官僚などが住んでいた高級住宅が多く、両班村とも呼ばれていました。"),
                    Map.entry("loading.guckjungbackInfo" , "国立中央博物館は歴史と文化が息づき、過去と現在、未来が共存する感動の空間です。"),
                    Map.entry("loading.muryungInfo" , "公州に位置する武寧王陵は百済の武寧王とその王妃が埋葬された古墳です。アーチ型の構造が特徴的なレンガ墓です。"),
                    Map.entry("loading.gwanghanInfo" , "全北南原の広寒楼苑には牽牛と織女の悲しい物語が込められた烏鵲橋があります。"),
                    Map.entry("loading.hanraInfo", "南韓の最高峰である済州島中央にある漢拏山の頂上には火山湖の白鹿潭があります。金剛山、智異山とともに三神山と呼ばれていました。"),
                    Map.entry("loading.grading", "トドリが試験を採点中..."),

                    // Page404.jsx
                    Map.entry("page404.toLogin" , "ログインへ"),

                    // MyInfoUpdate.jsx
                    Map.entry("myInfoUpdate.updateUserInfo" , "ユーザー情報修正"),
                    Map.entry("myInfoUpdate.duplCheck" , "重複確認"),
                    Map.entry("myInfoUpdate.update" , "修正"),
                    Map.entry("myInfoUpdate.updatePassword" , "パスワード変更"),
                    Map.entry("myInfoUpdate.oldPassword" , "現在のパスワード"),
                    Map.entry("myInfoUpdate.newPassword" , "新しいパスワード"),
                    Map.entry("myInfoUpdate.checkNewPassword" , "新しいパスワード確認"),
                    Map.entry("myInfoUpdate.deleteUser" , "退会"),
                    Map.entry("myInfoUpdate.delete" , "退会"),

                    // Study.jsx
                    Map.entry("study.korAudio" , "韓国語音声"),
                    Map.entry("study.engAudio" , "英語音声"),
                    Map.entry("study.prev" , "前へ"),
                    Map.entry("study.next" , "次へ"),
                    Map.entry("study.eduEnd" , "学習終了"),

                    // Footer.jsx
                    Map.entry("footer.home" , "ホーム"),
                    Map.entry("footer.myPage" , "マイページ"),
                    Map.entry("footer.study" , "学習"),
                    Map.entry("footer.test" , "試験"),
                    Map.entry("footer.ranking" , "ランキング"),

                    // TestResult.jsx
                    Map.entry("test.result.loadError", "スコアを読み込めません。"),
                    Map.entry("test.result.title", "試験結果"),
                    Map.entry("test.result.return", "テスト画面に戻る"),
                    Map.entry("test.result.score", "正解"),
                    Map.entry("test.result.total", "全"),
                    Map.entry("test.result.perfect", "完璧です！"),
                    Map.entry("test.result.pass", "合格！"),
                    Map.entry("test.result.fail", "不合格")
            ),

            // ===================== 중국어(간체) =====================
            "zh-CN", Map.ofEntries(
                    Map.entry("language.title", "选择语言"),
                    Map.entry("language.changed", "语言已更改！"),

                    Map.entry("mypage.title", "我的页面"),
                    Map.entry("mypage.nickname", "昵称"),
                    Map.entry("mypage.joinDate", "注册日期"),
                    Map.entry("mypage.totalAttendance", "总出勤天数"),
                    Map.entry("mypage.currentStreak", "当前连续出勤天数"),
                    Map.entry("mypage.genre", "选择的类别"),
                    Map.entry("mypage.language", "选择的语言"),
                    Map.entry("mypage.updateInfo", "修改信息"),
                    Map.entry("mypage.selectGenre", "设置类别"),
                    Map.entry("mypage.selectLanguage", "设置语言"),

                    Map.entry("home.welcome", "欢迎!"),
                    Map.entry("study.start", "开始学习"),
                    Map.entry("study.theme", "今日主题"),
                    Map.entry("exam.title", "参加考试"),
                    Map.entry("exam.result", "查看结果"),

                    Map.entry("common.days", "天"),
                    Map.entry("common.notset", "未设置"),
                    Map.entry("home.logout", "退出登录"),
                    Map.entry("home.signup", "注册账号"),
                    Map.entry("home.login", "登录"),
                    Map.entry("account.findEmailTitle", "找回邮箱"),
                    Map.entry("account.findPasswordTitle", "找回密码"),
                    Map.entry("account.name", "姓名"),
                    Map.entry("account.phone", "电话"),
                    Map.entry("account.email", "邮箱"),
                    Map.entry("account.namePlaceholder", "请输入姓名。"),
                    Map.entry("account.phonePlaceholder", "请输入电话。"),
                    Map.entry("account.emailPlaceholder", "请输入邮箱。"),
                    Map.entry("common.confirm", "确认"),

                    Map.entry("common.loading", "加载中..."),

                    // Ranking
                    Map.entry("ranking.title", "韩语学习排行榜"),
                    Map.entry("ranking.tab.accuracy", "正答王"),
                    Map.entry("ranking.tab.challenge", "挑战王"),
                    Map.entry("ranking.tab.persistence", "坚持王"),

                    Map.entry("ranking.error.load", "加载排行榜时发生错误。"),
                    Map.entry("ranking.empty", "暂无排行榜数据。"),

                    Map.entry("ranking.th.place", "名次"),
                    Map.entry("ranking.th.nickname", "昵称"),
                    Map.entry("ranking.th.accuracy", "正确率"),
                    Map.entry("ranking.th.correct", "正确数"),
                    Map.entry("ranking.th.total", "总题数"),
                    Map.entry("ranking.th.totalSolved", "总作答数"),
                    Map.entry("ranking.th.avgRetry", "平均重试次数"),
                    Map.entry("ranking.th.uniqueItems", "尝试题目数"),
                    Map.entry("ranking.th.totalAttempts", "总尝试次数"),

                    Map.entry("ranking.placeN", "{{n}}名"),
                    Map.entry("ranking.unit.times", "次"),

                    Map.entry("ranking.info.title", "排行榜评定标准"),
                    Map.entry("ranking.info.accuracy", "按正确率从高到低排名（至少答 5 题）。"),
                    Map.entry("ranking.info.challenge", "按解题数量从多到少排名。"),
                    Map.entry("ranking.info.persistence", "按同一题目的平均重试次数从高到低排名。"),

                    // Genre
                    Map.entry("genre.title", "选择类别"),
                    Map.entry("genre.name.daily", "日常会话"),
                    Map.entry("genre.name.society", "现代社会"),
                    Map.entry("genre.name.media", "媒体"),
                    Map.entry("genre.name.kpop", "K-POP"),
                    Map.entry("genre.name.tradition", "传统"),
                    Map.entry("genre.name.digital", "数字化"),
                    Map.entry("genre.name.dialect", "方言"),

                    // Test
                    Map.entry("beforeStudy.title", "一起学习韩语吧"),
                    Map.entry("beforeStudy.start", "开始学习"),
                    Map.entry("test.title", "考试题目"),
                    Map.entry("test.empty", "没有题目。"),
                    Map.entry("test.options.loadError", "无法加载选项。"),
                    Map.entry("test.subjective.placeholder", "请输入答案"),
                    Map.entry("test.submit", "提交"),
                    Map.entry("test.feedback.correct", "✅ 正确！"),
                    Map.entry("test.feedback.wrong", "❌ 错误！"),
                    Map.entry("test.score.unit", "分"),
                    Map.entry("test.next", "下一题"),
                    Map.entry("test.result.view", "查看结果"),

                    Map.entry("testList.title", "选择测试"),
                    Map.entry("testList.fallbackTitle", "测试 #{{num}}"),
                    Map.entry("testList.go", "前往"),

                    Map.entry("signup.title", "注册账号"),
                    Map.entry("signup.button", "注册"),
                    Map.entry("account.check", "重复检查"),
                    Map.entry("account.password", "密码"),
                    Map.entry("account.passwordPlaceholder", "请输入密码。"),
                    Map.entry("account.nickname", "昵称"),
                    Map.entry("account.nicknamePlaceholder", "请输入昵称。"),

                    Map.entry("successList.title", "我完成的主题列表"),
                    Map.entry("successList.fallbackTitle", "主题 #{{num}}"),
                    Map.entry("successList.go", "前往"),
                    Map.entry("successList.empty", "尚无已完成的主题。"),

                    Map.entry("login.title", "登录页面"),
                    Map.entry("login.button", "登录"),
                    Map.entry("login.find", "找回邮箱/找回密码"),

                    Map.entry("mypage.mySuccessedStudy", "已完成的主题列表"),

                    // SignUpPage.jsx
                    Map.entry("signup.signup" , "注册"),
                    Map.entry("signup.inputName" , "请输入姓名。" ),
                    Map.entry("signup.inputEmail" , "请输入邮箱。" ),
                    Map.entry("signup.duplCheck" , "重复检查"),
                    Map.entry("signup.inputPassword" , "请输入密码。"),
                    Map.entry("signup.inputNick" , "请输入昵称。"),
                    Map.entry("signup.inputPhone" , "请输入联系方式。"),

                    // Ranking.jsx
                    Map.entry("ranking.accyracyKing" , "正确王（正确率排序）"),
                    Map.entry("ranking.challengeKing" , "挑战王（题目数排序）"),
                    Map.entry("ranking.persistenceKing" , "坚持王（重试次数排序）"),
                    Map.entry("ranking.ranking" , "排名"),

                    // LoadingPage.jsx
                    Map.entry("loading.sungrye" , "崇礼门"),
                    Map.entry("loading.bookchon" , "北村"),
                    Map.entry("loading.guckjungback" , "国立中央博物馆"),
                    Map.entry("loading.muryung" , "武宁王陵"),
                    Map.entry("loading.gwanghan" , "广寒楼苑"),
                    Map.entry("loading.hanra" , "汉拿山"),
                    Map.entry("loading.sungryeInfo" , "崇礼门是朝鲜首都首尔（汉阳）的四大门之一，通常也被称为南大门。"),
                    Map.entry("loading.bookchonInfo" ,  "北村是位于首尔北部的韩屋村，朝鲜王朝时期王族、两班、官员等居住的高级住宅较多，也被称为两班村。"),
                    Map.entry("loading.guckjungbackInfo" , "国立中央博物馆是历史与文化生生不息、过去与现在和未来共存的感动空间。"),
                    Map.entry("loading.muryungInfo" , "位于公州的武宁王陵是百济武宁王及其王妃的陵墓。其显著特征是拱形结构的砖墓。"),
                    Map.entry("loading.gwanghanInfo" , "全北南原的广寒楼苑有蕴含着牛郎织女悲伤故事的鹊桥。"),
                    Map.entry("loading.hanraInfo", "韩国最高峰济州岛中央的汉拿山顶上有火山湖白鹿潭。与金刚山、智异山一起被称为三神山。"),
                    Map.entry("loading.grading", "土豆正在批改试卷..."),

                    // Page404.jsx
                    Map.entry("page404.toLogin" , "前往登录"),

                    // MyInfoUpdate.jsx
                    Map.entry("myInfoUpdate.updateUserInfo" , "修改用户信息"),
                    Map.entry("myInfoUpdate.duplCheck" , "重复检查"),
                    Map.entry("myInfoUpdate.update" , "修改"),
                    Map.entry("myInfoUpdate.updatePassword" , "修改密码"),
                    Map.entry("myInfoUpdate.oldPassword" , "原密码"),
                    Map.entry("myInfoUpdate.newPassword" , "新密码"),
                    Map.entry("myInfoUpdate.checkNewPassword" , "确认新密码"),
                    Map.entry("myInfoUpdate.deleteUser" , "注销账户"),
                    Map.entry("myInfoUpdate.delete" , "注销"),

                    // Study.jsx
                    Map.entry("study.korAudio" , "韩语听力"),
                    Map.entry("study.engAudio" , "英语听力"),
                    Map.entry("study.prev" , "上一个"),
                    Map.entry("study.next" , "下一个"),
                    Map.entry("study.eduEnd" , "结束学习"),

                    // Footer.jsx
                    Map.entry("footer.home" , "首页"),
                    Map.entry("footer.myPage" , "我的信息"),
                    Map.entry("footer.study" , "学习"),
                    Map.entry("footer.test" , "考试"),
                    Map.entry("footer.ranking" , "排名"),

                    // TestResult.jsx
                    Map.entry("test.result.loadError", "无法加载分数。"),
                    Map.entry("test.result.title", "考试结果"),
                    Map.entry("test.result.return", "返回测试页面"),
                    Map.entry("test.result.score", "正确"),
                    Map.entry("test.result.total", "总共"),
                    Map.entry("test.result.perfect", "完美！"),
                    Map.entry("test.result.pass", "通过！"),
                    Map.entry("test.result.fail", "未通过")

                    ),

            // ===================== 영어 =====================
            "en", Map.ofEntries(
                    Map.entry("language.title", "Select Language"),
                    Map.entry("language.changed", "Language has been changed!"),

                    Map.entry("mypage.title", "My Page"),
                    Map.entry("mypage.nickname", "Nickname"),
                    Map.entry("mypage.joinDate", "Join Date"),
                    Map.entry("mypage.totalAttendance", "Total Attendance"),
                    Map.entry("mypage.currentStreak", "Current Streak"),
                    Map.entry("mypage.genre", "Selected Genre"),
                    Map.entry("mypage.language", "Selected Language"),
                    Map.entry("mypage.updateInfo", "Edit Info"),
                    Map.entry("mypage.selectGenre", "Set Genre"),
                    Map.entry("mypage.selectLanguage", "Set Language"),

                    Map.entry("home.welcome", "Welcome!"),
                    Map.entry("study.start", "Start Study"),
                    Map.entry("study.theme", "Today's Theme"),
                    Map.entry("exam.title", "Take a Test"),
                    Map.entry("exam.result", "View Results"),

                    Map.entry("common.days", "days"),
                    Map.entry("common.notset", "Not set"),
                    Map.entry("home.logout", "Logout"),
                    Map.entry("home.signup", "Sign Up"),
                    Map.entry("home.login", "Login"),
                    Map.entry("account.findEmailTitle", "Find Email"),
                    Map.entry("account.findPasswordTitle", "Find Password"),
                    Map.entry("account.name", "Name"),
                    Map.entry("account.phone", "Phone"),
                    Map.entry("account.email", "Email"),
                    Map.entry("account.namePlaceholder", "Please enter your name."),
                    Map.entry("account.phonePlaceholder", "Please enter your phone."),
                    Map.entry("account.emailPlaceholder", "Please enter your email."),
                    Map.entry("common.confirm", "Confirm"),

                    Map.entry("common.loading", "Loading..."),

                    // Ranking
                    Map.entry("ranking.title", "Korean Learning Rankings"),
                    Map.entry("ranking.tab.accuracy", "Top Accuracy"),
                    Map.entry("ranking.tab.challenge", "Top Challenger"),
                    Map.entry("ranking.tab.persistence", "Top Persistence"),

                    Map.entry("ranking.error.load", "An error occurred while loading the rankings."),
                    Map.entry("ranking.empty", "No ranking data yet."),

                    Map.entry("ranking.th.place", "Place"),
                    Map.entry("ranking.th.nickname", "Nickname"),
                    Map.entry("ranking.th.accuracy", "Accuracy"),
                    Map.entry("ranking.th.correct", "Correct"),
                    Map.entry("ranking.th.total", "Total Questions"),
                    Map.entry("ranking.th.totalSolved", "Total Solved"),
                    Map.entry("ranking.th.avgRetry", "Avg. Retries"),
                    Map.entry("ranking.th.uniqueItems", "Unique Items"),
                    Map.entry("ranking.th.totalAttempts", "Total Attempts"),

                    Map.entry("ranking.placeN", "{{n}}th place"),
                    Map.entry("ranking.unit.times", "times"),

                    Map.entry("ranking.info.title", "Ranking Criteria"),
                    Map.entry("ranking.info.accuracy", "Ranks by highest answer accuracy. (Requires at least 5 problems solved)"),
                    Map.entry("ranking.info.challenge", "Ranks by the most problems solved."),
                    Map.entry("ranking.info.persistence", "Ranks by the highest average retries on the same problem."),

                    // Genre
                    Map.entry("genre.title", "Select Genre"),
                    Map.entry("genre.name.daily", "Daily Conversation"),
                    Map.entry("genre.name.society", "Modern Society"),
                    Map.entry("genre.name.media", "Media"),
                    Map.entry("genre.name.kpop", "K-POP"),
                    Map.entry("genre.name.tradition", "Tradition"),
                    Map.entry("genre.name.digital", "Digital"),
                    Map.entry("genre.name.dialect", "Dialect"),

                    // Test
                    Map.entry("beforeStudy.title", "Let's learn Korean"),
                    Map.entry("beforeStudy.start", "Start Study"),
                    Map.entry("test.title", "Test Questions"),
                    Map.entry("test.empty", "No questions available."),
                    Map.entry("test.options.loadError", "Failed to load options."),
                    Map.entry("test.subjective.placeholder", "Enter your answer"),
                    Map.entry("test.submit", "Submit"),
                    Map.entry("test.feedback.correct", "✅ Correct!"),
                    Map.entry("test.feedback.wrong", "❌ Incorrect!"),
                    Map.entry("test.score.unit", "pts"),
                    Map.entry("test.next", "Next"),
                    Map.entry("test.result.view", "View Results"),

                    Map.entry("testList.title", "Select Test"),
                    Map.entry("testList.fallbackTitle", "Test #{{num}}"),
                    Map.entry("testList.go", "Go"),

                    Map.entry("signup.title", "Sign Up"),
                    Map.entry("signup.button", "Sign Up"),
                    Map.entry("account.check", "Check"),
                    Map.entry("account.password", "Password"),
                    Map.entry("account.passwordPlaceholder", "Please enter your password."),
                    Map.entry("account.nickname", "Nickname"),
                    Map.entry("account.nicknamePlaceholder", "Please enter your nickname."),

                    Map.entry("successList.title", "Completed Topics"),
                    Map.entry("successList.fallbackTitle", "Topic #{{num}}"),
                    Map.entry("successList.go", "Go"),
                    Map.entry("successList.empty", "No completed topics yet."),

                    Map.entry("login.title", "Log In Page"),
                    Map.entry("login.button", "Log In"),
                    Map.entry("login.find", "Find Email / Password"),

                    Map.entry("mypage.mySuccessedStudy", "Completed Topics"),

                    // SignUpPage.jsx
                    Map.entry("signup.signup" , "Sign Up"),
                    Map.entry("signup.inputName" , "Please enter your name." ),
                    Map.entry("signup.inputEmail" , "Please enter your email." ),
                    Map.entry("signup.duplCheck" , "Check Duplicate"),
                    Map.entry("signup.inputPassword" , "Please enter your password."),
                    Map.entry("signup.inputNick" , "Please enter your nickname."),
                    Map.entry("signup.inputPhone" , "Please enter your contact."),

                    // Ranking.jsx
                    Map.entry("ranking.accyracyKing" , "Accuracy King (By Correct Rate)"),
                    Map.entry("ranking.challengeKing" , "Challenge King (By Problems Solved)"),
                    Map.entry("ranking.persistenceKing" , "Persistence King (By Retry Count)"),
                    Map.entry("ranking.ranking" , "Ranking"),

                    // LoadingPage.jsx
                    Map.entry("loading.sungrye" , "Sungnyemun"),
                    Map.entry("loading.bookchon" , "Bukchon"),
                    Map.entry("loading.guckjungback" , "National Museum of Korea"),
                    Map.entry("loading.muryung" , "Tomb of King Muryeong"),
                    Map.entry("loading.gwanghan" , "Gwanghallu Garden"),
                    Map.entry("loading.hanra" , "Hallasan"),
                    Map.entry("loading.sungryeInfo" , "Sungnyemun is one of the four main gates of Seoul (Hanyang), the capital of Joseon, and is commonly called Namdaemun (South Gate)."),
                    Map.entry("loading.bookchonInfo" ,  "Bukchon is a hanok village located in the north of Seoul, and was called a yangban village due to the many luxury houses where royalty, yangban, and officials lived during the Joseon Dynasty."),
                    Map.entry("loading.guckjungbackInfo" , "The National Museum of Korea is a moving space where history and culture come alive, and the past, present, and future coexist."),
                    Map.entry("loading.muryungInfo" , "The Tomb of King Muryeong, located in Gongju, is the burial site of King Muryeong of Baekje and his queen. It is a brick tomb with a distinctive arched structure."),
                    Map.entry("loading.gwanghanInfo" , "Gwanghallu Garden in Namwon, Jeollabuk-do, has Ojakgyo Bridge which holds the sad story of Gyeonu and Jingnyeo."),
                    Map.entry("loading.hanraInfo", "At the summit of Hallasan, located in the center of Jeju Island and the highest peak in South Korea, is Baengnokdam, a volcanic lake. It was called one of the three sacred mountains along with Geumgangsan and Jirisan."),
                    Map.entry("loading.grading", "Todoli is grading the exam..."),

                    // Page404.jsx
                    Map.entry("page404.toLogin" , "To Login"),

                    // MyInfoUpdate.jsx
                    Map.entry("myInfoUpdate.updateUserInfo" , "Update User Information"),
                    Map.entry("myInfoUpdate.duplCheck" , "Check Duplicate"),
                    Map.entry("myInfoUpdate.update" , "Update"),
                    Map.entry("myInfoUpdate.updatePassword" , "Change Password"),
                    Map.entry("myInfoUpdate.oldPassword" , "Current Password"),
                    Map.entry("myInfoUpdate.newPassword" , "New Password"),
                    Map.entry("myInfoUpdate.checkNewPassword" , "Confirm New Password"),
                    Map.entry("myInfoUpdate.deleteUser" , "Delete Account"),
                    Map.entry("myInfoUpdate.delete" , "Delete"),

                    // Study.jsx
                    Map.entry("study.korAudio" , "Korean Audio"),
                    Map.entry("study.engAudio" , "English Audio"),
                    Map.entry("study.prev" , "Previous"),
                    Map.entry("study.next" , "Next"),
                    Map.entry("study.eduEnd" , "End Study"),

                    // Footer.jsx
                    Map.entry("footer.home" , "Home"),
                    Map.entry("footer.myPage" , "My Info"),
                    Map.entry("footer.study" , "Study"),
                    Map.entry("footer.test" , "Test"),
                    Map.entry("footer.ranking" , "Ranking"),

                    // TestResult.jsx
                    Map.entry("test.result.loadError", "Unable to load score."),
                    Map.entry("test.result.title", "Test Result"),
                    Map.entry("test.result.return", "Return to Test"),
                    Map.entry("test.result.score", "Correct"),
                    Map.entry("test.result.total", "Total"),
                    Map.entry("test.result.perfect", "Perfect!"),
                    Map.entry("test.result.pass", "Pass!"),
                    Map.entry("test.result.fail", "Fail")
            ),

            // ===================== 스페인어 =====================
            "es", Map.ofEntries(
                    Map.entry("language.title", "Seleccionar idioma"),
                    Map.entry("language.changed", "¡El idioma ha cambiado!"),

                    Map.entry("mypage.title", "Mi Página"),
                    Map.entry("mypage.nickname", "Apodo"),
                    Map.entry("mypage.joinDate", "Fecha de registro"),
                    Map.entry("mypage.totalAttendance", "Días totales de asistencia"),
                    Map.entry("mypage.currentStreak", "Racha actual"),
                    Map.entry("mypage.genre", "Género seleccionado"),
                    Map.entry("mypage.language", "Idioma seleccionado"),
                    Map.entry("mypage.updateInfo", "Editar información"),
                    Map.entry("mypage.selectGenre", "Configurar género"),
                    Map.entry("mypage.selectLanguage", "Configurar idioma"),

                    Map.entry("home.welcome", "¡Bienvenido!"),
                    Map.entry("study.start", "Iniciar estudio"),
                    Map.entry("study.theme", "Tema de hoy"),
                    Map.entry("exam.title", "Hacer prueba"),
                    Map.entry("exam.result", "Ver resultados"),

                    Map.entry("common.days", "días"),
                    Map.entry("common.notset", "Sin seleccionar"),
                    Map.entry("home.logout", "Cerrar sesión"),
                    Map.entry("home.signup", "Registrarse"),
                    Map.entry("home.login", "Iniciar sesión"),
                    Map.entry("account.findEmailTitle", "Buscar correo electrónico"),
                    Map.entry("account.findPasswordTitle", "Recuperar contraseña"),
                    Map.entry("account.name", "Nombre"),
                    Map.entry("account.phone", "Teléfono"),
                    Map.entry("account.email", "Correo electrónico"),
                    Map.entry("account.namePlaceholder", "Introduce tu nombre."),
                    Map.entry("account.phonePlaceholder", "Introduce tu teléfono."),
                    Map.entry("account.emailPlaceholder", "Introduce tu correo electrónico."),
                    Map.entry("common.confirm", "Confirmar"),

                    Map.entry("common.loading", "Cargando..."),

                    // Ranking
                    Map.entry("ranking.title", "Ranking de aprendizaje de coreano"),
                    Map.entry("ranking.tab.accuracy", "Rey de precisión"),
                    Map.entry("ranking.tab.challenge", "Rey del desafío"),
                    Map.entry("ranking.tab.persistence", "Rey de constancia"),

                    Map.entry("ranking.error.load", "Ocurrió un error al cargar el ranking."),
                    Map.entry("ranking.empty", "Aún no hay datos de ranking."),

                    Map.entry("ranking.th.place", "Puesto"),
                    Map.entry("ranking.th.nickname", "Apodo"),
                    Map.entry("ranking.th.accuracy", "Precisión"),
                    Map.entry("ranking.th.correct", "Correctas"),
                    Map.entry("ranking.th.total", "Total de preguntas"),
                    Map.entry("ranking.th.totalSolved", "Total resueltas"),
                    Map.entry("ranking.th.avgRetry", "Promedio de reintentos"),
                    Map.entry("ranking.th.uniqueItems", "Preguntas únicas intentadas"),
                    Map.entry("ranking.th.totalAttempts", "Intentos totales"),

                    Map.entry("ranking.placeN", "{{n}}.º"),
                    Map.entry("ranking.unit.times", "veces"),

                    Map.entry("ranking.info.title", "Criterios del ranking"),
                    Map.entry("ranking.info.accuracy", "Se ordena por mayor precisión de respuestas (mínimo 5 preguntas resueltas)."),
                    Map.entry("ranking.info.challenge", "Se ordena por la mayor cantidad de preguntas resueltas."),
                    Map.entry("ranking.info.persistence", "Se ordena por el promedio más alto de reintentos en la misma pregunta."),

                    // Genre
                    Map.entry("genre.title", "Seleccionar género"),
                    Map.entry("genre.name.daily", "Conversación diaria"),
                    Map.entry("genre.name.society", "Sociedad moderna"),
                    Map.entry("genre.name.media", "Medios"),
                    Map.entry("genre.name.kpop", "K-POP"),
                    Map.entry("genre.name.tradition", "Tradición"),
                    Map.entry("genre.name.digital", "Digital"),
                    Map.entry("genre.name.dialect", "Dialectos"),

                    // Test
                    Map.entry("beforeStudy.title", "Aprendamos coreano"),
                    Map.entry("beforeStudy.start", "Iniciar estudio"),
                    Map.entry("test.title", "Preguntas de examen"),
                    Map.entry("test.empty", "No hay preguntas."),
                    Map.entry("test.options.loadError", "No se pudieron cargar las opciones."),
                    Map.entry("test.subjective.placeholder", "Introduce tu respuesta"),
                    Map.entry("test.submit", "Enviar"),
                    Map.entry("test.feedback.correct", "✅ ¡Correcto!"),
                    Map.entry("test.feedback.wrong", "❌ ¡Incorrecto!"),
                    Map.entry("test.score.unit", "pts"),
                    Map.entry("test.next", "Siguiente pregunta"),
                    Map.entry("test.result.view", "Ver resultados"),

                    Map.entry("testList.title", "Seleccionar prueba"),
                    Map.entry("testList.fallbackTitle", "Prueba #{{num}}"),
                    Map.entry("testList.go", "Ir"),

                    Map.entry("signup.title", "Registrarse"),
                    Map.entry("signup.button", "Registrar"),
                    Map.entry("account.check", "Verificar"),
                    Map.entry("account.password", "Contraseña"),
                    Map.entry("account.passwordPlaceholder", "Introduce tu contraseña."),
                    Map.entry("account.nickname", "Apodo"),
                    Map.entry("account.nicknamePlaceholder", "Introduce tu apodo."),

                    Map.entry("successList.title", "Lista de temas completados"),
                    Map.entry("successList.fallbackTitle", "Tema #{{num}}"),
                    Map.entry("successList.go", "Ir"),
                    Map.entry("successList.empty", "Aún no hay temas completados."),

                    Map.entry("login.title", "Página de inicio de sesión"),
                    Map.entry("login.button", "Iniciar sesión"),
                    Map.entry("login.find", "Recuperar correo/contraseña"),

                    Map.entry("mypage.mySuccessedStudy", "Temas completados"),

                    // SignUpPage.jsx
                    Map.entry("signup.signup" , "Registrarse"),
                    Map.entry("signup.inputName" , "Por favor ingrese su nombre." ),
                    Map.entry("signup.inputEmail" , "Por favor ingrese su correo electrónico." ),
                    Map.entry("signup.duplCheck" , "Verificar Duplicado"),
                    Map.entry("signup.inputPassword" , "Por favor ingrese su contraseña."),
                    Map.entry("signup.inputNick" , "Por favor ingrese su apodo."),
                    Map.entry("signup.inputPhone" , "Por favor ingrese su contacto."),

                    // Ranking.jsx
                    Map.entry("ranking.accyracyKing" , "Rey de Precisión (Por tasa de aciertos)"),
                    Map.entry("ranking.challengeKing" , "Rey de Desafíos (Por problemas resueltos)"),
                    Map.entry("ranking.persistenceKing" , "Rey de Persistencia (Por reintentos)"),
                    Map.entry("ranking.ranking" , "Clasificación"),

                    // LoadingPage.jsx
                    Map.entry("loading.sungrye" , "Sungnyemun"),
                    Map.entry("loading.bookchon" , "Bukchon"),
                    Map.entry("loading.guckjungback" , "Museo Nacional de Corea"),
                    Map.entry("loading.muryung" , "Tumba del Rey Muryeong"),
                    Map.entry("loading.gwanghan" , "Jardín Gwanghallu"),
                    Map.entry("loading.hanra" , "Monte Halla"),
                    Map.entry("loading.sungryeInfo" , "Sungnyemun es una de las cuatro puertas principales de Seúl (Hanyang), la capital de Joseon, y comúnmente se le llama Namdaemun (Puerta Sur)."),
                    Map.entry("loading.bookchonInfo" ,  "Bukchon es un pueblo hanok ubicado al norte de Seúl, y fue llamado pueblo yangban debido a las numerosas casas de lujo donde vivían la realeza, yangban y funcionarios durante la dinastía Joseon."),
                    Map.entry("loading.guckjungbackInfo" , "El Museo Nacional de Corea es un espacio conmovedor donde la historia y la cultura cobran vida, y el pasado, presente y futuro coexisten."),
                    Map.entry("loading.muryungInfo" , "La Tumba del Rey Muryeong, ubicada en Gongju, es el lugar de entierro del Rey Muryeong de Baekje y su reina. Es una tumba de ladrillo con una estructura arqueada distintiva."),
                    Map.entry("loading.gwanghanInfo" , "El Jardín Gwanghallu en Namwon, Jeollabuk-do, tiene el Puente Ojakgyo que guarda la triste historia de Gyeonu y Jingnyeo."),
                    Map.entry("loading.hanraInfo", "En la cumbre del Monte Halla, ubicado en el centro de la isla de Jeju y el pico más alto de Corea del Sur, se encuentra Baengnokdam, un lago volcánico. Fue llamado una de las tres montañas sagradas junto con Geumgangsan y Jirisan."),
                    Map.entry("loading.grading", "Todoli está calificando el examen..."),

                    // Page404.jsx
                    Map.entry("page404.toLogin" , "Ir a Inicio de Sesión"),

                    // MyInfoUpdate.jsx
                    Map.entry("myInfoUpdate.updateUserInfo" , "Actualizar Información de Usuario"),
                    Map.entry("myInfoUpdate.duplCheck" , "Verificar Duplicado"),
                    Map.entry("myInfoUpdate.update" , "Actualizar"),
                    Map.entry("myInfoUpdate.updatePassword" , "Cambiar Contraseña"),
                    Map.entry("myInfoUpdate.oldPassword" , "Contraseña Actual"),
                    Map.entry("myInfoUpdate.newPassword" , "Nueva Contraseña"),
                    Map.entry("myInfoUpdate.checkNewPassword" , "Confirmar Nueva Contraseña"),
                    Map.entry("myInfoUpdate.deleteUser" , "Eliminar Cuenta"),
                    Map.entry("myInfoUpdate.delete" , "Eliminar"),

                    // Study.jsx
                    Map.entry("study.korAudio" , "Audio en Coreano"),
                    Map.entry("study.engAudio" , "Audio en Inglés"),
                    Map.entry("study.prev" , "Anterior"),
                    Map.entry("study.next" , "Siguiente"),
                    Map.entry("study.eduEnd" , "Finalizar Estudio"),

                    // Footer.jsx
                    Map.entry("footer.home" , "Inicio"),
                    Map.entry("footer.myPage" , "Mi Información"),
                    Map.entry("footer.study" , "Estudio"),
                    Map.entry("footer.test" , "Examen"),
                    Map.entry("footer.ranking" , "Clasificación"),

                    // TestResult.jsx
                    Map.entry("test.result.loadError", "No se puede cargar la puntuación."),
                    Map.entry("test.result.title", "Resultado del Examen"),
                    Map.entry("test.result.return", "Volver a la Prueba"),
                    Map.entry("test.result.score", "Correcto"),
                    Map.entry("test.result.total", "Total"),
                    Map.entry("test.result.perfect", "¡Perfecto!"),
                    Map.entry("test.result.pass", "¡Aprobado!"),
                    Map.entry("test.result.fail", "Reprobado")
            )
    );

    public Map<String, String> getTranslations(String lng) {
        return MEMORY.getOrDefault(lng, MEMORY.get("en"));
    }
}
