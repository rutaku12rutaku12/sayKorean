
-- USE sayKorean;

-- =====================
-- 1. GENRE 데이터
-- =====================
INSERT INTO genre (genreName)
VALUES
('일상회화'),
('현대사회'),
('KPOP'),
('전통'),
('디지털');

INSERT IGNORE INTO users
  (name, email, password, nickName, phone, signupMethod, userState)
VALUES
('홍길동', 'user01@example.com', '$2a$10$WyIedMbtbmj1g3pcIow2P.3eUMXuvlO369jRsgMFjhX/1xFvY82lK', '토돌이', '+8201012340001', 1, 1),
('김영희', 'user02@example.com', '$2a$10$Xab1Pwsg5HX7HU9QZUWCd.YP0l1JcBXtlpXoJJ7V3wbIuylZGzqKe', '영희', '+8201012340002', 2, 1),
('John Smith', 'user03@example.com', '$2a$10$KNCxUz6FFOh3ne6GqAKhxOgOkcqB1B79cgilLNUzNcDFiCCuP/F2O', 'john', '+8201012340003', 3, 1),
('田中太郎', 'user04@example.com', '$2a$10$7LIFBITvEwwKwIAl3wk8QuEJtxnBDaP6sykiKuZm49EKww9BmxPNe', 'たなか', '+8201012340004', 1, 1),
('王伟', 'user05@example.com', '$2a$10$jY5QH2vgy1lXFGSBiM9lMuqziraitPxDcpM4QRBFCdPvaRZIkH1kO', 'wang', '+8201012340005', 4, 1),
('María López', 'user06@example.com', '$2a$10$hqYj85STxJsjCzNuBYAR3ecB7iDmKa8gH0KJwtxydDp3pJXRntQ3e', 'maria', '+8201012340006', 2, 1),
('Alice Kim', 'user07@example.com', '$2a$10$s/VtYMXC9H/SyUxnGsPbw.lTyYzRyamcTKNL2PbHXXH2F3FzdB1Ta', 'alice', '+8201012340007', 3, 1),
('이수민', 'user08@example.com', '$2a$10$bCw43vqoAyq7I0McrFQAlOlAgNCUokmDPOzDBbcJwmkS8dVKMfkcq', '수민', '+8201012340008', 1, 1),
('박준호', 'user09@example.com', '$2a$10$cNS3RMa1ZNg3IPi.9YIrxeacfPLM1RcaVQ4oV173pWuaeJly7GeyS', '준호', '+8201012340009', 2, 1),
('김민지', 'user10@example.com', '$2a$10$3xup3IgM2CLvQ6Kkb3xz3u.U7roLlBgBP/NUkmbPI59qxTxH/0HI.', '민지', '+8201012340010', 3, 1),

('Sara Park', 'user11@example.com', '$2a$10$GFLe//HCLD2KabnISFqjseT076jvPGQqLlIhmjP3ja0WG3dhl.JD.', 'sara', '+8201012340011', 4, 1),
('佐藤花子', 'user12@example.com', '$2a$10$LVSHX/wdQoiafl9OCkcWP.DN.wbLsByDBQkUL4HdzJ4eQjLjoqB0G', 'はなこ', '+8201012340012', 1, 1),
('Li Wei', 'user13@example.com', '$2a$10$y2aV.ndokJsuAKAl6pOt9.xQM9Pqh.TZm.X3CrFA6HdHK8DjmvFcS', 'liwei', '+8201012340013', 2, 1),
('Carlos Ruiz', 'user14@example.com', '$2a$10$EYjMg7Lzfz0JyOXG3NL6uOe9GYb5JWaPfrlppRRnLL4sSNYFBqKz6', 'carlos', '+8201012340014', 3, 1),
('최유진', 'user15@example.com', '$2a$10$At9EO7NgGs9i5nMXGmv.1Ooq0Psi6HXtit/fo9Y76oASD1ql12vVq', '유진', '+8201012340015', 1, 1),
('정하늘', 'user16@example.com', '$2a$10$../gNFU/H5Z.kVBhn5yIZuRSTKRLHEV6IkdBxlBbrEi49tNLKJTcG', '하늘', '+8201012340016', 2, 1),
('김도윤', 'user17@example.com', '$2a$10$JfQMBg/tWjAvrOtIwEK4HusVHwTznCOXSal.oRT2Z236ZD5SwQuee', '도윤', '+8201012340017', 3, 1),
('Olivia Lee', 'user18@example.com', '$2a$10$UkmCNyhX0nJ8zxY6MBKpL.4AMfGday7tjaLjJvJ8vf8omyX2W6d0u', 'olivia', '+8201012340018', 4, 1),
('Daniel Choi', 'user19@example.com', '$2a$10$xCnfm.J/3rhvli6dDFcEb.9iz9D3FZ4Bz5QW7xao.JkWED7Zj2xu', 'daniel', '+8201012340019', 1, 1),
('박서연', 'user20@example.com', '$2a$10$JSNaUDP2AbEoRZnS6VrDjui.yncliYvvXPv6iKiGdMEibtZtn5yve', '서연', '+8201012340020', 2, 1),

('김하준', 'user21@example.com', '$2a$10$bpqxLX.kRZJivJr2tXojMO.nxSWaLJxn8ZNkQPQeIeCLKGcAP96yS', '하준', '+8201012340021', 3, 1),
('이아린', 'user22@example.com', '$2a$10$oAC0FOUw.D7mDi96m4Rkd.WhQa7s9XF20anRQUTIUO9RWK2DMWwMe', '아린', '+8201012340022', 4, 1),
('Noah Kim', 'user23@example.com', '$2a$10$DGlXpqSbcYSzo/ohLe3n3OToA/eTvUi3ACKnuVe0dxVL/MqgHZysW', 'noah', '+8201012340023', 1, 1),
('Emma Park', 'user24@example.com', '$2a$10$GeNPK0GIFFKmP3GKGsIWbu36d3U5EdJ1LrhFSI89XZLSi3PDxcBWG', 'emma', '+8201012340024', 2, 1),
('Sophia Cho', 'user25@example.com', '$2a$10$wHEZTfgPhgrRycXtheCoCeTnZQ5Uijw7aZyw.GtVjnw0JGAn8LkaC', 'sophia', '+8201012340025', 3, 1),
('Mason Han', 'user26@example.com', '$2a$10$lYxTtzja8AR5TpL4SMtC9./OvMseYJjZTsEt9ZzbnSpk/yj0OPCnm', 'mason', '+8201012340026', 4, 1),
('김지후', 'user27@example.com', '$2a$10$fXWQcPxDWvx5Ro871YXcFu3UaeNx5Qu3IuXw.vZbt58B1hSPRw.iu', '지후', '+8201012340027', 1, 1),
('이서윤', 'user28@example.com', '$2a$10$jh1nHIZTQ43LKXZVnXhSOuKJZYcU1x3j5KBq3ew6nUyuL.geiV.Uy', '서윤', '+8201012340028', 2, 1),
('박민서', 'user29@example.com', '$2a$10$wqtvN/lodMCdWksFRQklruhNA2bziX3grLbqLWjhVpC/t6YtEqwjO', '민서', '+8201012340029', 3, 1),
('한예린', 'user30@example.com', '$2a$10$OGD6ydGTbijjh4NRdl3HQO56kweGTqjR2DvIR9lK1QRY.JBfa7P1C', '예린', '+8201012340030', 4, 1);


-- =====================
-- 2. STUDY 데이터
-- =====================
INSERT INTO study (themeKo, themeJp, themeCn, themeEn, themeEs, commenKo, commenJp, commenCn, commenEn, commenEs, genreNo)
VALUES
('상대방의 안부를 묻는 말', '相手の安否を尋ねる言葉', '询问对方健康状况的短语', 'A phrase to ask about the other person\'s well-being', 'Una frase para preguntar por el bienestar de la otra persona',
'지금 바쁘니?란 말은 나를 도와줄 수 있느냐는 뜻이 되기도 한답니다.', '今忙しいのですか？', '“你现在忙吗？”也可以表示“你能帮我吗？”', '"Are you busy now?" can also mean "Can you help me?"', '"¿Estás ocupado ahora?" también puede significar "¿Puedes ayudarme?"', 1),

('회사에서 쓸 수 있는 말', '会社で使える言葉', '工作时可以使用的短语', 'Phrases you can use at work', 'Frases que puedes usar en el trabajo',
'취업난을 이기고 취직하셨나요? 축하드립니다. 이제부터 동료와 선배들의 호감을 살 수 있는 언어를 배워봅시다.',
'就職難に勝って就職しましたか？おめでとうございます。これから同僚と先輩たちの好感を生かせる言語を学びましょう。',
'你成功渡过就业危机，找到工作了吗？恭喜你！现在，就让我们一起学习如何使用能赢得同事和上司青睐的语言吧。',
'Have you overcome the employment crisis and landed a job? Congratulations! Now, let\'s learn how to use language that will earn you the favor of your colleagues and seniors.',
'¿Has superado la crisis laboral y has conseguido trabajo? ¡Enhorabuena! Ahora, aprendamos a usar un lenguaje que te permita ganarte la aprobación de tus compañeros y superiores.', 2),

('콘서트장에서', 'コンサート場で', '在音乐厅', 'At the concert hall', 'En la sala de conciertos',
'콘서트는 티케팅이 정말 중요합니다. 기둥 뒤에서 좋아하는 가수를 보고 싶지 않다면 말이죠.',
'コンサートはチケットが本当に重要です。柱の後ろで好きな歌手を見たくないならばね。',
'对于音乐会来说，购票至关重要，特别是当你不想看到你最喜欢的歌手站在柱子后面的时候。',
'Ticketing is crucial for concerts, especially if you don\'t want to see your favorite singer from behind a pillar.',
'La venta de entradas es crucial para los conciertos, especialmente si no quieres ver a tu cantante favorito detrás de una pilar.', 3),

('새해 명절', '明けましておめでとう', '新年假期', 'New Year\'s holidays', 'vacaciones de año nuevo',
'전통 문화는 바쁜 현대 사회 한국인들이 친척을 만날 수 있는 좋은 구실이 되어줍니다.',
'伝統文化は、忙しい現代社会の韓国人が親戚に会える良い口実になってくれます。',
'传统文化为忙碌的现代韩国人提供了与亲人相聚的绝佳借口。',
'Traditional culture provides a great excuse for busy modern Koreans to meet their relatives.',
'La cultura tradicional proporciona una gran excusa para que los coreanos modernos y ocupados se reúnan con sus familiares.', 4),

('친구와 대화할 때', '友達と話すとき', '和朋友聊天时', 'When talking with a friend', 'Cuando hablas con un amigo',
'좋은 한국인 친구를 사귈 수 있다면, 한국 문화를 더 깊이 이해할 수 있습니다.', '良い韓国人の友達を作ることができれば、韓国文化をより深く理解することができます。', '如果你能结交到好的韩国朋友,你就能更深入地了解韩国文化。', 'If you can make good Korean friends, you can understand Korean culture more deeply.', 'Si logras hacer buenos amigos coreanos, podrás comprender la cultura coreana más profundamente.', 1),

('데이트할 때 쓸 수 있는 말들', 'デート時に使える言葉', '约会时可以使用的短语', 'Phrases to use on a date', 'Frases para usar en una cita',
'친구나 연인과의 데이트 중에 쓸 법한 말들입니다.', '友人や恋人とのデート中に書くような言葉です。', '这些是你在和朋友或恋人约会时可能会用到的短语。', 'These are phrases you might use on a date with a friend or lover.', 'Estas son frases que podrías usar en una cita con un amigo o tu pareja.', 1),

('위치나 장소를 묻는 질문', '場所や場所を尋ねる質問', '询问有关地点或场所的问题', 'Questions asking about location or place', 'Preguntas sobre la ubicación o el lugar',
'포교를 남발하는 사이비 종교인들 때문에, 길을 물을 때는 용건 먼저 이야기해야 합니다!', '布教を乱発するサイビー宗教人たちのため、道を尋ねるときは、用件先に話す必要があります！', '由于一些伪宗教人士过度热衷于传教,所以问路时一定要先说明你的目的！', 'Because of the pseudo-religious people who overuse their proselytization, you should always state your purpose first when asking for directions!', 'Debido a la presencia de personas pseudorreligiosas que abusan de su proselitismo, ¡siempre debes indicar primero tu propósito al pedir indicaciones!', 1),

('시장에 갔을 때 할 수 있는 말들', '市場に行ったときにできること', '去市场时可以说的话', 'Things to say when you go to the market', 'Cosas que decir cuando vas al mercado',
'전통시장부터 대형마트, 백화점까지. 한국의 시장에서는 고유한 문화를 엿볼 수 있습니다.', '伝統市場から大型マート、デパートまで。韓国の市場ではユニークな文化を垣間見ることができます。', '从传统市场到大型超市和百货商店,韩国的市场展现了其独特的文化。', 'From traditional markets to large supermarkets and department stores, Korea\'s markets offer a glimpse into its unique culture.', 'Desde los mercados tradicionales hasta los grandes supermercados y grandes almacenes, los mercados de Corea ofrecen una visión de su cultura única.', 1),

('일정을 제안하는 말들', 'スケジュールを提案する言葉', '暗示日程安排的词语', 'Words suggesting schedules', 'Palabras que sugieren horarios',
'한국어의 동사에 관해 알아봅시다.', '韓国語の動詞について学びましょう。', '我们来学习韩语动词吧。', 'Let\'s learn about Korean verbs.', 'Aprendamos sobre los verbos coreanos.', 1),

('내 상태를 표현하는 문장들', '私の状態を表現する文章', '表达我病情的句子', 'Sentences that express my condition', 'Frases que expresan mi condición',
'한국어로 자기 자신에 관한 표현을 명확히 할 수 있다면, 한국어 실력이 뛰어나다고 할 수 있습니다.', '韓国語で自分自身に関する表現を明確にできれば、韓国語の実力に優れていると言えます。', '如果你能用韩语清晰地表达自己,就可以说你的韩语水平非常优秀。', 'If you can clearly express yourself in Korean, you can say that your Korean language skills are excellent.', 'Si puedes expresarte con claridad en coreano, puedes decir que tus habilidades en el idioma coreano son excelentes.', 1);





-- =====================
-- 3. EXAM 데이터
-- =====================
INSERT INTO exam (examKo, examRoman, examJp, examCn, examEn, examEs, imageName, imagePath, studyNo)
VALUES
('지금 바쁘세요?', 'Jigeum Bappeuseyo?', '今忙しいですか？', '你现在忙吗？', 'Are you busy now?', '¿Estás ocupado ahora?', '3_img.png', '/upload/image/oct_25/1_img.png', 1),
('언제 볼까요?', 'Eonje Bolkkayo?', 'いつ見ますか？', '我们什么时候能见面？', 'When will we see each other?', '¿Cuando nos veremos?', '2_img.png', '/upload/image/oct_25/2_img.png', 1),
('배고프시죠?', 'Neodo Baegopa Jukgetji?', 'お腹がすいた？', '你饿了吗？', 'Are you hungry?', '¿Tienes hambre?', '1_img.png', '/upload/image/oct_25/3_img.png', 1),
('보고서 제출하셨어요?', 'Bogoseo Jechulhasyeosseoyo?', 'レポートを提出しましたか？', '你提交了报告吗？', 'Did you submit the report?', '¿Enviaste el informe?', '18_img.png', '/upload/image/oct_25/4_img.png', 2),
('출장 가려면 어디에서 모이면 되나요?', 'Chuljang Garyeomyeon Eodieseo Moimyeon Doenayo?', '出張に行くにはどこで集まりますか？', '我应该在哪里会面进行商务旅行？', 'Where should I meet up for a business trip?', '¿Dónde debería reunirme para un viaje de negocios?', '6_img.png', '/upload/image/oct_25/5_img.png', 2),
('출퇴근 하는 게 쉽지 않네요.', 'Chultoegeun Haneun Ge Swipji Anneyo.', '出退勤するのは簡単ではありませんね。', '上下班并不容易。', 'Commuting to and from work isn\'t easy.', 'Viajar hacia y desde el trabajo no es fácil.', '22_img.png', '/upload/image/oct_25/6_img.png', 2),
('목소리가 너무 좋아', 'Moksoriga Neomu Joa', '声が大好き', '你的声音真好听', 'Your voice is so good', 'Tu voz es tan buena', '41_img.png', '/upload/image/oct_25/7_img.png', 3),
('응원법 알고 있지?', 'Eung-wonbeop Algo Itji?', '応援法を知っていますか？', '你知道如何欢呼吧？', 'You know how to cheer, right?', 'Sabes cómo animar, ¿verdad?', '45_img.png', '/upload/image/oct_25/8_img.png', 3),
('우리 좌석은 어디에 있을까?', 'Uri Jwaseogeun Eodie Isseulkka?', '私たちの座席はどこにありますか？', '我们的座位在哪里？', 'Where will our seats be?', '¿Donde estarán nuestros asientos?', '6_img.png', '/upload/image/oct_25/9_img.png', 3),
('새해 복 많이 받으세요', 'Saehae Bok Mani Badeuseyo', '明けましておめでとうございます', '新年快乐', 'Happy New Year', 'Feliz año nuevo', '48_img.png', '/upload/image/oct_25/10_img.png', 4),
('절 올리겠습니다.', 'Jeol Olligetseumnida.', 'お願いします。', '我会跪拜。', 'I will bow down.', 'Me inclinaré.', '49_img.png', '/upload/image/oct_25/11_img.png', 4),
('떡국 맛있겠다.', 'Tteokguk Masitgetda.', 'お餅おいしい。', '年糕汤看起来很美味。', 'Tteokguk looks delicious.', 'El tteokguk se ve delicioso.', '46_img.png', '/upload/image/oct_25/12_img.png', 4),
-- studyNo 5: 친구와 대화할 때
('같이 놀자', 'Gachi Nolja', '一緒に遊ぼう', '我们一起玩吧', 'Let\'s play together', 'Juguemos juntos', 'play.webp', '/upload/image/oct_25/13_img.webp', 5),
('하하! 진짜 재미있다!', 'Haha! Jinjja Jaemiitda!', 'ハハ！本当に楽しいです！', '哈哈！这真的太搞笑了！', 'Haha! This is really funny!', '¡Jaja! ¡Esto es muy gracioso!', 'smile.png', '/upload/image/oct_25/14_img.png', 5),
('안녕! 만나서 반가워!', 'Annyeong! Mannaseo Ban-gawo!', 'こんにちは！お会いできて嬉しいです！', '你好很高兴见到你！', 'Hello! Nice to meet you!', '¡Hola! ¡Un placer conocerte!', 'sayHello.png', '/upload/image/oct_25/15_img.png', 5),

-- studyNo 6: 데이트할 때 쓸 수 있는 말들
('사진 찍어줄 게 포즈 취해봐', 'Sajin Jjigeojul Ge Pojeu Chwihaebwa', '写真を撮るのがポーズを取る', '摆个姿势，我给你拍张照片。', 'Strike a pose, I\'ll take a picture for you.', '¡Posad, os saco una foto!', 'photo.webp', '/upload/image/oct_25/16_img.webp', 6),
('이 영화 재밌겠지?', 'I Yeonghwa Jaemitgetji?', 'この映画は楽しいですか？', '这部电影应该会很有趣，对吧？', 'This movie will be fun, right?', 'Esta película será divertida, ¿verdad?', 'movie-removebg-preview.png', '/upload/image/oct_25/17_img.png', 6),
('뭐가 맛있을까? 메뉴 골라줘.', 'Mwoga Masisseulkka? Menyu Gollajwo.', '何がおいしいですか？メニューを選んでください。', '什么好吃？请选择菜单。', 'What would be delicious? Choose a menu.', '¿Qué te apetecería delicioso? Elige un menú.', 'menu-removebg-preview.png', '/upload/image/oct_25/18_img.png', 6),

-- studyNo 7: 위치나 장소를 물어볼 때 쓰는 말들
('여기로 가면 되나요?', 'Yeogiro Gamyeon Doenayo?', 'ここに行けばいいですか？', '我可以去这里吗？', 'Can I go here?', '¿Puedo ir aquí?', 'thisWay.webp', '/upload/image/oct_25/19_img.webp', 7),
('지하철 역이 어디에요?', 'Jihacheol Yeogi Eodieyo?', '地下鉄駅はどこですか？', '地铁站在哪里？', 'Where is the subway station?', '¿Dónde está la estación de metro?', 'subway.webp', '/upload/image/oct_25/20_img.webp', 7),
('화장실 어디에요?', 'Hwajangsil Eodieyo?', 'トイレはどこですか？', '厕所在哪里？', 'Where is the bathroom?', '¿Dónde está el baño?', 'toilet.png', '/upload/image/oct_25/21_img.png', 7),

-- studyNo 8: 시장에 갔을 때 쓸 만한 문장들
('사과 맛있겠네요. 한 소쿠리 주세요.', 'Sagwa Masitgenneyo. Han Sokuri Juseyo.', 'りんごおいしいですね。一粒をください。', '苹果看起来真好吃。我可以要一篮吗？', 'Apples look delicious. Can I have a basket?', 'Las manzanas tienen una pinta deliciosa. ¿Me das una cesta?', 'market.png', '/upload/image/oct_25/22_img.png', 8),
('진짜 많이 샀다.', 'Jinjja Mani Satda.', '本当にたくさん買った。', '我真的买了很多东西。', 'I really bought a lot.', 'Compré muchísimas cosas.', 'shoping.png', '/upload/image/oct_25/23_img.png', 8),
('시장에서 눈탱이 맞았어.', 'Sijang-eseo Nuntaeng-i Majasseo.', '市場で目玉が当たった。', '我在集市上被雪球砸中了。', 'I got hit by a snowball at the market.', 'Me golpeó una bola de nieve en el mercado.', 'crying.png', '/upload/image/oct_25/24_img.png', 8),

-- studyNo 9: 일정을 제안할 때 쓰는 문장들
('같이 달릴까?', 'Gachi Dallilkka?', '一緒に走るか？', '我们一起跑好吗？', 'Shall we run together?', '¿Corremos juntos?', 'run.png', '/upload/image/oct_25/25_img.png', 9),
('코인노래방 가서 노래 부르자.', 'Koinnoraebang Gaseo Norae Bureuja.', 'コインカラオケに行って歌いましょう。', '咱们去投币式卡拉OK唱歌吧。', 'Let\'s go to a coin karaoke and sing.', 'Vayamos a un karaoke de monedas y cantemos.', 'singing.png', '/upload/image/oct_25/26_img.png', 9),
('공부하러 도서관 가자.', 'Gongbuhareo Doseogwan Gaja.', '勉強に図書館に行きましょう。', '我们去图书馆学习吧。', 'Let\'s go to the library to study.', 'Vamos a la biblioteca a estudiar.', 'study.png', '/upload/image/oct_25/27_img.png', 9),

-- studyNo 10: 나의 상태나 상황을 표현하는 문장들
('졸립다. 한숨 자고 싶어.', 'Jollipda. Hansum Jago Sipeo.', '眠いです。ため息眠りたい。', '我困了，想睡个午觉。', 'I\'m sleepy. I want to take a nap.', 'Tengo sueño. Quiero echarme una siesta.', 'sleep.png', '/upload/image/oct_25/28_img.png', 10),
('기분이 이상한데?', 'Gibuni Isanghande?', '気分が変なのに？', '我感觉很奇怪？', 'I feel strange?', '¿Me siento extraño?', 'strange.png', '/upload/image/oct_25/29_img.png', 10),
('배고파. 맛있는 밥 먹고 싶다.', 'Baegopa. Masinneun Bap Meokgo Sipda.', '空腹。おいしいご飯食べたいです。', '我饿了，想吃点好吃的。', 'I\'m hungry. I want to eat something delicious.', 'Tengo hambre. Quiero comer algo delicioso.', 'eat.png', '/upload/image/oct_25/30_img.png', 10);






-- =====================
-- 4. AUDIO 데이터
-- =====================
INSERT INTO audio (audioName, audioPath, lang, examNo)
VALUES
('1_eng_voice.mp3', '/upload/audio/oct_25/1_eng_voice.mp3', 2, 1),
('1_kor_voice.mp3', '/upload/audio/oct_25/1_kor_voice.mp3', 1, 1),
('2_kor_voice.mp3', '/upload/audio/oct_25/2_kor_voice.mp3', 1, 2),
('2_eng_voice.mp3', '/upload/audio/oct_25/2_eng_voice.mp3', 2, 2),
('3_kor_voice.mp3', '/upload/audio/oct_25/3_kor_voice.mp3', 1, 3),
('3_eng_voice.mp3', '/upload/audio/oct_25/3_eng_voice.mp3', 2, 3),
('4_kor_voice.mp3', '/upload/audio/oct_25/4_kor_voice.mp3', 1, 4),
('4_eng_voice.mp3', '/upload/audio/oct_25/4_eng_voice.mp3', 2, 4),
('5_kor_voice.mp3', '/upload/audio/oct_25/5_kor_voice.mp3', 1, 5),
('5_eng_voice.mp3', '/upload/audio/oct_25/5_eng_voice.mp3', 2, 5),
('7_kor_voice.mp3', '/upload/audio/oct_25/7_kor_voice.mp3', 1, 7),
('7_eng_voice.mp3', '/upload/audio/oct_25/7_eng_voice.mp3', 2, 7),
('8_kor_voice.mp3', '/upload/audio/oct_25/8_kor_voice.mp3', 1, 8),
('9_kor_voice.mp3', '/upload/audio/oct_25/9_kor_voice.mp3', 1, 9),
('9_eng_voice.mp3', '/upload/audio/oct_25/9_eng_voice.mp3', 2, 9),
('10_kor_voice.mp3', '/upload/audio/oct_25/10_kor_voice.mp3', 1, 10),
('10_eng_voice.mp3', '/upload/audio/oct_25/10_eng_voice.mp3', 2, 10),
('11_kor_voice.mp3', '/upload/audio/oct_25/11_kor_voice.mp3', 1, 11),
('11_eng_voice.mp3', '/upload/audio/oct_25/11_eng_voice.mp3', 2, 11),
('12_kor_voice.mp3', '/upload/audio/oct_25/12_kor_voice.mp3', 1, 12),
('12_eng_voice.mp3', '/upload/audio/oct_25/12_eng_voice.mp3', 2, 12),
('13_kor_voice.mp3', '/upload/audio/oct_25/13_kor_voice.mp3', 1, 13),
('13_eng_voice.mp3', '/upload/audio/oct_25/13_eng_voice.mp3', 2, 13),
('14_kor_voice.mp3', '/upload/audio/oct_25/14_kor_voice.mp3', 1, 14),
('14_eng_voice.mp3', '/upload/audio/oct_25/14_eng_voice.mp3', 2, 14),
('15_kor_voice.mp3', '/upload/audio/oct_25/15_kor_voice.mp3', 1, 15),
('15_eng_voice.mp3', '/upload/audio/oct_25/15_eng_voice.mp3', 2, 15),
('16_kor_voice.mp3', '/upload/audio/oct_25/16_kor_voice.mp3', 1, 16),
('16_eng_voice.mp3', '/upload/audio/oct_25/16_eng_voice.mp3', 2, 16),
('17_kor_voice.mp3', '/upload/audio/oct_25/17_kor_voice.mp3', 1, 17),
('17_eng_voice.mp3', '/upload/audio/oct_25/17_eng_voice.mp3', 2, 17),
('18_kor_voice.mp3', '/upload/audio/oct_25/18_kor_voice.mp3', 1, 18),
('18_eng_voice.mp3', '/upload/audio/oct_25/18_eng_voice.mp3', 2, 18),
('19_kor_voice.mp3', '/upload/audio/oct_25/19_kor_voice.mp3', 1, 19),
('19_eng_voice.mp3', '/upload/audio/oct_25/19_eng_voice.mp3', 2, 19),
('20_kor_voice.mp3', '/upload/audio/oct_25/20_kor_voice.mp3', 1, 20),
('20_eng_voice.mp3', '/upload/audio/oct_25/20_eng_voice.mp3', 2, 20),
('21_kor_voice.mp3', '/upload/audio/oct_25/21_kor_voice.mp3', 1, 21),
('21_eng_voice.mp3', '/upload/audio/oct_25/21_eng_voice.mp3', 2, 21),
('22_kor_voice.mp3', '/upload/audio/oct_25/22_kor_voice.mp3', 1, 22),
('22_eng_voice.mp3', '/upload/audio/oct_25/22_eng_voice.mp3', 2, 22),
('23_kor_voice.mp3', '/upload/audio/oct_25/23_kor_voice.mp3', 1, 23),
('23_eng_voice.mp3', '/upload/audio/oct_25/23_eng_voice.mp3', 2, 23),
('24_kor_voice.mp3', '/upload/audio/oct_25/24_kor_voice.mp3', 1, 24),
('24_eng_voice.mp3', '/upload/audio/oct_25/24_eng_voice.mp3', 2, 24),
('25_kor_voice.mp3', '/upload/audio/oct_25/25_kor_voice.mp3', 1, 25),
('25_eng_voice.mp3', '/upload/audio/oct_25/25_eng_voice.mp3', 2, 25),
('26_kor_voice.mp3', '/upload/audio/oct_25/26_kor_voice.mp3', 1, 26),
('26_eng_voice.mp3', '/upload/audio/oct_25/26_eng_voice.mp3', 2, 26),
('27_kor_voice.mp3', '/upload/audio/oct_25/27_kor_voice.mp3', 1, 27),
('27_eng_voice.mp3', '/upload/audio/oct_25/27_eng_voice.mp3', 2, 27),
('28_kor_voice.mp3', '/upload/audio/oct_25/28_kor_voice.mp3', 1, 28),
('28_eng_voice.mp3', '/upload/audio/oct_25/28_eng_voice.mp3', 2, 28),
('29_kor_voice.mp3', '/upload/audio/oct_25/29_kor_voice.mp3', 1, 29),
('29_eng_voice.mp3', '/upload/audio/oct_25/29_eng_voice.mp3', 2, 29),
('30_kor_voice.mp3', '/upload/audio/oct_25/30_kor_voice.mp3', 1, 30),
('30_eng_voice.mp3', '/upload/audio/oct_25/30_eng_voice.mp3', 2, 30);



INSERT IGNORE INTO attendance (attenDate, attendDay, userNo) VALUES
('2025-08-01','2025-08-01', 1),
('2025-08-01','2025-08-01', 2),
('2025-08-02','2025-08-02', 1),
('2025-08-03','2025-08-03', 3),
('2025-08-03','2025-08-03', 2),
('2025-08-03','2025-08-04', 4),
('2025-08-03','2025-08-03', 1),
('2025-08-04','2025-08-04', 5),
('2025-08-05','2025-08-05', 2),
('2025-08-05','2025-08-05', 1);


-- USE sayKorean;



-- =====================
-- 5. TEST 데이터
-- =====================
INSERT INTO test (testTitle, testTitleRoman, testTitleJp, testTitleCn, testTitleEn, testTitleEs, studyNo)
VALUES
('안부를 묻는 문장들', 'Anbureul Munneun Munjangdeul', 'よろしくお願いする文章', '问候语', 'Sentences asking for greetings', 'Frases pidiendo saludos', 1),
('회사에서 살아남기 위한 문장들', 'Hoesa-eseo Saranamgi Wihan Munjangdeul', '会社で生き残るための文章', '职场生存箴言', 'Phrases to survive in the workplace', 'Frases para sobrevivir en el ámbito laboral', 2),
('콘서트장에서 할 수 있는 말', 'Konseoteujang-eseo Hal Su Inneun Mal', 'コンサート会場でできること', '音乐会上要说的话', 'Things to say at a concert', 'Cosas que decir en un concierto', 3),
('새해 명절에 가족들과 나누는 말들', 'Saehae Myeongjeore Gajokdeulgwa Nanuneun Maldeul', '新年の祝日に家族と分かち合う言葉', '新年假期对家人说的话', 'Things to say to your family during the New Year holidays', 'Cosas que decirle a tu familia durante las vacaciones de Año Nuevo', 4),
('친구와 대화할 때', 'Chin-guwa Daehwahal Ttae', '友達と話すとき', '和朋友聊天时', 'When talking with a friend', 'Cuando hablas con un amigo', 5),
('데이트할 때 쓸 수 있는 문장들', 'Deiteuhal Ttae Sseul Su Inneun Munjangdeul', 'デート時に使える文章', '约会时可以使用的短语', 'Phrases you can use on a date', 'Frases que puedes usar en una cita', 6),
('위치나 장소를 물어볼 때 쓰는 말들', 'Wichina Jangsoreul Mureobol Ttae Sseuneun Maldeul', '場所や場所を尋ねるときに書く言葉', '询问地点或位置时使用的词语', 'Words used when asking about location or place', 'Palabras que se usan al preguntar por la ubicación o el lugar', 7),
('시장에 갔을 때 쓸 만한 문장들', 'Sijang-e Gasseul Ttae Sseul Manhan Munjangdeul', '市場に行ったときに使える文章', '去市场时可以使用的短语', 'Phrases to use when going to the market', 'Frases para usar al ir al mercado', 8),
('일정을 제안할 때 쓰는 문장들', 'Iljeong-eul Je-anhal Ttae Sseuneun Munjangdeul', 'スケジュールを提案するときに書く文', '建议日程安排时可以使用的句子', 'Sentences to use when suggesting a schedule', 'Frases para usar al sugerir un horario', 9),
('나의 상태나 상황을 표현하는 문장들', 'Naui Sangtaena Sanghwang-eul Pyohyeonhaneun Munjangdeul', '私の状態や状況を表現する文章', '表达我的状况或处境的句子', 'Sentences expressing my condition or situation', 'Frases que expresen mi condición o situación', 10);


-- =====================
-- 6. TESTITEM 데이터
-- =====================
INSERT INTO testItem (question, questionRoman, questionJp, questionCn, questionEn, questionEs, examNo, testNo)
VALUES
('그림: 올바른 표현을 고르세요.', 'Geurim: Olbareun Pyohyeoneul Goreuseyo.', '図：正しい表現を選んでください。', '图片：选择正确的表情。', 'Picture: Choose the correct expression.', 'Imagen: Elige la expresión correcta.', 2, 1),
('음성: 올바른 표현을 고르세요.', 'Eumseong: Olbareun Pyohyeoneul Goreuseyo.', '音声：正しい表現を選んでください。', '语音：选择正确的表达方式。', 'Voice: Choose the correct expression.', 'Voz: Elige la expresión correcta.', 3, 1),
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观：写出符合以下情况的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 1, 1),
('그림: 올바른 표현을 고르세요.', 'Geurim: Olbareun Pyohyeoneul Goreuseyo.', '図：正しい表現を選んでください。', '图片：选择正确的表情。', 'Picture: Choose the correct expression.', 'Imagen: Elige la expresión correcta.', 6, 2),
('음성: 올바른 표현을 고르세요.', 'Eumseong: Olbareun Pyohyeoneul Goreuseyo.', '音声：正しい表現を選んでください。', '语音：选择正确的表达方式。', 'Voice: Choose the correct expression.', 'Voz: Elige la expresión correcta.', 4, 2),
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观：写出符合以下情况的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 5, 2),
('그림: 올바른 표현을 고르세요.', 'Geurim: Olbareun Pyohyeoneul Goreuseyo.', '図：正しい表現を選んでください。', '图片：选择正确的表情。', 'Picture: Choose the correct expression.', 'Imagen: Elige la expresión correcta.', 8, 3),
('음성: 올바른 표현을 고르세요.', 'Eumseong: Olbareun Pyohyeoneul Goreuseyo.', '音声：正しい表現を選んでください。', '语音：选择正确的表达方式。', 'Voice: Choose the correct expression.', 'Voz: Elige la expresión correcta.', 7, 3),
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观：写出符合以下情况的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 9, 3),
('그림: 올바른 표현을 고르세요.', 'Geurim: Olbareun Pyohyeoneul Goreuseyo.', '図：正しい表現を選んでください。', '图片：选择正确的表情。', 'Picture: Choose the correct expression.', 'Imagen: Elige la expresión correcta.', 10, 4),
('음성: 올바른 표현을 고르세요.', 'Eumseong: Olbareun Pyohyeoneul Goreuseyo.', '音声：正しい表現を選んでください。', '语音：选择正确的表达方式。', 'Voice: Choose the correct expression.', 'Voz: Elige la expresión correcta.', 11, 4),
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观：写出符合以下情况的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 12, 4),
-- testNo 5: 친구와 대화할 때
('그림: 올바른 표현을 고르세요.', 'Geurim: Olbareun Pyohyeoneul Goreuseyo.', '図：正しい表現を選んでください。', '图片：选择正确的表达方式。', 'Picture: Choose the correct expression.', 'Imagen: Elige la expresión correcta.', 13, 5),
('음성: 올바른 표현을 고르세요.', 'Eumseong: Olbareun Pyohyeoneul Goreuseyo.', '音声：正しい表現を選んでください。', '语音：选择正确的表达方式。', 'Voice: Choose the correct expression.', 'Voz: Elija la expresión correcta.', 15, 5),
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观题：写出一个符合下列情境的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 14, 5),

-- testNo 6: 데이트할 때 쓸 수 있는 문장들
('그림: 올바른 표현을 고르세요.', 'Geurim: Olbareun Pyohyeoneul Goreuseyo.', '図：正しい表現を選んでください。', '图片：选择正确的表达方式。', 'Picture: Choose the correct expression.', 'Imagen: Elige la expresión correcta.', 16, 6),
('음성: 올바른 표현을 고르세요.', 'Eumseong: Olbareun Pyohyeoneul Goreuseyo.', '音声：正しい表現を選んでください。', '语音：选择正确的表达方式。', 'Voice: Choose the correct expression.', 'Voz: Elija la expresión correcta.', 17, 6),
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观题：写出一个符合下列情境的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 18, 6),

-- testNo 7: 위치나 장소를 물어볼 때 쓰는 말들
('그림: 올바른 표현을 고르세요.', 'Geurim: Olbareun Pyohyeoneul Goreuseyo.', '図：正しい表現を選んでください。', '图片：选择正确的表达方式。', 'Picture: Choose the correct expression.', 'Imagen: Elige la expresión correcta.', 19, 7),
('음성: 올바른 표현을 고르세요.', 'Eumseong: Olbareun Pyohyeoneul Goreuseyo.', '音声：正しい表現を選んでください。', '语音：选择正确的表达方式。', 'Voice: Choose the correct expression.', 'Voz: Elija la expresión correcta.', 20, 7),
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观题：写出一个符合下列情境的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 21, 7),

-- testNo 8: 시장에 갔을 때 쓸 만한 문장들
('그림: 올바른 표현을 고르세요.', 'Geurim: Olbareun Pyohyeoneul Goreuseyo.', '図：正しい表現を選んでください。', '图片：选择正确的表达方式。', 'Picture: Choose the correct expression.', 'Imagen: Elige la expresión correcta.', 23, 8),
('음성: 올바른 표현을 고르세요.', 'Eumseong: Olbareun Pyohyeoneul Goreuseyo.', '音声：正しい表現を選んでください。', '语音：选择正确的表达方式。', 'Voice: Choose the correct expression.', 'Voz: Elija la expresión correcta.', 22, 8),
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观题：写出一个符合下列情境的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 24, 8),

-- testNo 9: 일정을 제안할 때 쓰는 문장들
('그림: 올바른 표현을 고르세요.', 'Geurim: Olbareun Pyohyeoneul Goreuseyo.', '図：正しい表現を選んでください。', '图片：选择正确的表达方式。', 'Picture: Choose the correct expression.', 'Imagen: Elige la expresión correcta.', 25, 9),
('음성: 올바른 표현을 고르세요.', 'Eumseong: Olbareun Pyohyeoneul Goreuseyo.', '音声：正しい表現を選んでください。', '语音：选择正确的表达方式。', 'Voice: Choose the correct expression.', 'Voz: Elija la expresión correcta.', 27, 9),
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观题：写出一个符合下列情境的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 26, 9),

-- testNo 10: 나의 상태나 상황을 표현하는 문장들
('그림: 올바른 표현을 고르세요.', 'Geurim: Olbareun Pyohyeoneul Goreuseyo.', '図：正しい表現を選んでください。', '图片：选择正确的表达方式。', 'Picture: Choose the correct expression.', 'Imagen: Elige la expresión correcta.', 28, 10),
('음성: 올바른 표현을 고르세요.', 'Eumseong: Olbareun Pyohyeoneul Goreuseyo.', '音声：正しい表現を選んでください。', '语音：选择正确的表达方式。', 'Voice: Choose the correct expression.', 'Voz: Elija la expresión correcta.', 29, 10),
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观题：写出一个符合下列情境的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 30, 10);


INSERT IGNORE INTO ranking
(testRound, selectedExamNo, userAnswer, isCorrect, resultDate, testItemNo, userNo) VALUES
(1, 1, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 10:00:00', 1, 1),
(1, 2, '안녕하세요', 1, '2025-10-16 10:05:00', 2, 2),
(1, 3, '죄송합니다', 1, '2025-10-16 10:10:00', 3, 3),
-- testRound 2
(2, 4, '오늘 날씨가 좋네요', 1, '2025-10-16 11:00:00', 4, 1),
(2, 5, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 11:05:00', 5, 2),
(2, 6, '감사합니다', 1, '2025-10-16 11:10:00', 6, 3),
-- testRound 3
(3, 7, '반갑습니다', -1, '2025-10-16 12:00:00', 7, 1),
(3, 8, '잘 지냈습니까?', 1, '2025-10-16 12:05:00', 8, 2),
(3, 9, '네, 맞습니다', 1, '2025-10-16 12:10:00', 9, 3),
-- testRound 4
(4, 10, '아닙니다', -1, '2025-10-16 13:00:00', 10, 1),
(4, 1, '좋아요', 1, '2025-10-16 13:05:00', 1, 2),
(4, 2, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 13:10:00', 2, 3),
-- testRound 5
(5, 3, '네, 좋아요', 1, '2025-10-16 14:00:00', 3, 1),
(5, 4, '괜찮습니다', 1, '2025-10-16 14:05:00', 4, 2),
(5, 5, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 14:10:00', 5, 3),
-- testRound 6
(6, 6, '그럼요', -1, '2025-10-16 15:00:00', 6, 1),
(6, 7, '정답입니다', 1, '2025-10-16 15:05:00', 7, 2),
(6, 8, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 15:10:00', 8, 3),
-- testRound 7
(7, 9, '좋은 하루입니다', -1, '2025-10-16 16:00:00', 9, 1),
(7, 10, '감사합니다', 1, '2025-10-16 16:05:00', 10, 2),
(7, 1, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 16:10:00', 1, 3),
-- testRound 8
(8, 2, '안녕히 가세요', 1, '2025-10-16 17:00:00', 2, 1),
(8, 3, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 17:05:00', 3, 2),
(8, 4, '축하합니다', 1, '2025-10-16 17:10:00', 4, 3),
-- testRound 9
(9, 5, '잘했습니다', 1, '2025-10-16 18:00:00', 5, 1),
(9, 6, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 18:05:00', 6, 2),
(9, 7, '수고하셨습니다', 1, '2025-10-16 18:10:00', 7, 3),
-- testRound 10
(10, 8, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 19:00:00', 8, 1),
(10, 9, '좋아요', 1, '2025-10-16 19:05:00', 9, 2),
(10, 10, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 19:10:00', 10, 3),
(1, 1, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 10:00:00', 1, 1),
(1, 2, '안녕하세요', 1, '2025-10-16 10:05:00', 2, 2),
(1, 3, '죄송합니다', 1, '2025-10-16 10:10:00', 3, 3),
(2, 4, '오늘 날씨가 좋네요', 1, '2025-10-16 11:00:00', 4, 4),
(2, 5, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 11:05:00', 5, 5),
(2, 6, '감사합니다', 1, '2025-10-16 11:10:00', 6, 6),
(3, 7, '반갑습니다', -1, '2025-10-16 12:00:00', 7, 7),
(3, 8, '잘 지냈습니까?', 1, '2025-10-16 12:05:00', 8, 8),
(3, 9, '네, 맞습니다', 1, '2025-10-16 12:10:00', 9, 9),
(4, 10, '아닙니다', -1, '2025-10-16 13:00:00', 10, 10),
(4, 1, '좋아요', 1, '2025-10-16 13:05:00', 1, 11),
(4, 2, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 13:10:00', 2, 12),
(5, 3, '네, 좋아요', 1, '2025-10-16 14:00:00', 3, 13),
(5, 4, '괜찮습니다', 1, '2025-10-16 14:05:00', 4, 14),
(5, 5, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 14:10:00', 5, 15),
(1, 1, '안녕하세요', 1, '2025-10-16 09:00:00', 1, 1),
(1, 2, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 09:05:00', 2, 2),
(1, 3, '죄송합니다', 1, '2025-10-16 09:10:00', 3, 3),
(1, 1, '좋아요', -1, '2025-10-16 09:15:00', 1, 4),
(1, 2, '감사합니다', 1, '2025-10-16 09:20:00', 2, 5),
(2, 1, '오늘 날씨가 좋네요', 1, '2025-10-16 10:00:00', 3, 6),
(2, 2, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 10:05:00', 4, 7),
(2, 3, '반갑습니다', -1, '2025-10-16 10:10:00', 5, 8),
(2, 1, '잘 지냈습니까?', 1, '2025-10-16 10:15:00', 6, 9),
(2, 2, '네, 맞습니다', 1, '2025-10-16 10:20:00', 7, 10),
(3, 1, '아닙니다', -1, '2025-10-16 11:00:00', 8, 11),
(3, 2, '죄송합니다', 1, '2025-10-16 11:05:00', 9, 12),
(3, 3, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 11:10:00', 10, 13),
(3, 1, '좋아요', 1, '2025-10-16 11:15:00', 1, 14),
(3, 2, '네, 좋아요', 1, '2025-10-16 11:20:00', 2, 15),
(4, 1, '괜찮습니다', -1, '2025-10-16 12:00:00', 3, 16),
(4, 2, '그럼요', -1, '2025-10-16 12:05:00', 4, 17),
(4, 3, '정답입니다', 1, '2025-10-16 12:10:00', 5, 18),
(4, 1, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 12:15:00', 6, 19),
(4, 2, '감사합니다', 1, '2025-10-16 12:20:00', 7, 20),
(5, 1, '안녕히 가세요', 1, '2025-10-16 13:00:00', 8, 21),
(5, 2, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 13:05:00', 9, 22),
(5, 3, '축하합니다', 1, '2025-10-16 13:10:00', 10, 23),
(5, 1, '잘했습니다', 1, '2025-10-16 13:15:00', 1, 24),
(5, 2, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 13:20:00', 2, 25),
(6, 1, '수고하셨습니다', 1, '2025-10-16 14:00:00', 3, 26),
(6, 2, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 14:05:00', 4, 27),
(6, 3, '좋은 하루입니다', -1, '2025-10-16 14:10:00', 5, 28),
(6, 1, '감사합니다', 1, '2025-10-16 14:15:00', 6, 29),
(6, 2, '객관식 문항이거나 공란으로 제출했습니다.', -1, '2025-10-16 14:20:00', 7, 30);

INSERT IGNORE INTO languages (langName) VALUES
('한국어'),
('日本語'),
('中文'),
('English'),
('español');

select * from genre;
select * from study;
select * from exam;
select * from audio;
select * from users;
select * from attendance;
select * from test;
select * from testItem;
select * from ranking;
select * from languages;