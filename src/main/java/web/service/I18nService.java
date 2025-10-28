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

                    Map.entry("mypage.mySuccessedStudy", "완수한 주제 목록")
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

                    Map.entry("mypage.mySuccessedStudy", "達成したテーマ一覧")
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

                    Map.entry("mypage.mySuccessedStudy", "已完成的主题列表")
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

                    Map.entry("mypage.mySuccessedStudy", "Completed Topics")
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

                    Map.entry("mypage.mySuccessedStudy", "Temas completados")
            )
    );

    public Map<String, String> getTranslations(String lng) {
        return MEMORY.getOrDefault(lng, MEMORY.get("en"));
    }
}
