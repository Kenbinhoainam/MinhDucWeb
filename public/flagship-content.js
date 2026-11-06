/* Presentation views. Content is illustrative; existing CMS records remain authoritative. */
window.MDFlagship = (() => {
  const copy = {
    workerTask: ['Tìm việc', 'Find work', '找工作', '일자리 찾기'],
    employerTask: ['Cần tuyển người', 'Hire staff', '招员工', '인력 채용'],
    homeSearchTitle: ['Tìm việc gần bạn', 'Find work near you', '查找附近职位', '가까운 일자리 찾기'],
    homeKeyword: ['Tên việc', 'Job title', '职位名称', '직무명'],
    homeKeywordExample: ['Ví dụ: kho vận', 'e.g. warehouse', '例如：仓储', '예: 물류'],
    homeArea: ['Khu vực', 'Location', '地区', '지역'],
    homeSearchSubmit: ['Tìm việc', 'Search jobs', '搜索职位', '일자리 검색'],
    workerHeroTitle:['Tìm việc gần bạn.','Find work near you.','寻找附近的工作。','가까운 일자리를 찾으세요.'],
    workerHeroNext:['Rõ việc, an tâm chọn.','Know the work. Choose with confidence.','了解工作，安心选择。','업무를 알고 안심하고 선택하세요.'],
    workerHeroIntro:['Xem nơi làm, khoảng thu nhập và quyền lợi. Chọn một công việc để đọc kỹ điều kiện trước khi đăng ký tư vấn.','See the location, income range and benefits. Choose a job and review its conditions before requesting guidance.','查看工作地点、收入范围和福利。选择职位并了解条件后，再申请咨询。','근무지, 급여 범위와 복지를 확인하세요. 공고의 조건을 살펴본 뒤 상담을 신청할 수 있습니다.'],
    workerGuideLink: ['Cẩm nang tìm việc', 'Job search guide', '求职指南', '구직 가이드'],
    workerHow:['Tìm việc như thế nào?','How to find a job','如何找工作','일자리를 찾는 방법'],
    workerGuideTitle:['Ba bước, rõ điều cần biết.','Three clear steps.','三步，了解关键信息。','세 단계로 명확하게.'],
    workerStep1:['Chọn nơi muốn làm','Choose where to work','选择工作地区','근무 지역 선택'],
    workerStep1Text:['Chọn khu vực hoặc tên việc. Chưa rõ nghề nào? Bạn có thể xem toàn bộ tin.','Choose an area or job keyword. Unsure about the role? Browse all listings.','选择地区或职位关键词。不确定做什么？可以查看所有职位。','지역이나 직무를 선택하세요. 아직 모르겠다면 모든 공고를 볼 수 있습니다.'],
    workerStep2:['Đọc rõ điều kiện','Check the conditions','了解工作条件','근무 조건 확인'],
    workerStep2Text:['Xem thu nhập, ca làm và đi lại. Mục chưa xác nhận sẽ cần hỏi người phụ trách.','Review income, shifts and travel. Ask the coordinator about unconfirmed details.','查看收入、班次与通勤。尚未确认的信息需向负责人咨询。','급여, 근무조와 통근을 확인하고 미확인 사항은 담당자에게 물어보세요.'],
    workerStep3:['Chọn việc, nhờ tư vấn','Choose a job, ask for guidance','选择职位，申请咨询','직무 선택 후 상담'],
    workerStep3Text:['Việc phổ thông không cần CV trong prototype. Bạn xem lại thông tin trước khi hoàn tất mô phỏng.','Worker roles do not require a CV in this prototype. Review your details before completing the simulation.','本原型的普通岗位无需简历。完成模拟前可检查信息。','프로토타입의 일반직 지원에는 이력서가 필요 없습니다. 모의 완료 전에 내용을 검토하세요.'],
    selectedMediaAlt: ["Hình ảnh giới thiệu Minh Đức", "An image introducing Minh Đức", "明德介绍图片", "민득 소개 이미지"],
    teamCaption: ["Đội ngũ Minh Đức trong một hoạt động tập thể", "The Minh Đức team during a group activity", "明德团队集体活动合影", "단체 활동 중인 민득 팀"],
    consultationCaption: ["Hoạt động tư vấn tuyển dụng tại cộng đồng", "A community recruitment consultation", "社区招聘咨询活动", "지역사회 채용 상담 활동"],
    communityCaption: ["Đội ngũ Minh Đức trong một hoạt động kết nối tại cộng đồng", "The Minh Đức team at a community outreach activity", "明德团队参与社区联络活动", "지역사회 교류 활동에 참여한 민득 팀"],
    cultureCaption: ["Khoảnh khắc tập thể của đội ngũ Minh Đức tại văn phòng", "A moment together with the Minh Đức team in the office", "明德团队在办公室的集体时光", "사무실에서 함께한 민득 팀의 순간"],
    fieldFilmTitle: ["Góc nhìn từ chuyến thăm nhà máy", "A glimpse from a factory visit", "工厂走访一瞥", "공장 방문의 한 장면"],
    fieldFilmIntro: ["Khu vực nhà ăn và không gian bên ngoài, qua những thước phim ghi lại tại hiện trường.", "A short look at the cafeteria and outdoor surroundings, recorded on site.", "现场记录的简短影像，呈现食堂区域与室外环境。", "현장에서 촬영한 짧은 영상으로 식당과 외부 공간을 살펴보세요."],
    fieldFilmBody: ["Phim ngắn với âm thanh gốc ghi lại khu vực nhà ăn và không gian bên ngoài trong một chuyến thăm nhà máy.", "A short film with original sound showing the cafeteria and outdoor areas during a factory visit.", "短片保留现场原声，记录一次工厂走访中的食堂与室外区域。", "공장 방문 중 식당과 외부 공간을 현장 음성과 함께 담은 짧은 영상입니다."],
    heroIntro: ['Tuyển đúng người. Tìm đúng việc. Kết nối nhu cầu nhân lực và cơ hội nghề nghiệp tại các khu công nghiệp.', 'The right people. The right opportunities. Connecting workforce needs with careers in industrial parks.', '让人才与岗位相遇。连接工业园区的企业用工需求与求职机会。', '기업에 맞는 인재, 나에게 맞는 일자리. 산업단지의 인력 수요와 취업 기회를 연결합니다.'],
    openBrief: ['Phác thảo nhu cầu', 'Build your brief', '梳理用工需求', '인력 수요 정리'],
    closeBrief: ['Thu gọn', 'Close brief', '收起', '접기'],
    allEnvironments: ['Xem toàn bộ không gian', 'Explore all environments', '查看全部工作环境', '전체 근무 환경 보기'],
    solutionsKicker: ['GIẢI PHÁP DOANH NGHIỆP', 'WORKFORCE SOLUTIONS', '企业用工方案', '기업 인력 솔루션'],
    meetingAlt: ['Trao đổi kế hoạch trong không gian văn phòng', 'A planning conversation in an office', '办公室中的计划讨论', '사무실에서 진행하는 계획 협의'],
    operatorAlt: ['Nhân viên thao tác tại dây chuyền sản xuất', 'An employee working on a production line', '员工在生产线上操作', '생산 라인에서 작업하는 직원'],
    signature: ['CON NGƯỜI. KẾT NỐI. TƯƠNG LAI.', 'PEOPLE. CONNECTION. POSSIBILITY.', '人才。连接。未来。', '사람. 연결. 가능성.'],
    solutions: ['Giải pháp từ\nnhu cầu của bạn.', 'Solutions shaped\naround your needs.', '从您的需求出发，\n寻找合适方案。', '필요에서 시작하는\n인력 솔루션.'],
    solutionsIntro: ['Mỗi doanh nghiệp có một nhịp vận hành riêng. Cùng làm rõ bài toán nhân lực để chọn cách phối hợp phù hợp.', 'Every business works at its own pace. Start with your workforce needs and explore the right way to work together.', '每家企业都有自己的运营节奏。从用工需求出发，探索合适的合作方式。', '기업마다 운영 방식이 다릅니다. 인력 수요를 정리하고 적합한 협력 방식을 찾아보세요.'],
    allSolutions: ['Xem các giải pháp', 'Explore all solutions', '查看全部方案', '전체 솔루션 보기'],
    serviceNumber: ['Giải pháp', 'Solution', '方案', '솔루션'],
    people: ['NHÂN LỰC LÀ TÀI SẢN', 'PEOPLE ARE OUR FOUNDATION', '人才是宝贵的资产', '사람이 가장 큰 자산입니다'],
    storyLink: ['Câu chuyện Minh Đức', 'The Minh Đức story', '了解明德', '민득 이야기'],
    processKicker: ['CÁCH CHÚNG TA BẮT ĐẦU', 'HOW WE BEGIN', '如何开始合作', '협력의 시작'],
    processTitle: ['Một nhu cầu rõ ràng.\nMột hướng đi phù hợp.', 'A clear brief.\nA purposeful next step.', '明确需求。\n找到合适方向。', '명확한 수요.\n적합한 다음 단계.'],
    processIntro: ['Từ cuộc trao đổi đầu tiên đến phương án phối hợp, mỗi bước đều hướng tới sự rõ ràng cho cả hai bên.', 'From the first conversation to an agreed approach, each step creates clarity for both sides.', '从首次沟通到商定合作方案，每一步都帮助双方达成清晰共识。', '첫 상담부터 협력 방안까지, 각 단계에서 양측의 이해를 명확하게 합니다.'],
    process1: ['Lắng nghe bối cảnh', 'Understand the context', '了解业务背景', '현황 이해'],
    process1Text: ['Vị trí cần tuyển, địa bàn, ca làm và những điều doanh nghiệp đang ưu tiên.', 'Roles, locations, shifts and the priorities that matter to your business.', '需要招聘的岗位、地区、班次以及企业当前的重点。', '채용 직무, 지역, 교대 근무와 기업의 우선 과제를 파악합니다.'],
    process2: ['Làm rõ phương án', 'Shape the approach', '明确合作方案', '방안 구체화'],
    process2Text: ['Cùng xem xét tiêu chí, phạm vi công việc, lộ trình và đầu mối phối hợp.', 'Discuss criteria, scope, timing and the people coordinating the work.', '共同讨论标准、工作范围、时间安排和对接人员。', '기준, 업무 범위, 일정과 협력 담당자를 함께 검토합니다.'],
    process3: ['Kết nối bước tiếp theo', 'Agree the next step', '确定下一步', '다음 단계 협의'],
    process3Text: ['Thống nhất những thông tin cần bổ sung và cách trao đổi trong quá trình triển khai.', 'Agree what information is needed next and how to stay connected during delivery.', '商定需要补充的信息及实施过程中的沟通方式。', '추가로 필요한 정보와 진행 중 소통 방식을 정합니다.'],
    exploreWork: ['CÔNG VIỆC & CUỘC SỐNG', 'WORK & POSSIBILITY', '工作与生活', '일과 가능성'],
    workTitle: ['Để mỗi ngày đi làm\nlà một bước tiến.', 'Make your next role\na step forward.', '让每一天的工作\n成为向前的一步。', '매일의 일이\n앞으로 나아가는 한 걸음.'],
    workIntro: ['Bắt đầu từ những điều thiết thực: công việc gì, ở đâu, thu nhập ra sao và quyền lợi nào dành cho bạn.', 'Start with what matters: the work, the location, the pay and the benefits available to you.', '从实际问题开始：做什么、在哪里、收入如何，以及有哪些福利。', '업무, 근무지, 급여와 복지처럼 중요한 정보부터 확인하세요.'],
    opportunities: ['CƠ HỘI ĐANG MỞ', 'EXPLORE OPPORTUNITIES', '探索工作机会', '채용 기회 살펴보기'],
    jobsTitle: ['Tìm nơi bạn\nmuốn bắt đầu.', 'Find where you\nwant to begin.', '找到您想要\n开始的地方。', '시작하고 싶은\n곳을 찾아보세요.'],
    knowledge: ['GÓC NHÌN & CẨM NANG', 'PERSPECTIVES & GUIDES', '观点与指南', '인사이트 & 가이드'],
    newsTitle: ['Hiểu thêm hôm nay.\nVững bước ngày mai.', 'A little more insight.\nA better next step.', '今天多一分了解。\n明天更从容前行。', '오늘의 이해가\n내일의 자신감으로.'],
    galleryLink: ['Khám phá không gian làm việc', 'Explore working environments', '探索工作环境', '근무 환경 살펴보기'],
    briefKicker: ['TỪ NHU CẦU ĐẾN CUỘC TRAO ĐỔI', 'FROM A BRIEF TO A CONVERSATION', '从需求到沟通', '수요에서 상담으로'],
    briefTitle: ['Cùng phác thảo\nnhu cầu của bạn.', 'Let’s shape\nyour workforce brief.', '一起梳理\n您的用工需求。', '인력 수요를\n함께 정리해 보세요.'],
    briefIntro: ['Chọn ngành, quy mô và địa bàn. Những thông tin này sẽ đi cùng bạn sang bước liên hệ.', 'Choose your industry, team size and location. Your selections carry through to the contact form.', '选择行业、规模和地区，相关信息将带入联系表单。', '업종, 규모와 지역을 선택하세요. 선택한 내용은 문의 양식으로 전달됩니다.'],
    aboutTitle: ['Kết nối con người.\nMở ra cơ hội.', 'Connecting people.\nOpening possibilities.', '连接人才。\n开启机遇。', '사람을 연결하고,\n가능성을 열어갑니다.'],
    aboutIntro: ['Minh Đức hướng đến sự kết nối rõ ràng giữa nhu cầu của doanh nghiệp và mong muốn của người lao động.', 'Minh Đức aims to connect business needs with the aspirations of people looking for work.', '明德致力于将企业需求与求职者的期望清晰连接。', '민득은 기업의 수요와 구직자의 희망을 연결하고자 합니다.'],
    values: ['ĐIỀU CHÚNG TÔI COI TRỌNG', 'WHAT MATTERS TO US', '我们重视的价值', '우리가 중요하게 생각하는 것'],
    valuesTitle: ['Sự tin cậy bắt đầu\ntừ cách làm việc.', 'Trust begins with\nthe way we work.', '信任，始于\n做事的方式。', '신뢰는 일하는\n방식에서 시작됩니다.'],
    value1: ['Thông tin rõ ràng', 'Clarity', '信息清晰', '명확한 정보'],
    value1Text: ['Công việc, điều kiện và bước tiếp theo cần được giải thích dễ hiểu.', 'Work, requirements and next steps should be easy to understand.', '工作内容、条件及下一步安排应当清晰易懂。', '업무, 조건과 다음 단계를 쉽게 이해할 수 있어야 합니다.'],
    value2: ['Tôn trọng con người', 'Respect', '尊重人才', '사람에 대한 존중'],
    value2Text: ['Mỗi lựa chọn việc làm bắt đầu từ nhu cầu và hoàn cảnh của một con người.', 'Every career decision starts with a person’s needs and circumstances.', '每一次职业选择，都始于一个人的需求和处境。', '모든 취업 선택은 한 사람의 필요와 상황에서 시작됩니다.'],
    value3: ['Phối hợp có trách nhiệm', 'Accountability', '负责任的合作', '책임 있는 협력'],
    value3Text: ['Làm rõ phạm vi, đầu mối và cách trao đổi để hai bên cùng chủ động.', 'Define scope, contacts and communication so both sides can move forward.', '明确范围、对接人和沟通方式，让双方都能主动推进。', '범위, 담당자와 소통 방식을 정해 양측이 능동적으로 진행합니다.'],
    serviceScope: ['CHỌN GIẢI PHÁP PHÙ HỢP', 'FIND THE RIGHT APPROACH', '选择适合的方案', '적합한 방안 찾기'],
    servicesTitle: ['Chọn giải pháp nhân lực', 'Choose a workforce solution', '选择用工方案', '인력 솔루션 선택'],
    servicesIntro: ['Khám phá các hướng phối hợp từ cung ứng lao động đến tuyển dụng theo nhu cầu. Bắt đầu bằng bài toán cụ thể của doanh nghiệp.', 'Explore approaches from workforce supply to tailored recruitment. Begin with your specific business challenge.', '探索从劳动力供应到按需招聘的合作方向，从企业的具体问题开始。', '인력 공급부터 맞춤 채용까지 협력 방식을 살펴보세요. 기업의 구체적인 과제에서 시작합니다.'],
    talk: ['Tư vấn nhân lực', 'Discuss staffing', '用工咨询', '인력 상담'],
    findWork: ['Tìm việc ngay', 'Find a job', '寻找工作', '일자리 찾기'],
    clarity1: ['Rõ công việc', 'Clear roles', '明确工作', '명확한 업무'],
    clarity1Text: ['Vị trí, nhiệm vụ, địa điểm và ca làm trước khi lựa chọn.', 'Role, tasks, location and shifts before making a choice.', '选择之前，先明确岗位、职责、地点和班次。', '선택 전에 직무, 업무, 근무지와 교대를 확인합니다.'],
    clarity2: ['Rõ điều kiện', 'Clear conditions', '明确条件', '명확한 조건'],
    clarity2Text: ['Thu nhập, quyền lợi và yêu cầu được xem cùng nhau.', 'Consider pay, benefits and requirements together.', '同时了解收入、福利与任职要求。', '급여, 복지와 지원 요건을 함께 살펴봅니다.'],
    clarity3: ['Rõ người phụ trách', 'Clear responsibilities', '明确负责人', '명확한 담당자'],
    clarity3Text: ['Biết ai xác nhận thông tin và bước tiếp theo là gì.', 'Know who confirms the details and what happens next.', '清楚由谁确认信息，以及下一步如何进行。', '누가 내용을 확인하고 다음에 무엇을 할지 정합니다.'],
    approachKicker: ['CÁCH PHỐI HỢP ĐƯỢC GIỚI THIỆU', 'OUR APPROACH TO COORDINATION', '我们介绍的协作方式', '협력 방식 안내'],
    approachTitle: ['Một kết nối tốt\nbắt đầu từ thông tin rõ.', 'A good connection\nstarts with clarity.', '良好的连接，\n始于清晰的信息。', '좋은 연결은\n명확한 정보에서 시작됩니다.'],
    approachIntro: ['Doanh nghiệp cần người phù hợp với công việc. Người lao động cần hiểu công việc có phù hợp với mình. Minh Đức bắt đầu từ điểm chung đó: làm rõ kỳ vọng của hai phía trước khi đi tiếp.', 'Businesses need people who fit the role. Jobseekers need to know whether the role fits their lives. Minh Đức starts with that shared need: clarify expectations on both sides before moving forward.', '企业需要适合岗位的人，求职者需要了解岗位是否适合自己。明德从这一共同需求出发：在推进之前，先明确双方的期望。', '기업은 직무에 맞는 인재가 필요하고, 구직자는 자신의 상황에 맞는 일인지 알아야 합니다. 민득은 이 공통된 필요에서 출발해 다음 단계 전에 양측의 기대를 명확히 합니다.'],
    approachCaption: ['Từ nhu cầu đến kế hoạch phối hợp.', 'From a need to a shared plan.', '从需求到协作计划。', '수요에서 협력 계획까지.'],
    seeApproach: ['Xem cách phối hợp', 'See how coordination works', '了解协作方式', '협력 방식 보기'],
    caseKicker: ['TÌNH HUỐNG MINH HỌA', 'ILLUSTRATIVE SCENARIO', '示例情境', '협력 예시'],
    caseTitle: ['Khi nhà máy cần bổ sung\nnhân lực cho một ca sản xuất.', 'When a factory needs\npeople for a production shift.', '当工厂需要为\n一个生产班次补充人员时。', '공장의 생산 교대에\n추가 인력이 필요할 때.'],
    caseIntro: ['Trước khi đăng tin, cần thống nhất nhu cầu thực tế, điều kiện làm việc và cách xác nhận người được tiếp nhận. Đây là ví dụ về cách phối hợp, không phải hồ sơ khách hàng đã triển khai.', 'Before publishing a role, agree the actual need, working conditions and how arrivals will be confirmed. This example explains a coordination process; it is not a completed client case.', '发布岗位前，需要确认实际需求、工作条件及人员接收确认方式。这是协作流程示例，并非已完成的客户案例。', '공고를 게시하기 전에 실제 수요, 근무 조건과 입사 확인 방식을 정합니다. 협력 과정을 설명하는 예시이며 실제 고객 수행 사례는 아닙니다.'],
    role1: ['Doanh nghiệp xác nhận', 'The business confirms', '企业确认', '기업이 확인할 사항'],
    role1Text: ['Vị trí, số lượng, ca làm và ngày cần người. Một đầu mối duyệt điều kiện và xác nhận các thay đổi.', 'Roles, headcount, shifts and start date. One contact approves conditions and confirms changes.', '岗位、人数、班次及到岗日期。指定一位负责人审批条件并确认变更。', '직무, 인원, 교대와 출근 예정일을 확인합니다. 담당자가 조건을 승인하고 변경 사항을 확인합니다.'],
    role2: ['Minh Đức phối hợp', 'Minh Đức coordinates', '明德协调', '민득의 협력 역할'],
    role2Text: ['Tổng hợp thông tin thành yêu cầu rõ ràng, đối chiếu điều kiện với ứng viên và ghi nhận phần cần xác minh trước khi giới thiệu.', 'Turn the information into a clear brief, discuss conditions with candidates and record questions to resolve before introductions.', '将信息整理为清晰需求，与候选人核对条件，并记录推荐前需要核实的问题。', '정보를 명확한 채용 요청으로 정리하고 지원자와 조건을 확인하며 소개 전에 확인할 사항을 기록합니다.'],
    role3: ['Người lao động lựa chọn', 'The jobseeker decides', '求职者选择', '구직자가 선택할 사항'],
    role3Text: ['Xem công việc, thu nhập và đường đi; trao đổi điều chưa rõ; xác nhận khả năng nhận việc sau khi hiểu đủ điều kiện.', 'Review the work, pay and commute; ask about unclear details; confirm availability after understanding the conditions.', '了解工作、收入和通勤，询问不清楚的事项，在充分理解条件后确认能否到岗。', '업무, 급여와 통근을 살펴보고 궁금한 점을 묻습니다. 조건을 충분히 이해한 뒤 근무 가능 여부를 확인합니다.'],
    handoffTitle: ['Trước ngày nhận việc, cùng chốt ba điều.', 'Before the first day, confirm three things.', '到岗之前，共同确认三件事。', '첫 출근 전에 세 가지를 확인합니다.'],
    handoff1: ['Địa điểm, thời gian và người đón tiếp.', 'Where to go, when to arrive and whom to meet.', '到岗地点、时间及接待人。', '출근 장소, 시간과 맞이할 담당자.'],
    handoff2: ['Hồ sơ cần mang và điều kiện đã thống nhất.', 'Required documents and the agreed conditions.', '需携带的材料及已商定的条件。', '지참 서류와 합의된 근무 조건.'],
    handoff3: ['Đầu mối cập nhật nếu kế hoạch thay đổi.', 'The contact to update if plans change.', '计划变化时需要联系的负责人。', '계획이 변경될 때 연락할 담당자.'],
    caseAction: ['Chọn giải pháp cho doanh nghiệp', 'Find a workforce solution', '选择企业用工方案', '기업 인력 솔루션 선택'],
    browseArea: ['Khám phá theo khu vực', 'Explore by location', '按地区浏览', '지역별 살펴보기'],
    sampleSearch: ['Tin mẫu theo khu vực', 'Sample jobs by location', '按地区查看示例职位', '지역별 예시 채용 공고'],
    connectionKicker: ['MỘT CA LÀM BẮT ĐẦU TỪ ĐÂU?', 'BEFORE THE FIRST SHIFT', '一班工作，从何开始？', '첫 근무가 시작되기 전에'],
    connectionTitle: ['Hiểu công việc.\nAn tâm bắt đầu.', 'Know the work.\nStart with confidence.', '了解工作。\n安心开始。', '업무를 이해하고,\n안심하며 시작하세요.'],
    connectionIntro: ['Một lựa chọn việc làm không chỉ nằm ở tên vị trí. Đó còn là môi trường, điều kiện và những người sẽ cùng bạn làm việc.', 'A role is more than a job title. It is the environment, the conditions and the people you will work with.', '选择工作，不只是选择一个岗位名称，还要了解工作环境、条件以及一起共事的人。', '일자리 선택은 직무명만의 문제가 아닙니다. 환경, 근무 조건과 함께 일할 사람도 중요합니다.'],
    connection1: ['Bắt đầu từ công việc', 'Begin with the work', '从工作内容开始', '업무부터 확인'],
    connection1Text: ['Xem nhiệm vụ, ca làm và yêu cầu trước khi gửi thông tin.', 'Review tasks, shifts and requirements before applying.', '申请前，先了解任务、班次与岗位要求。', '지원 전에 업무, 교대와 요건을 살펴보세요.'],
    connection2: ['Hình dung nơi làm việc', 'Picture the workplace', '了解工作场所', '근무 환경 이해'],
    connection2Text: ['Đối chiếu địa điểm, đường đi và điều kiện sinh hoạt.', 'Consider the location, commute and living arrangements.', '核对地点、通勤方式与生活条件。', '근무지, 통근과 생활 조건을 확인하세요.'],
    connection3: ['Biết bước tiếp theo', 'Know what comes next', '明确下一步', '다음 단계 확인'],
    connection3Text: ['Chuẩn bị điều cần hỏi và xác nhận đầu mối hỗ trợ.', 'Prepare your questions and confirm your point of contact.', '准备需要咨询的问题，并确认联系负责人。', '궁금한 점을 준비하고 담당자를 확인하세요.'],
    connectionNote: ['Hình ảnh minh họa cho hành trình trải nghiệm.', 'Illustrative imagery for the prototype journey.', '用于原型体验流程的示例图片。', '프로토타입 여정을 위한 예시 이미지입니다.'],
  };

  function render(view, api) {
    const { getData, getLang, C, V, T, E, I, localize, sectionHead, cardJob, cardPost, galleryHTML, videoBlock, emptyJobs, partnerSection, serviceExplorer, staffingCalculator, crumb } = api;
    const db = getData(), h = db.home, sec = h.sections || {}, lang = getLang(), idx = {vi:0,en:1,zh:2,ko:3}[lang] || 0;
    const F = key => E(copy[key]?.[idx] || copy[key]?.[0] || key);
    const localized = arr => E(arr[idx] || arr[0]);
    const services = window.MD14.services;
    const cta = () => `<section class="section md-cta"><div class="container md-cta-inner"><div><div class="eyebrow">MINH ĐỨC / NEXT CHAPTER</div><h2>${C('ctaTitle')}</h2></div><div><p>${C('ctaDesc')}</p><div class="md-cta-actions"><a href="viec-lam.html" class="btn red">${F('findWork')}${I('arrow','sm')}</a><a href="lien-he.html" class="btn light">${F('talk')}${I('arrow','sm')}</a></div></div></div></section>`;
    const story = () => {const gallery=h.gallery||[],indices=sec.gallery?[3,0,2]:[];return `<section class="section md-connection-story" id="${sec.gallery?'gallery':'home-story'}"><div class="container"><div class="md-connection-heading"><div><div class="eyebrow">${F('connectionKicker')}</div><h2>${sec.about?E(localize('home','main','aboutTitle',h.aboutTitle)||copy.connectionTitle[idx]):E(localize('home','main','galleryTitle',h.galleryTitle)||copy.workTitle[idx])}</h2></div><p>${sec.about?E(localize('home','main','aboutIntro',h.aboutIntro)||copy.connectionIntro[idx]):F('workIntro')}</p></div><div class="md-connection-grid">${indices.map((index,order)=>{const media=gallery[index];return `<article>${media?`<figure><img data-media-key="gallery${index}" src="${E(api.imgSrc(media.src))}" alt="${E(media.caption||F('connection'+(order+1)))}" width="1000" height="750" loading="lazy" decoding="async">${media.caption&&media.caption!==api.defaultHome?.gallery?.[index]?.caption?`<figcaption>${E(media.caption)}</figcaption>`:''}</figure>`:''}<div class="md-connection-caption"><span aria-hidden="true">0${order+1}</span><div><h3>${F('connection'+(order+1))}</h3><p>${F('connection'+(order+1)+'Text')}</p></div></div></article>`;}).join('')}</div>${sec.gallery?`<details class="md-gallery-archive"><summary>${F('allEnvironments')}${I('plus','sm')}</summary>${galleryHTML()}</details>`:''}<div class="md-connection-footer"><p>${F('connectionNote')}</p><a class="link" href="ve-minh-duc.html#cach-phoi-hop">${F('storyLink')}${I('arrow','sm')}</a></div></div></section>`;};
    if (view === 'services') return `<section class="v14-page-intro"><div class="container">${crumb('Dịch vụ')}<div class="eyebrow">${F('serviceScope')}</div><h1>${F('servicesTitle')}</h1><p>${F('servicesIntro')}</p></div></section><section class="section v14-service-section"><div class="container">${serviceExplorer()}<p class="v14-service-note">${I('shield','sm')}${V('serviceNote')}</p></div></section><section class="section brief-section" id="workforce"><div class="container brief-layout"><div><div class="eyebrow">${F('briefKicker')}</div><h2>${F('briefTitle')}</h2><p>${F('briefIntro')}</p><figure><img src="assets/gallery-meeting.webp" alt="${F('meetingAlt')}" width="1448" height="1086" loading="lazy" decoding="async"></figure></div>${staffingCalculator()}</div></section>`;
    if (view === 'about') return `<section class="v14-page-intro md-about-intro"><div class="container">${crumb('V\u1ec1 Minh \u0110\u1ee9c')}<div class="eyebrow">${F('people')}</div><h1>${F('aboutTitle')}</h1><p>${F('aboutIntro')}</p><a class="link" href="#cach-phoi-hop">${F('seeApproach')}${I('arrow','sm')}</a></div></section><section class="section md-approach" id="cach-phoi-hop"><div class="container"><div class="md-approach-opening"><div><div class="eyebrow">${F('approachKicker')}</div><h2>${F('approachTitle')}</h2><p>${F('approachIntro')}</p></div><figure><img src="assets/gallery-meeting.webp" alt="${F('meetingAlt')}" width="1448" height="1086" loading="lazy" decoding="async"><figcaption>${F('approachCaption')}</figcaption></figure></div><div class="md-clarity-grid" id="values">${[1,2,3].map(n=>`<article><span class="md-clarity-number">0${n}</span><h3>${F('clarity'+n)}</h3><p>${F('clarity'+n+'Text')}</p></article>`).join('')}</div></div></section><section class="section md-coordination-case"><div class="container"><div class="section-head"><div><div class="eyebrow">${F('caseKicker')}</div><h2>${F('caseTitle')}</h2></div><p class="section-intro">${F('caseIntro')}</p></div><ol class="md-responsibility-grid">${[1,2,3].map(n=>`<li><span class="md-role-number">0${n}</span><h3>${F('role'+n)}</h3><p>${F('role'+n+'Text')}</p></li>`).join('')}</ol><div class="md-handoff"><h3>${F('handoffTitle')}</h3><ul>${[1,2,3].map(n=>`<li>${I('check','sm')}<span>${F('handoff'+n)}</span></li>`).join('')}</ul><a class="link" href="dich-vu.html">${F('caseAction')}${I('arrow','sm')}</a></div></div></section><section class="section tint" id="gallery"><div class="container">${sectionHead(C('galleryKicker'),C('galleryTitle'))}<p class="section-intro">${C('galleryDesc')}</p>${galleryHTML()}${h.videoUrl?`<div class="about-video">${videoBlock(h.videoUrl,h.videoPoster)}</div>`:''}</div></section>${cta()}`;
    if (view !== 'home') throw new Error('Unknown flagship view');
    const heroImage = h.heroImg || 'hero-photo.webp';
    const illustrativeHero = ['hero-photo.webp','assets/hero-photo.webp','hero-photo.jpg','assets/hero-photo.jpg'].includes(heroImage);
    const openWorkerAreas = [...new Set(db.jobs.filter(job => job.open && job.type === 'worker').map(job => job.location))];
    const search = `<section class="md-search" id="find-work" aria-labelledby="home-search-title">
      <div class="md-search-inner">
        <h2 class="md-search-title" id="home-search-title">${I('search')}<span>${F('homeSearchTitle')}</span></h2>
        <form class="md-search-form" action="viec-lam.html" role="search" aria-labelledby="home-search-title">
          <input type="hidden" name="lang" value="${E(lang)}">
          <div>
            <label for="homeQuery">${F('homeKeyword')}</label>
            <input id="homeQuery" name="q" placeholder="${F('homeKeywordExample')}" autocomplete="off">
          </div>
          <div>
            <label for="homeArea">${F('homeArea')}</label>
            <select id="homeArea" name="area">
              <option value="">${C('allArea')}</option>
              ${openWorkerAreas.map(area => `<option value="${E(area)}">${E(area)}</option>`).join('')}
            </select>
          </div>
          <button type="submit" class="btn red">${F('homeSearchSubmit')}${I('arrow','sm')}</button>
        </form>
        <div class="md-search-discovery">
          <p>${F('sampleSearch')}</p>
          <nav class="md-area-links" aria-label="${F('browseArea')}">
            ${openWorkerAreas.map(area => `<a href="viec-lam.html?${E(new URLSearchParams({area,lang}).toString())}">${E(area)}${I('arrow','sm')}</a>`).join('')}
          </nav>
        </div>
      </div>
    </section>`;
    let html = `<div class="md-home-opening">
      <section class="md-hero">
        <div class="container md-hero-grid">
          <div class="md-hero-copy">
            <div class="md-audience" role="tablist" aria-label="${F('workerTask')} / ${F('employerTask')}">
              <button type="button" class="active" role="tab" id="persona-candidate" aria-selected="true" aria-controls="panel-candidate" tabindex="0" data-persona="candidate">${F('workerTask')}</button>
              <button type="button" role="tab" id="persona-business" aria-selected="false" aria-controls="panel-business" tabindex="-1" data-persona="business">${F('employerTask')}</button>
            </div>
            <div class="eyebrow">${F('signature')}</div>
            <div class="md-hero-panel" role="tabpanel" id="panel-candidate" aria-labelledby="persona-candidate"><h1>${F('workerHeroTitle')}<span>${F('workerHeroNext')}</span></h1>
              <p>${F('workerHeroIntro')}</p>
              <div class="hero-buttons">
                <a class="btn blue" href="#find-work">${F('workerTask')}${I('search','sm')}</a>
                <a class="hero-text-link" href="#worker-guide">${F('workerGuideLink')}${I('arrow','sm')}</a>
              </div>
              <p class="md-hero-note">${I('check','sm')}${C('noCv')}</p>
            </div>
            <div class="md-hero-panel" role="tabpanel" id="panel-business" aria-labelledby="persona-business" hidden>
              <h2 class="md-hero-heading">${E(localize('home','main','heroLine1',h.heroLine1))}<span>${E(localize('home','main','heroLine2',h.heroLine2))}</span></h2>
              <p>${E(localize('home','main','heroIntro',h.heroIntro))}</p>
              <div class="hero-buttons">
                <a class="btn blue" href="dich-vu.html?${E(new URLSearchParams({lang}).toString())}">${F('allSolutions')}${I('arrow','sm')}</a>
                <a class="hero-text-link" href="#workforce">${F('talk')}${I('arrow','sm')}</a>
              </div>
              <p class="md-hero-note">${I('check','sm')}${C('bizTrust')}</p>
            </div>
          </div>
          ${search}
          <figure class="md-visual">
            <div class="md-visual-frame"><img class="md-hero-img" src="${E(api.imgSrc(heroImage))}" alt="${illustrativeHero?C('heroAlt'):F('selectedMediaAlt')}" width="1672" height="941" fetchpriority="high" decoding="async"></div>
            <figcaption class="md-visual-caption"><span>${C('imageCaption')}</span></figcaption>
          </figure>
        </div>
      </section>
    </div>`;
    if(sec.jobs) html += `<section class="section opportunities-section"><div class="container">${sectionHead(F('opportunities'),F('jobsTitle'),'viec-lam.html',C('allJobs'))}<div class="jobs-grid">${db.jobs.filter(j=>j.type==='worker'&&j.open).slice(0,3).map(cardJob).join('')||emptyJobs()}</div><p class="md-context-note">${I('shield','sm')}${C('sampleJobs')}</p></div></section>`;
    html += `<section id="worker-guide" class="md-worker-guide container" aria-labelledby="worker-guide-title"><div><span class="eyebrow">${F('workerHow')}</span><h2 id="worker-guide-title">${F('workerGuideTitle')}</h2></div><ol>${[1,2,3].map(n=>`<li><b>0${n} · ${F('workerStep'+n)}</b><p>${F('workerStep'+n+'Text')}</p></li>`).join('')}</ol></section>`;
    html += window.MDCompanyLocations?.html(db,'home',lang)||'';
    if(sec.stats) html += `<div class="container md-principles">${[1,2,3].map(n=>`<div class="md-principle"><span>0${n}</span><div><b>${F('clarity'+n)}</b><p>${F('clarity'+n+'Text')}</p></div></div>`).join('')}</div>`;
    html += `<section class="section solutions-section" id="solutions"><div class="container solutions-layout"><div class="solutions-intro"><div class="eyebrow">${F('solutionsKicker')}</div><h2>${F('solutions')}</h2><p>${F('solutionsIntro')}</p><a href="dich-vu.html" class="link">${F('allSolutions')}${I('arrow','sm')}</a></div><div class="solutions-list">${services.map((s,i)=>`<a class="solution-row" href="dich-vu.html?service=${E(s.id)}${lang==='vi'?'':'&lang='+E(lang)}"><span class="solution-number">0${i+1}</span><div><h3>${localized(s.name)}</h3><p>${localized(s.desc)}</p></div><span class="solution-arrow">${I('arrow')}</span></a>`).join('')}</div><div class="md-solutions-brief" id="workforce"><details class="home-brief-disclosure"><summary><span><span class="eyebrow">${F('briefKicker')}</span><span class="home-brief-title">${F('briefTitle')}</span><span class="home-brief-description">${F('briefIntro')}</span></span><span class="home-brief-action"><span class="brief-open-label">${F('openBrief')}</span><span class="brief-close-label">${F('closeBrief')}</span>${I('arrow')}</span></summary>${staffingCalculator()}</details></div></div></section>`;
    if(sec.about||sec.gallery) html += story();
    if(sec.video && h.videoUrl) html += `<section class="section md-video-section" id="video"><div class="container video-layout"><div><h2>${E(localize('home','main','videoTitle',h.videoTitle))}</h2><p>${E(localize('home','main','videoIntro',h.videoIntro))}</p></div>${videoBlock(h.videoUrl,h.videoPoster)}</div></section>`;
    if(sec.partners) html += partnerSection();
    if(sec.news) html += `<section class="section insights-section"><div class="container">${sectionHead(F('knowledge'),F('newsTitle'),'tin-tuc.html',C('allNews'))}<div class="news-grid">${db.posts.filter(p=>p.visible&&p.type!=='video').slice(0,3).map((post,index)=>cardPost(post,index>0)).join('')}</div></div></section>`;
    html += `<section class="section faq-section" id="faq"><div class="container faq-layout"><div><div class="eyebrow">${C('faqKicker')}</div><h2>${T('FAQTitle')}</h2></div><div class="faq-items">${[1,2,3].map(n=>`<details><summary>${T('FAQQ'+n)}<span aria-hidden="true">+</span></summary><p>${T('FAQA'+n)}</p></details>`).join('')}</div></div></section>`;
    if(sec.cta) html += cta();
    return html;
  }
  return { render, copy };
})();
