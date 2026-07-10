import { EssayTopic, ForumPost, LearningLesson } from './types';

export const DEFAULT_TOPICS: EssayTopic[] = [
  {
    id: 'topic-1',
    title: 'Nghị luận xã hội về đức tính "Tự lập" của thế hệ trẻ hiện nay',
    type: 'nghi-luan-xa-hoi',
    grade: 9,
    difficulty: 'Trung bình',
    targetExam: true,
    context: 'Lối sống dựa dẫm, ỷ lại đang cản trở sự phát triển của nhiều bạn trẻ. Ngược lại, tính tự lập giúp con người tự tin, vững vàng bước vào đời. Em hãy viết một bài văn nghị luận khoảng 400 - 500 chữ nêu suy nghĩ về ý nghĩa của tính tự lập đối với học sinh THCS trước ngưỡng cửa tương lai.',
    suggestedOutline: `### DÀN Ý CHI TIẾT: NGHỊ LUẬN VỀ TÍNH TỰ LẬP

**1. Mở bài:**
- **Dẫn dắt trực tiếp hoặc gián tiếp:** Giới thiệu về hành trình trưởng thành của mỗi con người.
- **Nêu vấn đề cần nghị luận:** Vai trò và tầm quan trọng của đức tính "Tự lập" đối với học sinh, đặc biệt là thế hệ trẻ hiện nay.

**2. Thân bài:**
- **Giải thích khái niệm:** "Tự lập" là gì? (Là tự mình làm lấy các công việc của bản thân, tự quyết định và tự chịu trách nhiệm về cuộc đời mình, không dựa dẫm hay ỷ lại vào người khác).
- **Phân tích biểu hiện của tự lập:**
  - *Trong học tập:* Tự giác làm bài, tự tìm tòi nghiên cứu tài liệu, không quay cóp.
  - *Trong cuộc sống hàng ngày:* Tự chăm sóc bản thân (giặt giũ, nấu ăn đơn giản), dọn dẹp phòng, tự lập thời gian biểu.
  - *Trong suy nghĩ:* Có chính kiến riêng, biết tự định hướng ước mơ nghề nghiệp.
- **Bình luận ý nghĩa, vai trò của tự lập (Tại sao cần tự lập?):**
  - Giúp tích lũy kinh nghiệm thực tế, rèn luyện bản lĩnh vượt qua khó khăn.
  - Được mọi người kính trọng, yêu quý và tin cậy.
  - Là bệ phóng vững chắc nhất để đạt được thành công bền vững.
- **Phép phản đề (Bác bỏ):**
  - Phê phán lối sống ỷ lại, thụ động, "núp bóng" cha mẹ của một bộ phận học sinh hiện nay.
  - Phân biệt tự lập với sự cô lập, bảo thủ, từ chối sự giúp đỡ chân thành từ người khác.
- **Bài học nhận thức và hành động:**
  - Nhận thức: Tự lập không phải là việc gì quá to tát, mà bắt đầu từ những hành động nhỏ nhất.
  - Hành động: Rèn luyện tính tự giác mỗi ngày, học hỏi thêm các kỹ năng sinh tồn và kỹ năng mềm.

**3. Kết bài:**
- Khái quát lại ý nghĩa của đức tính tự lập.
- Đưa ra thông điệp hoặc lời khuyên ý nghĩa: "Muốn bay cao, cánh chim phải tự vỗ. Muốn thành công, con người phải tự lập."`,
    sampleEssay: `### BÀI VĂN MẪU THAM KHẢO (Đạt điểm 9/10)

Trong thế giới hiện đại đầy biến động, hành trình trưởng thành của mỗi cá nhân giống như một chuyến ra khơi đầy bão táp. Để con thuyền cuộc đời có thể vững vàng vượt sóng gió và cán đích thành công, người thủy thủ không thể mãi trông chờ vào những luồng gió thuận hay sự dìu dắt từ người khác. Hành trang tối quan trọng mà mỗi người, đặc biệt là thế hệ trẻ cần mang theo chính là đức tính **tự lập**. 

Trước hết, chúng ta cần hiểu rõ "tự lập" là gì. Tự lập không đơn thuần là việc tự mình lo liệu các công việc cá nhân, mà sâu sắc hơn, đó là khả năng tự quyết định, tự chịu trách nhiệm về cuộc đời mình, chủ động học hỏi và vượt qua thử thách mà không ỷ lại, dựa dẫm vào cha mẹ hay những người xung quanh. Người có tính tự lập luôn biết cách làm chủ hoàn cảnh, biến những khó khăn thành cơ hội rèn luyện bản thân.

Biểu hiện của tính tự lập vô cùng phong phú và gần gũi trong đời sống hàng ngày của học sinh. Trong học tập, sự tự lập thể hiện qua tinh thần chủ động tìm tòi kiến thức mới, tự giác hoàn thành bài tập về nhà mà không đợi nhắc nhở, kiên quyết nói không với gian lận thi cử. Trong sinh hoạt thường nhật, tự lập là tự chăm lo cho bữa ăn giấc ngủ, dọn dẹp không gian sống cá nhân, hay phụ giúp gia đình những công việc vừa sức. Về mặt tư duy, người tự lập có chính kiến riêng, dám đề xuất ý kiến mới và tự mình hoạch định những mục tiêu ngắn hạn, dài hạn cho tương lai.

Vậy tại sao học sinh, thế hệ trẻ lại cần rèn luyện tính tự lập? Có thể khẳng định rằng, tự lập chính là chiếc chìa khóa vạn năng mở ra cánh cửa dẫn tới sự trưởng thành thực sự. Khi tự mình giải quyết vấn đề, chúng ta sẽ tích lũy được những kinh nghiệm xương máu, rèn luyện được tư duy nhạy bén và bản lĩnh kiên cường trước sóng gió. Người tự lập sẽ nhanh chóng thích nghi với những môi trường sống mới, dễ dàng hòa nhập và phát triển bản thân. Hơn thế nữa, lối sống chủ động này còn giúp chúng ta nhận được sự tin yêu, kính trọng từ thầy cô, bạn bè và xã hội.

Tuy nhiên, nhìn vào thực tế hiện nay, vẫn còn một bộ phận không nhỏ các bạn trẻ đang mắc phải căn bệnh "ỷ lại". Họ sống như những cây tầm gửi, phụ thuộc hoàn toàn vào sự bảo bọc, sắp đặt của cha mẹ từ việc ăn mặc, học hành đến cả quyết định tương lai. Khi bước ra khỏi vòng tay gia đình, những "đứa trẻ lớn xác" này dễ dàng bị gục ngã trước những va vấp đầu đời. Chúng ta cần hiểu rằng, tự lập không nghĩa là lập dị, cô lập hay từ chối mọi sự giúp đỡ. Một người tự lập thông minh biết học hỏi từ người khác, nhận sự hỗ trợ khi thực sự cần thiết nhưng vẫn giữ vai trò làm chủ trong mọi quyết định của mình.

Tóm lại, tự lập không phải là năng khiếu bẩm sinh mà là kết quả của cả một quá trình rèn luyện bền bỉ từng ngày. Là học sinh THCS - thế hệ chuẩn bị bước vào một cấp học mới đầy thử thách, mỗi chúng ta cần ý thức được tầm quan trọng của đức tính này. Hãy bắt đầu từ việc tự giác dọn dẹp bàn học, tự ôn tập thi cử và tự chịu trách nhiệm về kết quả của mình. Chỉ khi tự đi trên đôi chân của mình, chúng ta mới có thể ngẩng cao đầu bước tới tương lai.`
  },
  {
    id: 'topic-2',
    title: 'Nghị luận xã hội về hiện tượng "Bạo lực học đường" và giải pháp xây dựng trường học hạnh phúc',
    type: 'nghi-luan-xa-hoi',
    grade: 8,
    difficulty: 'Khó',
    targetExam: true,
    context: 'Vấn nạn bạo lực học đường đang diễn ra phức tạp dưới nhiều hình thức (thể chất, tinh thần, không gian mạng), ảnh hưởng nghiêm trọng đến tâm lý và học tập của học sinh. Em hãy viết bài văn nghị luận phân tích nguyên nhân, hậu quả và đề xuất các giải pháp khả thi để chung tay đẩy lùi vấn nạn này.',
    suggestedOutline: `### DÀN Ý: NGHỊ LUẬN VỀ BẠO LỰC HỌC ĐƯỜNG

**1. Mở bài:**
- Giới thiệu môi trường học đường vốn là nơi nuôi dưỡng tri thức và tâm hồn.
- Nêu vấn đề nghị luận: Vấn nạn bạo lực học đường nhức nhối hiện nay và sự cần thiết phải đẩy lùi.

**2. Thân bài:**
- **Giải thích khái niệm:** "Bạo lực học đường" là những hành vi thô bạo, ngang ngược, xúc phạm đến thể xác lẫn tinh thần của bạn học xảy ra trong trường học hoặc khuôn viên giáo dục.
- **Thực trạng đáng báo động:**
  - Không chỉ dừng lại ở đánh nhau, lăng nhục trực tiếp.
  - Lan rộng ra bạo lực tinh thần trên mạng xã hội (tẩy chay, tung tin đồn nhảm, bôi nhọ danh dự).
- **Nguyên nhân chính:**
  - *Từ bản thân học sinh:* Tâm lý lứa tuổi dậy thì nổi loạn, muốn khẳng định bản thân lệch lạc; thiếu kỹ năng kiềm chế cảm xúc.
  - *Từ gia đình:* Cha mẹ thiếu quan tâm, bận rộn, hoặc gia đình bạo lực làm ảnh hưởng nhận thức trẻ.
  - *Từ nhà trường:* Giáo dục đạo đức đôi khi còn khô khan, thiếu phòng tư vấn tâm lý học đường hiệu quả.
  - *Từ xã hội:* Ảnh hưởng của phim ảnh bạo lực, game online và môi trường mạng độc hại.
- **Hậu quả nghiêm trọng:**
  - Với nạn nhân: Tổn thương thể xác, sang chấn tâm lý kéo dài (lo âu, trầm cảm, sợ hãi), học tập sa sút, thậm chí có hành vi cực đoan.
  - Với người gây bạo lực: Phát triển lệch lạc nhân cách, dễ sa vào tệ nạn xã hội và vi phạm pháp luật.
  - Với nhà trường & xã hội: Làm hoen ố môi trường sư phạm, gây tâm lý bất an cho phụ huynh và học sinh.
- **Giải pháp thiết thực:**
  - Bản thân học sinh: Rèn luyện lòng bao dung, học cách giải quyết xung đột bằng hòa bình, chủ động lên tiếng khi thấy bạo lực.
  - Gia đình: Trở thành chỗ dựa tinh thần an toàn, lắng nghe và đồng hành cùng con.
  - Nhà trường: Tổ chức các chương trình rèn luyện kỹ năng sống, xây dựng hòm thư góp ý bí mật, hỗ trợ tâm lý kịp thời.

**3. Kết bài:**
- Khẳng định bạo lực học đường là ung nhọt cần triệt tiêu tận gốc.
- Đưa ra lời kêu gọi thiết thực: "Mỗi ngày đến trường là một ngày vui. Hãy cùng nhau xây dựng trường học hạnh phúc không bạo lực."`
  },
  {
    id: 'topic-3',
    title: 'Phân tích tình cha con sâu nặng trong truyện ngắn "Chiếc lược ngà" của Nguyễn Quang Sáng',
    type: 'nghi-luan-van-hoc',
    grade: 9,
    difficulty: 'Khó',
    targetExam: true,
    context: 'Chiếc lược ngà là một truyện ngắn xúc động viết về tình phụ tử trong hoàn cảnh chiến tranh ác liệt. Em hãy viết bài văn phân tích diễn biến tâm lý của bé Thu và tình cảm yêu thương con tha thiết của ông Sáu để làm nổi bật giá trị nhân văn sâu sắc của tác phẩm.',
    suggestedOutline: `### DÀN Ý: TÌNH CHA CON TRONG CHIẾC LƯỢC NGÀ

**1. Mở bài:**
- Giới thiệu tác giả Nguyễn Quang Sáng và hoàn cảnh sáng tác tác phẩm "Chiếc lược ngà" (1966 - thời kỳ kháng chiến chống Mỹ ác liệt).
- Nêu chủ đề tác phẩm: Tình cha con thiêng liêng, sâu đậm vượt qua sự tàn khốc của chiến tranh.

**2. Thân bài:**
- **Phân tích diễn biến tâm lý nhân vật bé Thu:**
  - *Trước khi nhận cha:* Kiên quyết từ chối ông Sáu vì vết sẹo trên mặt làm ông không giống bức ảnh chụp chung với mẹ. Thể hiện cá tính mạnh mẽ, tình yêu cha tuyệt đối trong sự ngây thơ.
  - *Khi nhận cha:* Khi hiểu ra sự thật vết sẹo là do chiến tranh tàn phá, tình cảm dồn nén bùng nổ dữ dội. Thu ôm chặt lấy cha, khóc nấc, không muốn cho cha đi chiến đấu. Cảnh tượng vô cùng xúc động.
- **Phân tích nhân vật ông Sáu (Tình yêu con vô bờ bến):**
  - *Trong 3 ngày nghỉ phép:* Khao khát tiếng gọi "Ba" của con nhưng bị từ chối, đau khổ và bất lực nhưng vẫn yêu thương, chăm sóc con.
  - *Khi ở chiến khu:* Luôn dằn vặt vì đã đánh con lúc nóng nảy. Dồn hết tâm huyết, tình cảm vào việc làm chiếc lược bằng ngà voi cho con ("Yêu nhớ tặng Thu con của ba").
  - *Giây phút cuối đời:* Hy sinh anh dũng trong một trận càn, nhưng trước khi nhắm mắt vẫn cố dồn chút sức tàn gửi chiếc lược ngà nhờ người bạn (ông Ba) chuyển cho con gái. Tình cha bất diệt.
- **Đặc sắc nghệ thuật:**
  - Tình huống truyện bất ngờ, kịch tính nhưng tự nhiên, hợp lý.
  - Nghệ thuật miêu tả tâm lý nhân vật xuất sắc, đặc biệt là tâm lý trẻ em.
  - Giọng kể giàu chất thơ, truyền cảm và xúc động sâu sắc.

**3. Kết bài:**
- Khẳng định giá trị của tác phẩm: Chiến tranh có thể tàn phá cuộc sống nhưng không thể hủy diệt tình phụ tử thiêng liêng.
- Nêu cảm nghĩ cá nhân của học sinh.`
  },
  {
    id: 'topic-4',
    title: 'Biểu cảm về một người thân yêu nhất của em trong gia đình',
    type: 'bieu-cam',
    grade: 7,
    difficulty: 'Dễ',
    context: 'Gia đình là tổ ấm bình yên nhất của mỗi chúng ta. Hãy viết bài văn biểu cảm bộc lộ những tình cảm chân thành, sâu sắc của em đối với một người thân yêu nhất (ông bà, cha mẹ, anh chị em), lồng ghép các yếu tố miêu tả, tự sự để bài viết thêm phần sinh động.',
    suggestedOutline: `### DÀN Ý: BIỂU CẢM VỀ NGƯỜI THÂN YÊU (MẸ)

**1. Mở bài:**
- Nêu cảm nghĩ chung về mẹ và vị trí đặc biệt của mẹ trong trái tim em.

**2. Thân bài:**
- **Biểu cảm thông qua các đặc điểm ngoại hình quen thuộc:**
  - Đôi bàn tay gầy guộc, thô ráp vì sương gió nhưng luôn ấm áp khi ôm lấy em.
  - Ánh mắt dịu hiền, bao dung chứa đựng sự lo lắng mỗi khi em ốm.
  - Những sợi tóc bạc sớm vì nỗi lo toan cuộc sống.
- **Biểu cảm thông qua các hành động chăm sóc thường ngày (Yếu tố tự sự):**
  - Mẹ thức khuya dậy sớm chuẩn bị bữa sáng thơm ngon cho em đi học.
  - Mẹ ân cần dạy bảo em những bài học đạo đức, an ủi em khi gặp thất bại.
- **Kỷ niệm sâu sắc khiến em ghi nhớ mãi (Ví dụ: Một lần em bị ốm nặng hoặc mắc lỗi lầm):**
  - Mẹ thức cả đêm chườm ấm, lo lắng đứng ngồi không yên. Giúp em thấu hiểu sâu sắc tấm lòng bao la của mẹ.

**3. Kết bài:**
- Khẳng định tình yêu thương vô bờ bến dành cho mẹ.
- Lời hứa cố gắng học tập chăm ngoan để mẹ vui lòng.`
  }
];

export const DEFAULT_LESSONS: LearningLesson[] = [
  {
    id: 'lesson-1',
    title: 'Cấu trúc bài văn nghị luận xã hội chuẩn 4 bước',
    description: 'Bí kíp triển khai ý rõ ràng, mạch lạc giúp ghi điểm tuyệt đối phần bố cục bài viết.',
    grade: 9,
    type: 'nghi-luan',
    durationMinutes: 20,
    content: `# CƠ CẤU BÀI VĂN NGHỊ LUẬN XÃ HỘI CHUẨN 4 BƯỚC

Để viết một bài văn nghị luận xã hội (về một tư tưởng đạo lý hoặc hiện tượng đời sống) mạch lạc và thuyết phục, học sinh cần áp dụng công thức **4 bước vàng** trong phần Thân bài dưới đây:

---

### 🌟 Bước 1: Giải thích vấn đề (Khoảng 5 - 7 dòng)
- **Mục tiêu:** Giúp người đọc hiểu chính xác khái niệm, thuật ngữ cốt lõi của đề bài.
- **Cách viết:**
  - Định nghĩa từ khóa chính.
  - Giải thích nghĩa bóng, nghĩa sâu xa (nếu có).
  - Khái quát ý nghĩa chung của toàn bộ câu nói/vấn đề.

### 🌟 Bước 2: Phân tích & Chứng minh (Trọng tâm - Khoảng 1.5 trang)
- **Mục tiêu:** Làm rõ tại sao vấn đề đó lại đúng/sai, có ý nghĩa thế nào bằng lý lẽ và dẫn chứng thực tế.
- **Quy tắc đưa dẫn chứng (Quy tắc 3S):**
  - **S**pecific (Cụ thể): Nêu rõ tên người, sự kiện, không nói chung chung.
  - **S**ignificant (Có tầm ảnh hưởng): Chọn nhân vật có tính biểu tượng cao (như Nick Vujicic, Edison, Chủ tịch Hồ Chí Minh...).
  - **S**uccinct (Ngắn gọn): Chỉ kể từ 2-3 câu về hành động của họ, sau đó tập trung phân tích ý nghĩa hành động đó liên quan đến đề bài.

### 🌟 Bước 3: Phản đề & Mở rộng (Nâng tầm bài viết - Khoảng 10 dòng)
- **Mục tiêu:** Thể hiện tư duy phản biện đa chiều của người viết. Giúp bài viết không bị phiến diện và đạt điểm tối đa (thang điểm tư duy).
- **Cách viết:**
  - Phê phán những hành vi đi ngược lại đức tính tốt đẹp (ỷ lại, vô cảm, gian lận...).
  - Phân biệt ranh giới mong manh (ví dụ: Tự lập khác với tự phụ/bảo thủ; Khiêm tốn khác với tự ti...).

### 🌟 Bước 4: Bài học nhận thức & Hành động (Khoảng 8 - 10 dòng)
- **Mục tiêu:** Rút ra liên hệ bản thân thực chất, tránh giáo điều, sáo rỗng.
- **Cách viết:**
  - **Nhận thức:** Bản thân học sinh hiểu ra giá trị gì sâu sắc?
  - **Hành động:** Cụ thể hóa bằng việc làm hàng ngày (học tập, giúp đỡ gia đình, rèn luyện thói quen tốt...).

---

*Mẹo từ giáo viên:* Hãy ghi nhớ công thức **Giải thích → Chứng minh → Phản đề → Bài học**. Thiếu một bước, bài văn của bạn sẽ mất đi sự hoàn thiện tư duy!`
  },
  {
    id: 'lesson-2',
    title: 'Cách đưa dẫn chứng thực tế đắt giá vào bài văn',
    description: 'Học cách lựa chọn và phân tích dẫn chứng thời sự để bài viết giàu tính thuyết phục.',
    grade: 9,
    type: 'nghi-luan',
    durationMinutes: 15,
    content: `# NGHỆ THUẬT ĐƯA DẪN CHỨNG ĐẮT GIÁ VÀO BÀI VĂN NGHỊ LUẬN

Một bài văn nghị luận thiếu dẫn chứng thực tế giống như một cái cây không có rễ - nó sẽ héo úa và thiếu sức sống. Dưới đây là cách giúp bạn đưa những dẫn chứng đắt giá nhất vào bài làm.

---

### 1. Phân loại nguồn dẫn chứng đắt giá:
- **Dẫn chứng lịch sử / danh nhân:** Mang tính biểu tượng cao, giàu sức thuyết phục (Ví dụ: Thầy giáo Nguyễn Ngọc Ký, nhà bác học Thomas Edison, danh tướng Trần Hưng Đạo).
- **Dẫn chứng thời sự / xã hội hiện đại:** Thể hiện tư duy cập nhật tin tức tốt của học sinh (Ví dụ: Sự hy sinh thầm lặng của các bác sĩ tuyến đầu phòng dịch, tấm gương quyên góp của học sinh nghèo cho đồng bào lũ lụt).
- **Dẫn chứng văn học:** Thích hợp cho các bài nghị luận văn học hoặc lồng ghép tinh tế sang nghị luận xã hội.

### 2. Công thức viết đoạn văn phân tích dẫn chứng (Công thức LEAD):
- **L - Link (Kết nối):** Giới thiệu dẫn chứng kết nối với luận điểm đang nói.
- **E - Evidence (Nêu dẫn chứng):** Chỉ ra tên người, hành động cốt lõi nhất (không kể lể dài dòng).
- **A - Analyze (Phân tích):** Chỉ ra hành động đó chứng minh cho luận điểm như thế nào.
- **D - Deduce (Khái quát rút ra bài học):** Tổng kết lại giá trị.

### 💡 Ví dụ minh họa về đức tính "Vượt lên nghịch cảnh":
> *Bản thân cuộc sống luôn chứa đựng những rào cản thử thách, nhưng điều quan trọng là thái độ của ta trước nghịch cảnh. Hãy nhìn vào hành trình kỳ diệu của **Nick Vujicic** - người đàn ông sinh ra không có cả tay lẫn chân. Thay vì đầu hàng số phận gõ cửa, ông đã tự học cách viết, bơi lội và trở thành một trong những diễn giả truyền cảm hứng nổi tiếng nhất thế giới. Hành trình của Nick là một minh chứng hùng hồn rằng: Khuyết tật lớn nhất của con người không phải là ở thể xác, mà là sự thiếu khuyết ở tâm hồn và ý chí vươn lên.*`
  },
  {
    id: 'lesson-3',
    title: 'Bí quyết viết mở bài thu hút người chấm thi',
    description: 'Hướng dẫn 3 phương pháp mở bài gián tiếp cuốn hút, tạo ấn tượng tốt ngay từ giây đầu tiên.',
    grade: 8,
    type: 'ly-thuyet',
    durationMinutes: 15,
    content: `# BÍ QUYẾT VIẾT MỞ BÀI THU HÚT, GÂY ẤN TƯỢNG MẠNH

Người chấm thi thường phải đọc hàng trăm bài thi mỗi ngày. Một mở bài độc đáo, giàu nhạc điệu và tư duy sâu sắc sẽ lập tức giúp bài viết của bạn nổi bật.

---

### Phương pháp 1: Mở bài bằng một câu trích dẫn, danh ngôn
- **Cách làm:** Tìm một câu thơ, câu nói nổi tiếng có chủ đề tương đồng với đề bài làm bệ phóng dẫn dắt.
- **Mẫu áp dụng (Chủ đề Ý chí, nghị lực):**
  > *Nhà văn người Mỹ Helen Keller từng viết: "Tôi đã đi qua những thung lũng sâu thẳm của bóng tối, nhưng tôi chưa bao giờ cúi đầu đầu hàng trước số phận." Thật vậy, cuộc sống không bao giờ bằng phẳng, và chính ý chí nghị lực vượt lên nghịch cảnh mới là ngọn hải đăng rọi sáng cuộc đời mỗi con người. Và đề bài hôm nay về nghị lực sống chính là hồi chuông đánh thức bản lĩnh tự cường trong trái tim mỗi học sinh...*

### Phương pháp 2: Mở bài bằng hình ảnh tương phản (So sánh đối chiếu)
- **Cách làm:** Đặt hai hình ảnh đối lập nhau (bóng tối - ánh sáng, thụ động - tự lập) để làm bật lên ý nghĩa của vấn đề.
- **Mẫu áp dụng (Chủ đề Tính tự lập):**
  > *Giữa rừng già bao la, cây tầm gửi chỉ có thể sinh trưởng bằng cách bám chặt và hút chất dinh dưỡng từ thân cổ thụ lớn khác. Nhưng con người chúng ta không phải là loài tầm gửi. Để đi qua giông bão cuộc đời, chúng ta cần học cách đứng trên đôi chân của chính mình. Đó chính là lý do vì sao đức tính tự lập trở thành một cột mốc đánh dấu sự trưởng thành thực sự của mỗi bạn trẻ ngày hôm nay.*

### Phương pháp 3: Mở bài bằng suy tư thời sự, triết lý nhân sinh
- **Cách làm:** Đi từ quy luật tự nhiên hoặc xu thế thời đại số để kết nối vào vấn đề đạo đức, lối sống.
- **Mẹo:** Dành cho học sinh giỏi muốn đạt điểm tối đa (9.5+).`
  },
  {
    id: 'lesson-4',
    title: 'Nghệ thuật khơi gợi cảm xúc trong văn biểu cảm',
    description: 'Cách kết hợp nhuần nhuyễn yếu tố miêu tả, tự sự để bài viết dạt dào cảm xúc chân thật.',
    grade: 7,
    type: 'bieu-cam',
    durationMinutes: 20,
    content: `# NGHỆ THUẬT KHƠI GỢI CẢM XÚC TRONG VĂN BIỂU CẢM

Văn biểu cảm (văn trữ tình) không phải là sự than vãn hay ca ngợi chung chung sáo rỗng. Điểm mấu chốt để lay động trái tim người đọc nằm ở **sự chân thật của cảm xúc** thông qua các chi tiết nghệ thuật nhỏ nhưng đắt giá.

---

### 1. Nguyên tắc "Tả để biểu cảm" (Tình cảnh giao hòa)
- Đừng chỉ viết: "Mẹ em rất vất vả." Hãy tả đôi bàn tay mẹ:
  > *Mỗi lần cầm lấy bàn tay mẹ, lòng em lại dâng lên một niềm thương cảm nghẹn ngào. Đó không phải là bàn tay mịn màng của những quý bà, mà là bàn tay xương xương, thô ráp với những vết chai sạn cứng ngắc - dấu ấn của bao năm tháng dầm mưa dãi nắng chắt chiu từng đồng tiền nuôi em ăn học.*

### 2. Nguyên tắc "Kể để bộc lộ cảm xúc" (Tự sự làm điểm tựa)
- Lồng ghép một kỷ niệm sâu sắc vào bài văn biểu cảm để làm bùng nổ cảm xúc.
- Kỷ niệm có thể là một lần mắc lỗi làm cha mẹ buồn, hoặc một ngày mưa gió cha lặn lội đón em đi học về.
- Tập trung vào khoảnh khắc thay đổi nhận thức của em.

### 3. Tránh các từ ngữ sáo rỗng
- Thay vì lặp đi lặp lại những từ cảm thán như *"Chao ôi!"*, *"Ôi!"*, hãy dùng các động từ chỉ trạng thái cảm xúc nội tâm như: *thắt lòng, nghẹn ngào, ấm nóng khóe mắt, trân quý, khắc khoải...*`
  }
];

export const DEFAULT_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    author: 'Cô Nguyễn Minh Thu',
    role: 'Giáo viên',
    grade: 9,
    title: '🔥 Bí kíp đạt điểm 9+ môn Ngữ văn kì thi Tuyển sinh vào lớp 10 năm nay!',
    content: `Chào các em học sinh lớp 9 thân yêu! Kỳ thi tuyển sinh vào 10 đang đến rất gần. Để giúp các em tự tin bứt phá điểm số, cô xin chia sẻ 3 bí kíp cực kỳ quan trọng dưới đây:

### 1. Viết đúng trước khi viết hay
Rất nhiều em sa vào viết sáo rỗng, hoa mỹ nhưng lại thiếu luận điểm rõ ràng. Hãy nhớ giám khảo chấm điểm theo barem ý. Mỗi đoạn văn thân bài cần có: **Câu chủ đề nêu rõ luận điểm → Lý lẽ phân tích → Dẫn chứng thực tế → Tiểu kết đoạn**.

### 2. Phân biệt rõ các thao tác lập luận
Khi viết văn nghị luận xã hội, các em cần phối hợp nhịp nhàng giữa giải thích, phân tích, chứng minh, bác bỏ (phản đề) và bình luận. Đoạn văn phản đề chính là "điểm sáng" giúp bài viết của các em thoát khỏi lối mòn thông thường.

### 3. Rèn luyện viết dưới áp lực thời gian
Các em hãy chủ động dùng tính năng làm bài tập có hẹn giờ của ứng dụng để làm quen với áp lực phòng thi thực tế.

Chúc các em ôn tập thật tốt và biến ước mơ đỗ trường chuyên, lớp chọn thành hiện thực!`,
    category: 'de-thi-vao-10',
    likes: 42,
    comments: [
      {
        id: 'c-1',
        author: 'Trần Văn Nam',
        role: 'Học sinh',
        content: 'Bài viết của cô bổ ích quá ạ! Em hay bị thiếu ý phản đề, sau khi đọc xong em đã hiểu cách triển khai hơn rồi ạ.',
        date: '2026-07-09'
      },
      {
        id: 'c-2',
        author: 'Thầy Lê Hoàng',
        role: 'Giáo viên',
        content: 'Hoàn toàn đồng ý với chia sẻ của cô Thu. Cấu trúc rõ ràng là điều quyết định 70% điểm số của học sinh.',
        date: '2026-07-09'
      }
    ],
    date: '2026-07-08',
    isSampleEssay: false
  },
  {
    id: 'post-2',
    author: 'Nam_HọcSinhChuyên',
    role: 'Học sinh',
    grade: 9,
    title: '📝 Bài viết nghị luận xã hội siêu hay chủ đề: Sự thấu cảm trong kỷ nguyên số',
    content: `Mình vừa lập dàn ý và viết thử một bài văn về chủ đề "Sự thấu cảm giữa thế giới ảo". Chia sẻ lên đây để mọi người cùng thảo luận nhé!

### Đề bài: Nêu suy nghĩ của em về tầm quan trọng của sự thấu cảm trên không gian mạng xã hội hiện nay.

**Trích dẫn đoạn Thân bài mình tâm đắc:**
> "...Trên không gian mạng xã hội, người ta dễ dàng buông những lời miệt thị ẩn danh vì nghĩ rằng đối phương chỉ là một tài khoản ảo. Nhưng vết thương lòng từ bạo lực mạng lại là có thật và vô cùng rướm máu. Sự thấu cảm trên Internet chính là việc chúng ta biết dừng lại một nhịp trước khi gõ phím, biết đặt mình vào hoàn cảnh của người khác để lắng nghe, cảm thông và chia sẻ thay vì vội vã phán xét hay hùa theo đám đông. Đó là dòng nước mát lành xoa dịu những rạn nứt giữa một thế giới ảo nhưng đầy rẫy tổn thương thực..."

Mọi người thấy đoạn văn trên thế nào? Nhờ các thầy cô và các bạn sửa giúp mình phần diễn đạt nhé!`,
    category: 'nghi-luan',
    likes: 28,
    comments: [
      {
        id: 'c-3',
        author: 'Cô Nguyễn Minh Thu',
        role: 'Giáo viên',
        content: 'Đoạn văn của em rất có chiều sâu và giàu hình ảnh biểu cảm! Phép so sánh "dòng nước mát lành" rất đắt. Phát huy nhé!',
        date: '2026-07-09'
      }
    ],
    date: '2026-07-09',
    isSampleEssay: true
  }
];
