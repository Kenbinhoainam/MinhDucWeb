/* Minh Đức assistant prototype. No persistence, remote AI, or form submission. */
(() => {
  'use strict';
  if (window.MDAssistant) return;
  const locales = ['vi', 'en', 'zh', 'ko'];
  const copy = {
    vi: {
      launcher: 'Trợ lý demo', title: 'Cùng bạn tìm bước tiếp theo', badge: 'TRỢ LÝ · DEMO', close: 'Đóng trợ lý',
      intro: 'Trợ lý tra cứu tin việc làm mẫu trên website. Không gửi hay lưu hội thoại.',
      chat: 'Hỏi nhanh', voice: 'Thử ứng tuyển bằng giọng nói', question: 'Câu hỏi của bạn', send: 'Gửi câu hỏi',
      placeholder: 'Ví dụ: Tôi muốn tìm việc tại Bắc Ninh', empty: 'Hãy nhập câu hỏi (tối đa 500 ký tự).',
      prompts: ['Tìm việc phù hợp', 'Lương & phúc lợi', 'Liên hệ doanh nghiệp', 'Gặp người tư vấn'],
      replies: [
        'Demo: đây là các tin đang mở trong danh sách mẫu. Mở nguồn để xem chi tiết và xác nhận thông tin với bộ phận tuyển dụng.',
        'Demo: khoảng thu nhập lấy từ tin mẫu để tham khảo. Hãy xác nhận lương cơ bản, phụ cấp và tăng ca với bộ phận tuyển dụng.',
        'Demo: trao đổi nhu cầu nhân lực qua trang liên hệ. Trợ lý chưa gửi yêu cầu đến doanh nghiệp.',
        'Demo: bạn có thể mở trang liên hệ để xem bước tư vấn tiếp theo. Chưa có tư vấn viên trực tuyến hoặc cuộc chuyển tiếp nào được thực hiện.',
        'Demo: bạn có thể hỏi theo tên vị trí, khu vực hoặc khu công nghiệp, hoặc chọn một câu hỏi gợi ý.'
      ], jobs: 'Xem các việc làm', contact: 'Mở trang liên hệ', salaryUnit: 'triệu VNĐ/tháng',
      source: 'Nguồn: tin mẫu',
      noListings: 'Demo: hiện chưa có tin đang mở trong danh sách mẫu. Bạn có thể xem trang việc làm.',
      noMatch: 'Demo: tôi chưa tìm được tin đang mở trong danh sách mẫu đáp ứng câu hỏi này. Bạn có thể xem danh sách việc làm hoặc liên hệ để xác nhận.',
      noPay: 'Demo: các tin mẫu bên dưới chưa có khoảng thu nhập để hiển thị. Hãy hỏi bộ phận tuyển dụng để xác nhận.',
      noForm: 'Chọn một tin việc làm và mở trợ lý tại biểu mẫu ứng tuyển để thử điền bằng giọng nói.',
      privacy: 'Chỉ dùng dữ liệu mẫu. Câu trả lời chỉ ở bộ nhớ của trang và được xóa khi đóng trợ lý. Micro chỉ bật khi bạn chọn bên dưới và cấp quyền. Chỉ dùng nhận dạng trên thiết bị; không tải gói ngôn ngữ hay gửi âm thanh lên dịch vụ.',
      voiceIntro: 'Trả lời từng mục → xem lại bản chép lời → xác nhận điền. Bạn tự kiểm tra và gửi biểu mẫu sau đó.',
      transcript: 'Bản chép lời / nhập câu trả lời', mic: 'Cho phép & bật micro trên thiết bị', stop: 'Dừng micro', sample: 'Dùng câu trả lời mẫu',
      next: 'Tiếp tục', back: 'Quay lại', review: 'Xem lại câu trả lời', edit: 'Sửa câu trả lời', confirm: 'Xác nhận & điền biểu mẫu',
      reviewTitle: 'Kiểm tra trước khi điền', reviewNote: 'Xác nhận sẽ thay các trường bên dưới trong biểu mẫu hiện tại. Không tự gửi; không chọn ô đồng ý hay đính kèm CV.',
      filled: 'Đã điền. Chưa gửi ứng tuyển. Hãy kiểm tra biểu mẫu, CV (nếu cần) và tự chọn ô đồng ý.',
      formChanged: 'Biểu mẫu đã thay đổi. Đóng và mở lại trợ lý tại tin việc làm bạn muốn ứng tuyển.',
      unsupported: 'Nhận dạng giọng nói trên thiết bị chưa sẵn sàng. Bạn có thể gõ hoặc dùng câu mẫu; micro chưa bật.',
      denied: 'Không thể bật micro hoặc quyền đã bị từ chối. Hãy gõ hoặc dùng câu mẫu.',
      listening: 'Đang nghe trên thiết bị… Tự dừng sau 30 giây.', stopped: 'Đã dừng micro. Kiểm tra câu trả lời trước khi tiếp tục.',
      pending: 'Đang kiểm tra nhận dạng trên thiết bị…', noSpeech: 'Chưa nhận được lời nói. Hãy thử lại, gõ hoặc dùng câu mẫu.',
      labels: { name: 'Họ và tên', phone: 'Số điện thoại', area: 'Khu vực mong muốn', desired: 'Nơi làm việc mong muốn', shift: 'Ca làm', shuttle: 'Cần xe đưa đón' },
      hints: { name: 'Chỉ nhập họ tên (2–100 ký tự).', phone: 'Số Việt Nam bắt đầu bằng 03, 05, 07, 08, 09 hoặc +84.', area: 'Chọn đúng một khu vực có trong biểu mẫu.', desired: 'Nhập tỉnh hoặc khu công nghiệp (tối đa 120 ký tự).', shift: 'Chọn ca ngày, ca đêm hoặc linh hoạt.', shuttle: 'Trả lời có hoặc không.' },
      invalid: 'Câu trả lời chưa hợp lệ. ', day: 'Ca ngày', night: 'Ca đêm', flexible: 'Linh hoạt', yes: 'Có', no: 'Không', sampleName: 'Ứng viên Demo', progress: 'Mục', of: '/', welcome: 'Demo: bạn cần tìm việc, xem thu nhập hay trao đổi nhu cầu nhân lực?'
    },
    en: {
      launcher: 'Demo assistant', title: 'Find your next step', badge: 'ASSISTANT · DEMO', close: 'Close assistant',
      intro: 'This assistant looks up sample listings on the site. It does not send or save conversations.',
      chat: 'Quick questions', voice: 'Try voice application', question: 'Your question', send: 'Ask question',
      placeholder: 'For example: Find jobs in Bac Ninh', empty: 'Enter a question (up to 500 characters).',
      prompts: ['Find a job', 'Salary & benefits', 'Business contact', 'Talk to a person'],
      replies: [
        'Demo: these listings are open in the sample catalog. Open the source for details and confirm them with the recruitment team.',
        'Demo: these income ranges come from sample listings and are for reference. Confirm base pay, allowances and overtime with the recruitment team.',
        'Demo: discuss your staffing needs on the contact page. The assistant has not sent a business enquiry.',
        'Demo: open the contact page for the next steps. There is no live adviser and no handoff or message has been sent.',
        'Demo: ask by job title, region or industrial park, or choose a suggested question.'
      ], jobs: 'Browse jobs', contact: 'Open contact page', salaryUnit: 'million VND/month',
      source: 'Source: sample listing',
      noListings: 'Demo: there are currently no open listings in the sample catalog. You can visit the jobs page.',
      noMatch: 'Demo: I could not find an open sample listing that answers this question. Browse the jobs page or contact the recruitment team to confirm.',
      noPay: 'Demo: the sample listings below have no income range to show. Please confirm with the recruitment team.',
      noForm: 'Choose a vacancy, then open this assistant beside its application form to try voice-assisted filling.',
      privacy: 'Use sample data only. Answers stay in page memory and clear when the assistant closes. The microphone starts only after your action and browser permission. Speech must run on this device; no language downloads or audio uploads.',
      voiceIntro: 'Answer each item → review the transcript → confirm filling. You review and submit the actual form yourself.',
      transcript: 'Transcript / type your answer', mic: 'Allow & start on-device microphone', stop: 'Stop microphone', sample: 'Use sample answer',
      next: 'Continue', back: 'Back', review: 'Review answers', edit: 'Edit answers', confirm: 'Confirm & fill form',
      reviewTitle: 'Review before filling', reviewNote: 'Confirmation replaces the fields below in the current form. It never submits, checks consent or attaches a CV.',
      filled: 'Filled, not submitted. Check the form, attach a CV if required and choose consent yourself.',
      formChanged: 'The application form changed. Close and reopen the assistant at your chosen vacancy.',
      unsupported: 'On-device speech recognition is unavailable. Type or use sample answers; the microphone has not started.',
      denied: 'The microphone could not start or permission was denied. Type or use sample answers.',
      listening: 'Listening on this device… Stops automatically after 30 seconds.', stopped: 'Microphone stopped. Check the answer before continuing.',
      pending: 'Checking on-device speech recognition…', noSpeech: 'No speech received. Try again, type or use a sample answer.',
      labels: { name: 'Full name', phone: 'Phone number', area: 'Preferred area', desired: 'Preferred workplace', shift: 'Shift', shuttle: 'Shuttle needed' },
      hints: { name: 'Enter just your name (2–100 characters).', phone: 'Vietnamese number starting with 03, 05, 07, 08, 09 or +84.', area: 'Choose an area available in the application form.', desired: 'Enter a province or industrial park (up to 120 characters).', shift: 'Choose day, night or flexible.', shuttle: 'Answer yes or no.' },
      invalid: 'Please check this answer. ', day: 'Day shift', night: 'Night shift', flexible: 'Flexible', yes: 'Yes', no: 'No', sampleName: 'Demo Candidate', progress: 'Item', of: 'of', welcome: 'Demo: looking for a job, salary information or staffing support?'
    },
    zh: {
      launcher: '演示助手', title: '一起找到下一步', badge: '助手 · 演示', close: '关闭助手',
      intro: '助手可查询网站上的示例职位。助手不会发送或保存对话。',
      chat: '快速咨询', voice: '体验语音求职', question: '您的问题', send: '提问', placeholder: '例如：查找北宁的职位', empty: '请输入问题（最多500字符）。',
      prompts: ['查找职位', '薪资与福利', '企业联系', '联系人工顾问'],
      replies: ['演示：以下是示例目录中开放的职位。请查看来源详情，并向招聘团队确认。', '演示：收入范围取自示例职位，仅供参考。请向招聘团队确认基本工资、补贴和加班安排。', '演示：请前往联系页面讨论用工需求。助手尚未发送企业咨询。', '演示：您可以前往联系页面查看后续步骤。目前没有在线顾问，也未进行人工转接或发送消息。', '演示：您可以按职位名称、地区或工业园区提问，也可以选择推荐问题。'],
      jobs: '浏览职位', contact: '打开联系页面', salaryUnit: '百万越南盾／月',
      source: '来源：示例职位',
      noListings: '演示：示例目录中暂无开放职位。您可以前往职位页面查看。',
      noMatch: '演示：未找到能回答此问题的开放示例职位。您可以浏览职位列表，或联系招聘团队确认。',
      noPay: '演示：以下示例职位暂无可显示的收入范围。请向招聘团队确认。',
      noForm: '请选择一个职位，在其申请表旁打开助手，即可体验语音辅助填写。',
      privacy: '请仅使用示例数据。回答仅保留在页面内存，关闭助手即清除。只有主动选择并授予浏览器权限后才会开启麦克风。仅允许设备本地识别，不下载语言包，不上传音频。',
      voiceIntro: '逐项回答 → 检查转写 → 确认填写。实际申请表由您自行检查和提交。',
      transcript: '语音转写／输入回答', mic: '允许并开启本地麦克风', stop: '停止麦克风', sample: '使用示例回答', next: '继续', back: '返回', review: '检查回答', edit: '修改回答', confirm: '确认并填写表格',
      reviewTitle: '填写前请检查', reviewNote: '确认后将替换当前表格中的以下字段。不会自动提交、勾选同意或附加简历。',
      filled: '已填写，尚未提交。请检查表格，按需添加简历，并自行勾选同意。', formChanged: '申请表已更改。请在所选职位处关闭并重新打开助手。',
      unsupported: '本地语音识别不可用。请手动输入或使用示例回答；麦克风未开启。', denied: '麦克风无法启动或权限被拒绝。请手动输入或使用示例回答。',
      listening: '正在本地聆听…30秒后自动停止。', stopped: '麦克风已停止。继续前请检查回答。', pending: '正在检查本地语音识别…', noSpeech: '未识别到语音。请重试、输入或使用示例回答。',
      labels: { name: '姓名', phone: '电话号码', area: '期望地区', desired: '期望工作地点', shift: '班次', shuttle: '是否需要班车' },
      hints: { name: '仅输入姓名（2–100字符）。', phone: '越南号码，以03、05、07、08、09或+84开头。', area: '请选择申请表中的地区。', desired: '输入省份或工业园（最多120字符）。', shift: '请选择白班、夜班或灵活班次。', shuttle: '回答是或否。' },
      invalid: '请检查回答。', day: '白班', night: '夜班', flexible: '灵活班次', yes: '是', no: '否', sampleName: '演示求职者', progress: '第', of: '/', welcome: '演示：您想找工作、了解薪资，还是咨询用工服务？'
    },
    ko: {
      launcher: '데모 도우미', title: '다음 단계를 함께 찾아요', badge: '도우미 · 데모', close: '도우미 닫기',
      intro: '사이트에 있는 예시 채용 공고를 찾아드려요. 대화는 전송하거나 저장하지 않습니다.',
      chat: '빠른 질문', voice: '음성 지원 체험', question: '질문', send: '질문하기', placeholder: '예: 박닌 지역 일자리 찾기', empty: '질문을 입력하세요 (최대 500자).',
      prompts: ['일자리 찾기', '급여 및 복지', '기업 문의', '상담원 문의'],
      replies: ['데모: 예시 목록에서 모집 중인 공고입니다. 출처에서 상세 내용을 확인한 뒤 채용팀에 문의하세요.', '데모: 소득 범위는 예시 공고의 참고용 정보입니다. 기본급, 수당 및 연장 근무는 채용팀에 확인하세요.', '데모: 문의 페이지에서 인력 수요를 상담할 수 있습니다. 도우미가 기업 문의를 전송하지 않았습니다.', '데모: 문의 페이지에서 다음 단계를 확인하세요. 실시간 상담원 연결이나 메시지 전송은 이루어지지 않았습니다.', '데모: 직무명, 지역 또는 산업단지로 질문하거나 추천 질문을 선택하세요.'],
      jobs: '채용 공고 보기', contact: '문의 페이지 열기', salaryUnit: '백만 VND/월',
      source: '출처: 예시 채용 공고',
      noListings: '데모: 예시 목록에 현재 모집 중인 공고가 없습니다. 채용 페이지를 확인할 수 있습니다.',
      noMatch: '데모: 이 질문에 답할 수 있는 모집 중인 예시 공고를 찾지 못했습니다. 공고 목록을 보거나 채용팀에 문의하세요.',
      noPay: '데모: 아래 예시 공고에는 표시할 소득 범위가 없습니다. 채용팀에 확인하세요.',
      noForm: '채용 공고를 선택하고 지원서 옆에서 도우미를 열어 음성 입력을 체험하세요.',
      privacy: '예시 데이터만 사용하세요. 답변은 페이지 메모리에만 남고 도우미를 닫으면 삭제됩니다. 사용자가 선택하고 브라우저 권한을 허용해야 마이크가 켜집니다. 기기 내 인식만 사용하며 언어 다운로드나 음성 업로드를 하지 않습니다.',
      voiceIntro: '항목별 답변 → 기록 검토 → 입력 확인. 실제 지원서는 직접 확인하고 제출하세요.',
      transcript: '음성 기록 / 답변 입력', mic: '허용 및 기기 내 마이크 시작', stop: '마이크 중지', sample: '예시 답변 사용', next: '계속', back: '뒤로', review: '답변 검토', edit: '답변 수정', confirm: '확인 후 지원서 입력',
      reviewTitle: '입력 전 검토', reviewNote: '확인하면 현재 지원서의 아래 항목을 교체합니다. 자동 제출, 동의 선택 또는 이력서 첨부는 하지 않습니다.',
      filled: '입력 완료, 미제출 상태입니다. 지원서를 확인하고 필요한 이력서를 첨부한 뒤 직접 동의하세요.', formChanged: '지원서가 변경되었습니다. 선택한 공고에서 도우미를 닫고 다시 여세요.',
      unsupported: '기기 내 음성 인식을 사용할 수 없습니다. 직접 입력하거나 예시를 사용하세요. 마이크는 켜지지 않았습니다.', denied: '마이크를 시작할 수 없거나 권한이 거부되었습니다. 직접 입력하거나 예시를 사용하세요.',
      listening: '기기에서 듣는 중…30초 후 자동 중지됩니다.', stopped: '마이크를 중지했습니다. 계속하기 전에 답변을 확인하세요.', pending: '기기 내 음성 인식을 확인하는 중…', noSpeech: '음성이 인식되지 않았습니다. 다시 시도하거나 직접 입력 또는 예시를 사용하세요.',
      labels: { name: '성명', phone: '전화번호', area: '희망 지역', desired: '희망 근무지', shift: '근무조', shuttle: '통근버스 필요 여부' },
      hints: { name: '이름만 입력하세요 (2–100자).', phone: '03, 05, 07, 08, 09 또는 +84로 시작하는 베트남 번호.', area: '지원서에서 제공하는 지역을 선택하세요.', desired: '지역 또는 산업단지를 입력하세요 (최대 120자).', shift: '주간, 야간 또는 유연 근무를 선택하세요.', shuttle: '예 또는 아니요로 답하세요.' },
      invalid: '답변을 확인하세요. ', day: '주간', night: '야간', flexible: '유연 근무', yes: '예', no: '아니요', sampleName: '데모 지원자', progress: '항목', of: '/', welcome: '데모: 일자리, 급여 정보 또는 인력 서비스가 필요하신가요?'
    }
  };
  const normal = value => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').toLowerCase().replace(/đ/g, 'd').trim();
  const locale = value => locales.includes(value) ? value : 'vi';
  function snapshot() {
    try { return window.MDPrototypeBridge?.snapshot() || {}; } catch { return {}; }
  }
  const currentLocale = () => locale(snapshot().lang || document.documentElement.lang.split('-')[0]);
  function href(page, lang, id) {
    const params = new URLSearchParams({ lang: locale(lang) });
    if (id) params.set('id', String(id));
    return page + '?' + params;
  }
  function jobsListHref(lang, data) {
    const page = document.body?.dataset?.page;
    const routing = window.MDLocale;
    let tab = 'worker';
    if (page === 'jobs' || page === 'internal') {
      tab = routing?.jobsState?.(window.location)?.tab ?? (page === 'internal' ? 'internal' : 'worker');
    } else if (page === 'detail' && Array.isArray(data?.jobs)) {
      const id = new URLSearchParams(window.location?.search).get('id');
      if (id && data.jobs.some(job => job?.id === id && job.type === 'internal')) tab = 'internal';
    }
    return routing?.jobsHref?.({ tab }, lang) ?? href('viec-lam.html', lang);
  }
  const searchText = value => normal(value).replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const payWords = /\b(?:(?<!chat )luong|thu nhap|phuc loi|salar(?:y|ies)|pay|wages?|benefits?)\b|薪资|薪水|工资|收入|福利|급여|월급|복지/gu;
  function intent(question) {
    const text = searchText(question);
    if (text.replace(payWords, '') !== text) return 1;
    if (/\b(?:tu van|nguoi that|gap nhan vien|human|person|advis[eo]r|handoff)\b|人工|顾问|상담원|사람/u.test(text)) return 3;
    if (/\b(?:doanh nghiep|nhan luc|business|staffing|company)\b|企业|用工|기업|인력/u.test(text)) return 2;
    if (/\b(?:viec|ung tuyen|jobs?|work|apply)\b|职位|工作|求职|일자리|채용|취업/u.test(text)) return 0;
    return 4;
  }
  function catalogKey(value) {
    if (typeof value !== 'string') return '';
    return searchText(value)
      .replace(/北宁|北寧|박닌/g, ' bac ninh ')
      .replace(/北江|박장/g, ' bac giang ')
      .replace(/\bhanoi\b|河内|河內|하노이/g, ' ha noi ')
      .replace(/\b(?:khu cong nghiep|industrial parks?)\b|工业园区?|산업단지/g, ' kcn ')
      .replace(/\s+/g, ' ').trim();
  }
  function queryKey(question) {
    const query = String(question ?? '').normalize('NFC').replace(/(?<!\p{L})có(?!\p{L})/giu, ' ');
    return catalogKey(query).replace(payWords, ' ')
      .replace(/\b(?:toi muon|cho (?:toi|em) hoi|co the|co (?=viec|cong viec)|bao nhieu|cong viec|viec lam|ung tuyen|phu hop|dang tuyen|tuyen dung|vi tri|muc|tim|viec|toi|muon|em|nao|gi|o|tai|cho|cua|va|la|nhung)\b|\bkhong$/g, ' ')
      .replace(/\b(?:find|looking|look|search|show|see|tell|know|want|like|please|any|available|open|jobs?|work|apply|i|me|can|could|you|there|are|is|what|which|where|how|much|the|a|an|and|about|in|at|for|of|to|does|do|have)\b/g, ' ')
      .replace(/请问|我想|寻找|查找|搜索|有没有|有哪些|还有|多少|什么|如何|哪个|职位|工作|求职|招聘|找|在|的|吗|有|是|和/g, ' ')
      .replace(/(?<![가-힣])(?:일자리|채용 공고|공고|채용|찾기|찾아주세요|지역|에서|에는|은|는|의|얼마인가요|얼마|있나요|있어요|알려주세요)(?![가-힣])/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  function matchesJob(job, key) {
    let remaining = ` ${key} `;
    const park = catalogKey(job.park);
    for (const place of [park, park.replace(/^kcn /, ''), catalogKey(job.location)]) {
      if (place) remaining = remaining.replaceAll(` ${place} `, ' ');
    }
    if (park.startsWith('kcn ')) remaining = remaining.replaceAll(' kcn ', ' ');
    const fields = [job.title, job.company].map(catalogKey);
    const words = fields.join(' ').split(' ');
    // Require every remaining term to occur in the same listing. Chinese titles
    // can match a phrase within a title because they are written without spaces.
    return remaining.trim().split(' ').every(term => !term || words.includes(term)
      || (/^\p{Script=Han}{2,}$/u.test(term) && fields.some(field => field.includes(term)))
      || (/[가-힣](?:에서|에는|은|는|의|을|를|이|가)$/u.test(term) && words.includes(term.replace(/(?:에서|에는|은|는|의|을|를|이|가)$/u, ''))));
  }
  const hasPay = job => Number.isFinite(job.min) && Number.isFinite(job.max) && job.min >= 0 && job.max >= job.min;
  function answer(question, lang = 'vi', data = {}, promptTopic) {
    lang = locale(lang);
    const c = copy[lang];
    const list = { label: c.jobs, href: jobsListHref(lang, data) };
    const contact = { label: c.contact, href: href('lien-he.html', lang) };
    const topic = promptTopic ?? intent(question);
    if (topic === 2 || topic === 3) return { text: c.replies[topic], links: [contact] };
    const key = promptTopic === 0 || promptTopic === 1 ? '' : queryKey(question);
    if (![0, 1].includes(topic) && (promptTopic !== undefined || !key)) return { text: c.replies[4], links: [list, contact] };
    const jobs = (Array.isArray(data?.jobs) ? data.jobs : []).filter(job => job?.open === true
      && typeof job.id === 'string' && job.id.trim() && typeof job.title === 'string' && job.title.trim());
    const matches = (key ? jobs.filter(job => matchesJob(job, key)) : jobs).slice(0, 3);
    if (!matches.length) {
      const text = key ? (topic === 4 ? c.replies[4] : c.noMatch) : c.noListings;
      return { text, links: key ? [list, contact] : [list] };
    }
    const sources = matches.map(job => {
      const place = [job.park, job.location].filter(value => typeof value === 'string' && value.trim()).map(value => value.trim().slice(0, 100));
      const pay = topic === 1 && hasPay(job) ? `${job.min}–${job.max} ${c.salaryUnit}` : '';
      const label = [job.title.trim().slice(0, 180), ...new Set(place), pay].filter(Boolean).join(' · ');
      // Construct the detail URL ourselves instead of trusting content URLs.
      return { label, href: href('chi-tiet-viec-lam.html', lang, job.id), source: c.source };
    });
    const text = topic === 1 ? (matches.some(hasPay) ? c.replies[1] : c.noPay) : c.replies[0];
    return { text, links: [...sources, list] };
  }
  const workerKeys = ['name', 'phone', 'area', 'shift', 'shuttle'];
  function formKeys(form) { return form?.classList.contains('apply-micro') ? workerKeys : ['name', 'phone', 'desired']; }
  function choices(form, key, lang) {
    const c = copy[locale(lang)];
    if (key === 'shift') return [['Ca ngày', c.day], ['Ca đêm', c.night], ['Linh hoạt', c.flexible]];
    if (key === 'shuttle') return [['Có', c.yes], ['Không', c.no]];
    if (key === 'area') return [...(form?.elements.namedItem('area')?.options || [])].filter(option => option.value).map(option => [option.value, option.textContent]);
    return [];
  }
  function normalizeAnswer(key, raw, form, lang) {
    const value = String(raw ?? '').normalize('NFKC').trim(), n = normal(value);
    if (key === 'name') return /^[\p{L}\p{M} .'-]{2,100}$/u.test(value) && /\p{L}/u.test(value) ? value : null;
    if (key === 'phone') { const phone = value.replace(/[\s.()-]/g, ''); return /^(0|\+84)[35789]\d{8}$/.test(phone) ? phone : null; }
    if (key === 'desired') return value.length > 1 && value.length <= 120 ? value : null;
    const available = choices(form, key, lang);
    const exact = available.find(([canonical, label]) => n === normal(canonical) || n === normal(label));
    if (exact) return exact[0];
    if (key === 'area') {
      const areas = { 'bac ninh': ['bac ninh', '北宁', '박닌'], 'bac giang': ['bac giang', '北江', '박장'], 'ha noi': ['ha noi', 'hanoi', '河内', '하노이'] };
      return available.find(([canonical]) => areas[normal(canonical)]?.includes(n))?.[0] || null;
    }
    const aliases = key === 'shift'
      ? [['Ca ngày', ['day', 'day shift', '白班', '주간']], ['Ca đêm', ['night', 'night shift', '夜班', '야간']], ['Linh hoạt', ['flexible', '灵活', '유연 근무']]]
      : [['Có', ['yes', '是', '需要', '예']], ['Không', ['no', '否', '不需要', '아니요']]];
    return aliases.find(([, values]) => values.includes(n))?.[0] || null;
  }
  function fillForm(form, draft, lang) {
    if (!form?.isConnected || form.id !== 'applyForm') return false;
    const plan = [];
    for (const key of formKeys(form)) {
      const value = normalizeAnswer(key, draft[key], form, lang);
      if (value === null) return false;
      const fields = [...form.querySelectorAll(`[name="${key}"]`)];
      if (!fields.length || fields.some(field => field.disabled || field.readOnly)) return false;
      if (key === 'shift' || key === 'shuttle') {
        if (!fields.some(field => field.type === 'radio' && field.value === value)) return false;
        plan.push(() => fields.forEach(field => { field.checked = field.value === value; }));
      } else {
        const field = fields[0];
        if (!['text', 'tel', 'select-one'].includes(field.type)) return false;
        plan.push(() => { field.value = value; });
      }
    }
    // Do not dispatch change: the existing worker-form listener persists preferences.
    // Native fields already reflect these values. Consent, files and submission are untouched.
    plan.forEach(apply => apply());
    return true;
  }
  let shell, launcher, dialog, opener, lang, view, voiceForm, draft, step, voiceStatus, chatLog, chatError;
  let speech = null, speechTimer, oldOverflow, fallbackSiblings = [];
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function button(text, action, cls = 'md-ai-button') {
    const node = el('button', cls, text); node.type = 'button'; node.addEventListener('click', action); return node;
  }
  function link(label, target) { const node = el('a', 'md-ai-link', label); node.href = target; return node; }
  function status(text, error = false) {
    if (!voiceStatus?.isConnected) return;
    voiceStatus.textContent = text; voiceStatus.classList.toggle('is-error', error);
  }
  function stopSpeech(message) {
    const active = speech; speech = null; window.clearTimeout(speechTimer);
    if (active) {
      active.onstart = active.onresult = active.onerror = active.onend = null;
      try { active.abort(); } catch { /* Already ended or not yet started. */ }
    }
    if (dialog) {
      const mic = dialog.querySelector('[data-ai-mic]'), stop = dialog.querySelector('[data-ai-stop]');
      if (mic) mic.disabled = false;
      if (stop) stop.hidden = true;
    }
    if (message) status(message);
  }
  async function startSpeech(input) {
    if (speech || !dialog?.isConnected) return;
    const c = copy[lang], Constructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Constructor) { status(c.unsupported); return; }
    let recognition;
    try { recognition = new Constructor(); } catch { status(c.unsupported); return; }
    // Cloud-backed WebSpeech could transmit personal data. Never start it, even as a fallback.
    if (!('processLocally' in recognition) || typeof Constructor.available !== 'function') { status(c.unsupported); return; }
    const speechLang = { vi: 'vi-VN', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR' }[lang];
    speech = recognition;
    dialog.querySelector('[data-ai-mic]').disabled = true;
    dialog.querySelector('[data-ai-stop]').hidden = false;
    status(c.pending);
    speechTimer = window.setTimeout(() => stopSpeech(c.stopped), 30000);
    try {
      const availability = await Constructor.available({ langs: [speechLang], processLocally: true });
      if (speech !== recognition || !input.isConnected) return;
      if (availability !== 'available') { stopSpeech(c.unsupported); return; }
      recognition.processLocally = true;
      if (recognition.processLocally !== true) { stopSpeech(c.unsupported); return; }
      recognition.lang = speechLang; recognition.continuous = false; recognition.interimResults = true;
      recognition.onstart = () => { if (speech === recognition) status(c.listening); };
      recognition.onresult = event => {
        if (speech !== recognition || !input.isConnected) return;
        input.value = Array.from(event.results, result => result[0]?.transcript || '').join(' ').slice(0, input.maxLength);
        input.removeAttribute('aria-invalid');
      };
      recognition.onerror = event => stopSpeech(event.error === 'no-speech' ? c.noSpeech : c.denied);
      recognition.onend = () => { if (speech === recognition) stopSpeech(input.value.trim() ? c.stopped : c.noSpeech); };
      recognition.start();
    } catch { if (speech === recognition) stopSpeech(c.denied); }
  }
  function message(text, user = false, links = []) {
    const row = el('div', user ? 'md-ai-message is-user' : 'md-ai-message');
    row.append(el('p', '', text));
    if (links.length) {
      const nav = el('div', 'md-ai-response-links');
      for (const item of links) {
        const anchor = link(item.label, item.href);
        if (item.source) {
          anchor.classList.add('md-ai-source-link');
          anchor.replaceChildren(el('span', 'md-ai-source-label', item.source), el('span', 'md-ai-source-detail', item.label));
        }
        nav.append(anchor);
      }
      row.append(nav);
    }
    chatLog.append(row);
    while (chatLog.children.length > 24) chatLog.firstElementChild.remove();
    row.scrollIntoView?.({ block: 'nearest' });
  }
  function showChat() {
    const c = copy[lang];
    const panel = dialog.querySelector('.md-ai-content'); panel.replaceChildren();
    chatLog = el('div', 'md-ai-log'); chatLog.setAttribute('role', 'log'); chatLog.setAttribute('aria-live', 'polite'); chatLog.setAttribute('aria-relevant', 'additions'); chatLog.setAttribute('aria-label', c.chat);
    const scroll = el('div', 'md-ai-chat-scroll'); scroll.append(chatLog); panel.append(scroll); message(c.welcome);
    const prompts = el('div', 'md-ai-prompts');
    const ask = (value, topic) => { message(value, true); const result = answer(value, lang, snapshot(), topic); message(result.text, false, result.links); };
    c.prompts.forEach((text, index) => { const prompt = button(text, () => ask(text, index)); prompt.dataset.aiTopic = String(index); prompts.append(prompt); }); scroll.append(prompts);
    const form = el('form', 'md-ai-compose'); form.noValidate = true;
    const label = el('label', 'md-ai-label', c.question); label.htmlFor = 'md-ai-question';
    const input = el('input'); input.id = 'md-ai-question'; input.type = 'text'; input.maxLength = 500; input.autocomplete = 'off'; input.placeholder = c.placeholder; input.setAttribute('aria-describedby', 'md-ai-chat-error');
    const send = button(c.send, () => {}); send.type = 'submit';
    chatError = el('p', 'md-ai-status'); chatError.id = 'md-ai-chat-error'; chatError.setAttribute('role', 'status');
    form.append(label, input, send, chatError); panel.append(form);
    form.addEventListener('submit', event => {
      event.preventDefault(); event.stopPropagation();
      const text = input.value.trim();
      if (!text || text.length > 500) { chatError.textContent = c.empty; input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
      chatError.textContent = ''; input.removeAttribute('aria-invalid'); ask(text); input.value = ''; input.focus();
    });
  }
  function sampleValue(key) {
    if (key === 'name') return copy[lang].sampleName;
    if (key === 'phone') return '0900000000';
    if (key === 'desired') return 'Bắc Ninh';
    return choices(voiceForm, key, lang)[0]?.[0] || '';
  }
  function showVoice() {
    stopSpeech();
    const c = copy[lang], panel = dialog.querySelector('.md-ai-content'); panel.replaceChildren();
    panel.append(el('p', 'md-ai-note', c.voiceIntro));
    if (!voiceForm?.isConnected || !voiceForm.querySelector('[name="name"]')) {
      panel.append(el('p', 'md-ai-note', c.noForm), link(c.jobs, jobsListHref(lang, snapshot()))); return;
    }
    const keys = formKeys(voiceForm), review = step === keys.length;
    const heading = el('h3', '', review ? c.reviewTitle : c.labels[keys[step]]); heading.tabIndex = -1;
    panel.append(el('p', 'md-ai-step', `${c.progress} ${Math.min(step + 1, keys.length)} ${c.of} ${keys.length}`), heading);
    voiceStatus = el('p', 'md-ai-status'); voiceStatus.id = 'md-ai-voice-status'; voiceStatus.setAttribute('role', 'status'); voiceStatus.setAttribute('aria-live', 'polite');
    if (review) {
      const list = el('dl', 'md-ai-review');
      for (const key of keys) {
        const row = el('div'); row.append(el('dt', '', c.labels[key]), el('dd', '', choices(voiceForm, key, lang).find(([value]) => value === draft[key])?.[1] || draft[key])); list.append(row);
      }
      const confirm = button(c.confirm, () => {
        stopSpeech();
        if (document.getElementById('applyForm') !== voiceForm || !fillForm(voiceForm, draft, lang)) { status(c.formChanged, true); return; }
        // Close before focusing the filled native form; never click its submit/next controls.
        const form = voiceForm; close(false);
        const notice = el('p', 'md-ai-fill-status', c.filled); notice.setAttribute('role', 'status'); notice.tabIndex = -1;
        form.querySelector('.md-ai-fill-status')?.remove(); form.prepend(notice);
        notice.focus(); notice.scrollIntoView?.({ block: 'center', behavior: 'auto' });
      }, 'md-ai-button is-primary');
      confirm.dataset.aiConfirm = '';
      const edit = button(c.edit, () => { step = 0; showVoice(); }); edit.dataset.aiEdit = '';
      panel.append(list, el('p', 'md-ai-note', c.reviewNote), edit, confirm, voiceStatus);
    } else {
      const key = keys[step], label = el('label', 'md-ai-label', c.transcript); label.htmlFor = 'md-ai-answer';
      const hint = el('p', 'md-ai-note', c.hints[key]); hint.id = 'md-ai-answer-hint';
      const input = el('textarea'); input.id = 'md-ai-answer'; input.rows = 2; input.maxLength = key === 'phone' ? 32 : key === 'name' ? 100 : 120; input.autocomplete = 'off'; input.spellcheck = false; input.value = draft[key] || ''; input.setAttribute('aria-describedby', 'md-ai-answer-hint md-ai-voice-status');
      input.addEventListener('input', () => { if (speech) stopSpeech(c.stopped); input.removeAttribute('aria-invalid'); });
      if (key === 'phone') input.inputMode = 'tel';
      const options = el('div', 'md-ai-prompts');
      for (const [value, text] of choices(voiceForm, key, lang)) options.append(button(text, () => { stopSpeech(); input.value = value; input.removeAttribute('aria-invalid'); status(''); }));
      const controls = el('div', 'md-ai-voice-controls');
      const mic = button(c.mic, () => startSpeech(input)); mic.dataset.aiMic = '';
      const stop = button(c.stop, () => stopSpeech(c.stopped)); stop.dataset.aiStop = ''; stop.hidden = true;
      const sample = button(c.sample, () => { stopSpeech(); input.value = sampleValue(key); input.removeAttribute('aria-invalid'); status(''); }); sample.dataset.aiSample = '';
      controls.append(mic, stop, sample);
      const actions = el('div', 'md-ai-actions');
      if (step) { const back = button(c.back, () => { draft[key] = input.value; step--; showVoice(); }); back.dataset.aiBack = ''; actions.append(back); }
      const next = button(step === keys.length - 1 ? c.review : c.next, () => {
        stopSpeech(); const value = normalizeAnswer(key, input.value, voiceForm, lang);
        if (value === null) { status(c.invalid + c.hints[key], true); input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
        draft[key] = value; step++; showVoice();
      }, 'md-ai-button is-primary'); next.dataset.aiNext = ''; actions.append(next);
      panel.append(hint, label, input, options, controls, voiceStatus, actions);
    }
    heading.focus();
  }
  function selectView(next) {
    stopSpeech(); view = next;
    for (const tab of dialog.querySelectorAll('[data-ai-view]')) tab.setAttribute('aria-pressed', String(tab.dataset.aiView === view));
    if (view === 'chat') showChat();
    else { voiceForm = document.getElementById('applyForm'); draft = {}; step = 0; showVoice(); }
  }
  function close(restore = true) {
    stopSpeech();
    if (!dialog) return;
    const old = dialog; dialog = null;
    if (old.open && typeof old.close === 'function') old.close();
    old.remove(); document.body.style.overflow = oldOverflow;
    fallbackSiblings.forEach(([node, inert]) => { node.inert = inert; }); fallbackSiblings = [];
    document.querySelectorAll('[data-ai-open]').forEach(node => node.setAttribute('aria-expanded', 'false'));
    draft = null; voiceForm = null; voiceStatus = null; chatLog = null; chatError = null;
    if (restore) (opener?.isConnected ? opener : launcher)?.focus();
    opener = null;
  }
  function open(trigger = launcher, initialView = 'chat') {
    if (dialog?.isConnected) { dialog.querySelector('button')?.focus(); return; }
    lang = currentLocale(); const c = copy[lang]; opener = trigger || document.activeElement;
    dialog = el('dialog', 'md-ai-dialog'); dialog.id = 'md-ai-dialog'; dialog.lang = lang; dialog.setAttribute('aria-labelledby', 'md-ai-title'); dialog.setAttribute('aria-describedby', 'md-ai-intro');
    const head = el('header', 'md-ai-header'), heading = el('div'); heading.append(el('p', 'md-ai-badge', c.badge));
    const title = el('h2', '', c.title); title.id = 'md-ai-title'; heading.append(title);
    const dismiss = button('×', () => close(), 'md-ai-close'); dismiss.setAttribute('aria-label', c.close); head.append(heading, dismiss);
    const intro = el('p', 'md-ai-intro', c.intro); intro.id = 'md-ai-intro';
    const tabs = el('div', 'md-ai-tabs');
    for (const [key, label] of [['chat', c.chat], ['voice', c.voice]]) { const tab = button(label, () => selectView(key)); tab.dataset.aiView = key; tabs.append(tab); }
    const content = el('div', 'md-ai-content');
    const privacy = el('p', 'md-ai-privacy', c.privacy);
    const body = el('div', 'md-ai-body'); body.append(intro, tabs, content, privacy);
    dialog.append(head, body); shell.append(dialog);
    oldOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else {
      dialog.setAttribute('open', ''); dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true');
      fallbackSiblings = [...document.body.children].filter(node => node !== shell && !['SCRIPT', 'STYLE'].includes(node.tagName)).map(node => [node, node.inert]);
      fallbackSiblings.forEach(([node]) => { node.inert = true; });
    }
    document.querySelectorAll('[data-ai-open]').forEach(node => node.setAttribute('aria-expanded', 'true'));
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('close', event => { if (dialog === event.target) close(); });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
      if (event.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll('button:not([disabled]),a[href],input,textarea,[tabindex="0"]')].filter(node => node.getClientRects().length && !node.closest('[hidden]'));
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
    });
    selectView(initialView); dismiss.focus();
  }
  function mount() {
    const page = document.body?.dataset.page;
    if (!page || page === 'admin' || !document.getElementById('app')) return;
    if (!shell) {
      shell = el('div', 'md-ai'); shell.id = 'md-ai';
      launcher = button('', () => open(launcher), 'md-ai-launcher'); launcher.dataset.aiOpen = ''; launcher.setAttribute('aria-haspopup', 'dialog'); launcher.setAttribute('aria-controls', 'md-ai-dialog'); launcher.setAttribute('aria-expanded', 'false');
      const icon = el('span', 'md-ai-launcher-icon', '✧'); icon.setAttribute('aria-hidden', 'true'); launcher.append(icon, el('span', 'md-ai-launcher-label'));
      shell.append(launcher); document.body.append(shell);
    }
    const nextLang = currentLocale(), c = copy[nextLang];
    if (dialog && lang !== nextLang) close(false);
    if (launcher.getAttribute('aria-label') !== c.launcher) { launcher.setAttribute('aria-label', c.launcher); launcher.title = c.launcher; launcher.querySelector('.md-ai-launcher-label').textContent = c.launcher; }
    if (dialog && voiceForm && document.getElementById('applyForm') !== voiceForm) close(false);
    const listing = page === 'jobs' || page === 'internal';
    const results = listing ? document.getElementById('jobResults') : null;
    const anchor = listing ? (results?.parentElement.querySelector('#pages') || results)
      : page === 'home' ? document.querySelector('#find-work .md-search-discovery')
      : page === 'detail' ? document.getElementById('applyForm')
      : page === 'article' ? document.querySelector('.v14-article-end') : null;
    if (!anchor) return;
    const label = page === 'detail' ? c.voice : c.launcher;
    const existing = document.querySelector('#main .md-ai-inline');
    if (existing) {
      if (existing.textContent !== label) existing.textContent = label;
      if (listing && anchor.nextElementSibling !== existing) anchor.after(existing);
      return;
    }
    const inline = button(label, () => open(inline, page === 'detail' ? 'voice' : 'chat'), 'md-ai-inline');
    inline.dataset.aiOpen = ''; inline.setAttribute('aria-haspopup', 'dialog'); inline.setAttribute('aria-controls', 'md-ai-dialog'); inline.setAttribute('aria-expanded', String(!!dialog));
    if (page === 'detail') anchor.before(inline);
    else if (listing || page === 'article') anchor.after(inline);
    else anchor.append(inline);
  }
  function observeComparisonTray() {
    if (!window.ResizeObserver) return;
    let tray;
    const property = '--md-compare-tray-height';
    const sizeObserver = new window.ResizeObserver(() => {
      if (tray?.isConnected) document.body.style.setProperty(property, tray.offsetHeight + 'px');
    });
    const sync = () => {
      const next = document.getElementById('compareTray');
      if (next === tray) return;
      sizeObserver.disconnect();
      tray = next;
      if (tray) sizeObserver.observe(tray, { box: 'border-box' });
      else document.body.style.removeProperty(property);
    };
    new MutationObserver(sync).observe(document.body, { childList: true });
    sync();
  }
  function boot() {
    mount();
    observeComparisonTray();
    const app = document.getElementById('app');
    if (app) new MutationObserver(mount).observe(app, { childList: true, subtree: true });
    window.addEventListener('md:jobs-view-change', mount);
    new MutationObserver(mount).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    document.addEventListener('change', event => { if (event.target.id === 'languageSelect') { close(false); window.queueMicrotask(mount); } }, true);
    document.addEventListener('click', event => { if (event.target.closest('a[href]')) close(false); }, true);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopSpeech(dialog ? copy[lang].stopped : ''); });
    for (const name of ['pagehide', 'beforeunload', 'popstate', 'hashchange']) window.addEventListener(name, () => { close(false); if (name === 'popstate') window.queueMicrotask(mount); });
  }
  window.MDAssistant = Object.freeze({ answer, intent, normalizeAnswer, fillForm, open, close });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
