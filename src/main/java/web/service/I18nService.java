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
                    Map.entry("ranking.title", "🏅 한국어 학습 랭킹"),
                    Map.entry("ranking.tab.accuracy", "정답왕"),
                    Map.entry("ranking.tab.challenge", "도전왕"),
                    Map.entry("ranking.tab.persistence", "끈기왕"),
                    Map.entry("common.loading", "로딩 중..."),
                    Map.entry("ranking.error.load", "랭킹을 불러오는 중 오류가 발생했습니다."),
                    Map.entry("ranking.empty", "아직 랭킹 데이터가 없습니다."),
                    Map.entry("ranking.table.rank", "순위"),
                    Map.entry("ranking.table.nickname", "닉네임"),
                    Map.entry("ranking.table.accuracy", "정답률"),
                    Map.entry("ranking.table.score", "정답 수"),
                    Map.entry("ranking.table.total", "총 문제 수"),
                    Map.entry("ranking.table.challengeTotal", "총 풀이 수"),
                    Map.entry("ranking.table.avgRound", "평균 재도전"),
                    Map.entry("ranking.table.uniqueItems", "시도한 문항 수"),
                    Map.entry("ranking.table.totalAttempts", "총 시도 수"),
                    Map.entry("ranking.info.title", "📊 랭킹 기준 설명"),
                    Map.entry("ranking.info.accuracy", "정답률이 높은 순서로 순위를 매깁니다. (최소 5문제 이상 풀이 필요)"),
                    Map.entry("ranking.info.challenge", "가장 많은 문제를 푼 사용자 순서로 순위를 매깁니다."),
                    Map.entry("ranking.info.persistence", "같은 문제를 여러 번 재도전한 평균 횟수가 높은 순서로 순위를 매깁니다.")



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
                    Map.entry("ranking.title", "🏅 韓国語学習ランキング"),
                    Map.entry("ranking.tab.accuracy", "正答王"),
                    Map.entry("ranking.tab.challenge", "挑戦王"),
                    Map.entry("ranking.tab.persistence", "根気王"),
                    Map.entry("common.loading", "読み込み中..."),
                    Map.entry("ranking.error.load", "ランキングの取得中にエラーが発生しました。"),
                    Map.entry("ranking.empty", "まだランキングデータがありません。"),
                    Map.entry("ranking.table.rank", "順位"),
                    Map.entry("ranking.table.nickname", "ニックネーム"),
                    Map.entry("ranking.table.accuracy", "正答率"),
                    Map.entry("ranking.table.score", "正解数"),
                    Map.entry("ranking.table.total", "総問題数"),
                    Map.entry("ranking.table.challengeTotal", "総解答数"),
                    Map.entry("ranking.table.avgRound", "平均再挑戦"),
                    Map.entry("ranking.table.uniqueItems", "試行した設問数"),
                    Map.entry("ranking.table.totalAttempts", "総試行回数"),
                    Map.entry("ranking.info.title", "📊 ランキング基準の説明"),
                    Map.entry("ranking.info.accuracy", "正答率が高い順に順位を付けます。（少なくとも5問以上の解答が必要）"),
                    Map.entry("ranking.info.challenge", "最も多くの問題を解いたユーザー順に順位を付けます。"),
                    Map.entry("ranking.info.persistence", "同じ設問への平均再挑戦回数が高い順に順位を付けます。")


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
                    Map.entry("ranking.title", "🏅 韩语学习排行榜"),
                    Map.entry("ranking.tab.accuracy", "正答王"),
                    Map.entry("ranking.tab.challenge", "挑战王"),
                    Map.entry("ranking.tab.persistence", "坚持王"),
                    Map.entry("common.loading", "加载中..."),
                    Map.entry("ranking.error.load", "加载排行榜时发生错误。"),
                    Map.entry("ranking.empty", "还没有排行榜数据。"),
                    Map.entry("ranking.table.rank", "排名"),
                    Map.entry("ranking.table.nickname", "昵称"),
                    Map.entry("ranking.table.accuracy", "正确率"),
                    Map.entry("ranking.table.score", "正确数"),
                    Map.entry("ranking.table.total", "总题数"),
                    Map.entry("ranking.table.challengeTotal", "总解题数"),
                    Map.entry("ranking.table.avgRound", "平均重试"),
                    Map.entry("ranking.table.uniqueItems", "已尝试题目数"),
                    Map.entry("ranking.table.totalAttempts", "总尝试次数"),
                    Map.entry("ranking.info.title", "📊 排行规则说明"),
                    Map.entry("ranking.info.accuracy", "按正确率从高到低排名。（至少答 5 题）"),
                    Map.entry("ranking.info.challenge", "按解题数量从多到少排名。"),
                    Map.entry("ranking.info.persistence", "按同一题目的平均重试次数从高到低排名。")


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
                    Map.entry("ranking.title", "🏅 Korean Learning Rankings"),
                    Map.entry("ranking.tab.accuracy", "Accuracy"),
                    Map.entry("ranking.tab.challenge", "Challenges"),
                    Map.entry("ranking.tab.persistence", "Persistence"),
                    Map.entry("common.loading", "Loading..."),
                    Map.entry("ranking.error.load", "An error occurred while loading the rankings."),
                    Map.entry("ranking.empty", "No ranking data yet."),
                    Map.entry("ranking.table.rank", "Rank"),
                    Map.entry("ranking.table.nickname", "Nickname"),
                    Map.entry("ranking.table.accuracy", "Accuracy"),
                    Map.entry("ranking.table.score", "Correct"),
                    Map.entry("ranking.table.total", "Total"),
                    Map.entry("ranking.table.challengeTotal", "Total Solved"),
                    Map.entry("ranking.table.avgRound", "Avg. Retries"),
                    Map.entry("ranking.table.uniqueItems", "Items Tried"),
                    Map.entry("ranking.table.totalAttempts", "Total Attempts"),
                    Map.entry("ranking.info.title", "📊 Ranking Criteria"),
                    Map.entry("ranking.info.accuracy", "Ranked by highest accuracy. (Requires solving at least 5 questions)"),
                    Map.entry("ranking.info.challenge", "Ranked by the number of questions solved."),
                    Map.entry("ranking.info.persistence", "Ranked by higher average retries on the same item.")


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
                    Map.entry("ranking.title", "🏅 Ranking de aprendizaje de coreano"),
                    Map.entry("ranking.tab.accuracy", "Precisión"),
                    Map.entry("ranking.tab.challenge", "Desafíos"),
                    Map.entry("ranking.tab.persistence", "Perseverancia"),
                    Map.entry("common.loading", "Cargando..."),
                    Map.entry("ranking.error.load", "Ocurrió un error al cargar el ranking."),
                    Map.entry("ranking.empty", "Aún no hay datos de ranking."),
                    Map.entry("ranking.table.rank", "Puesto"),
                    Map.entry("ranking.table.nickname", "Apodo"),
                    Map.entry("ranking.table.accuracy", "Precisión"),
                    Map.entry("ranking.table.score", "Aciertos"),
                    Map.entry("ranking.table.total", "Total de preguntas"),
                    Map.entry("ranking.table.challengeTotal", "Total resueltas"),
                    Map.entry("ranking.table.avgRound", "Reintentos promedio"),
                    Map.entry("ranking.table.uniqueItems", "Ítems intentados"),
                    Map.entry("ranking.table.totalAttempts", "Intentos totales"),
                    Map.entry("ranking.info.title", "📊 Criterios del ranking"),
                    Map.entry("ranking.info.accuracy", "Se ordena por mayor precisión. (Se requieren al menos 5 preguntas)"),
                    Map.entry("ranking.info.challenge", "Se ordena por la mayor cantidad de preguntas resueltas."),
                    Map.entry("ranking.info.persistence", "Se ordena por mayor promedio de reintentos en la misma pregunta.")




                    )
    );

    // 단일 JSON 반환
    public Map<String, String> getTranslations(String lng) {
        return MEMORY.getOrDefault(lng, MEMORY.get("en"));
    }

    // 네임스페이스 사용 시 동일 Map에서 반환(현재는 단일 JSON로 대응)
//    public Map<String, String> getTranslationsByNamespace(String lng, String ns) {
//        return getTranslations(lng);
//    }
}