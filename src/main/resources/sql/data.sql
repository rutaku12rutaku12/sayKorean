
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
'La cultura tradicional proporciona una gran excusa para que los coreanos modernos y ocupados se reúnan con sus familiares.', 4);




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
('떡국 맛있겠다.', 'Tteokguk Masitgetda.', 'お餅おいしい。', '年糕汤看起来很美味。', 'Tteokguk looks delicious.', 'El tteokguk se ve delicioso.', '46_img.png', '/upload/image/oct_25/12_img.png', 4);




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
('12_eng_voice.mp3', '/upload/audio/oct_25/12_eng_voice.mp3', 2, 12);



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
('새해 명절에 가족들과 나누는 말들', 'Saehae Myeongjeore Gajokdeulgwa Nanuneun Maldeul', '新年の祝日に家族と分かち合う言葉', '新年假期对家人说的话', 'Things to say to your family during the New Year holidays', 'Cosas que decirle a tu familia durante las vacaciones de Año Nuevo', 4);

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
('주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.', 'Jugwansik: Da-eum Sanghwang-e Manneun Han-gugeo Pyohyeoneul Jakseonghaseyo.', '主観式：以下の状況に合った韓国語表現を作成してください。', '主观：写出符合以下情况的韩语表达。', 'Subjective: Write a Korean expression that fits the following situation.', 'Subjetivo: Escribe una expresión coreana que se ajuste a la siguiente situación.', 12, 4);


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