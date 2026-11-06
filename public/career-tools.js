/* Career tools prototype. Load after site-runtime.js. No persistence or network requests. */
(() => {
  'use strict';
  if (window.MDCareerTools) return;
  const locales = ['vi', 'en', 'zh', 'ko'];
  const copy = {
    browseAll: ['Về danh sách việc làm', 'Back to job listings', '返回职位列表', '채용 목록으로 돌아가기'],
    matchNext: ['Đây là gợi ý theo ưu tiên, không thay đổi bộ lọc danh sách việc làm. Chọn một gợi ý để xem chi tiết hoặc trở về danh sách.', 'These recommendations use your preferences and do not change the job-list filters. Open a recommendation or return to the list.', '建议依据您的偏好生成，不会改变职位列表的筛选条件。可查看建议详情或返回列表。', '선호도 기반 추천은 채용 목록의 필터를 변경하지 않습니다. 추천 공고를 열거나 목록으로 돌아가세요.'],
    tools: ['Công cụ chọn việc', 'Plan your next job', '求职规划工具', '다음 일자리 준비'],
    intro: ['Thử tính thu nhập và tìm việc theo ưu tiên của bạn.', 'Explore an income estimate and jobs that fit your priorities.', '估算收入，按您的偏好寻找职位。', '예상 소득과 희망 조건에 맞는 일자리를 살펴보세요.'],
    prototype: ['Bản thử nghiệm', 'Prototype', '原型演示', '프로토타입'],
    calculator: ['Ước tính thu nhập', 'Income calculator', '收入估算', '소득 계산기'],
    calcHint: ['Tự điều chỉnh từng khoản · VND/tháng', 'Adjust each assumption · VND/month', '自行调整各项假设 · 越南盾/月', '각 가정 직접 조정 · VND/월'],
    matching: ['Gợi ý việc phù hợp', 'Find your job matches', '职位匹配建议', '맞춤 일자리 찾기'],
    matchHint: ['5 ưu tiên · Cách tính điểm rõ ràng', '5 preferences · Transparent scoring', '5 项偏好 · 透明评分', '5가지 선호 조건 · 투명한 점수'],
    calcNote: ['Chỉ là phép tính minh họa, không phải bảng lương hay tư vấn thuế. Các giá trị mặc định là giả định có thể sửa, không phải mức theo luật. Thu nhập trên tin tuyển dụng không được coi là lương cơ bản.', 'Illustrative arithmetic only, not a payslip or tax advice. Defaults are editable assumptions, not statutory rates. Advertised income is not treated as base salary.', '仅为示例计算，并非工资单或税务建议。默认值是可修改的假设，并非法定标准。招聘广告中的收入不视为基本工资。', '예시 계산이며 급여 명세서나 세무 조언이 아닙니다. 기본값은 수정 가능한 가정이며 법정 요율이 아닙니다. 공고 소득을 기본급으로 사용하지 않습니다.'],
    base: ['Lương cơ bản (VND)', 'Base salary (VND)', '基本工资（越南盾）', '기본급 (VND)'],
    allowance: ['Phụ cấp (VND)', 'Allowances (VND)', '津贴（越南盾）', '수당 (VND)'],
    hours: ['Giờ làm cơ bản / tháng', 'Regular hours / month', '每月正常工时', '월 기본 근무 시간'],
    overtime: ['Giờ làm thêm / tháng', 'Overtime hours / month', '每月加班工时', '월 초과 근무 시간'],
    multiplier: ['Hệ số làm thêm (×)', 'Overtime multiplier (×)', '加班倍数（×）', '초과 근무 배율 (×)'],
    rate: ['Khấu trừ trên lương cơ bản (%)', 'Deduction on base salary (%)', '基本工资扣减比例（%）', '기본급 공제율 (%)'],
    fixed: ['Khấu trừ cố định (VND)', 'Fixed deductions (VND)', '固定扣减（越南盾）', '고정 공제액 (VND)'],
    assumptions: ['Giả định làm thêm & khấu trừ', 'Overtime & deduction assumptions', '加班及扣减假设', '초과 근무 및 공제 가정'],
    assumptionsNote: ['Ví dụ: 208 giờ, hệ số 1,5; khấu trừ mặc định 0%. Tỷ lệ khấu trừ chỉ nhân với lương cơ bản. Tất cả đều có thể sửa.', 'Example: 208 hours, 1.5× overtime; deductions default to 0%. The deduction percentage applies only to base salary. All are editable.', '示例：208 小时、加班 1.5 倍；默认扣减 0%。扣减比例仅用于基本工资。各项均可修改。', '예시: 208시간, 초과 근무 1.5배, 기본 공제율 0%. 공제율은 기본급에만 적용됩니다. 모두 수정할 수 있습니다.'],
    calculate: ['Tính thu nhập', 'Calculate estimate', '计算估算收入', '예상 소득 계산'],
    reset: ['Đặt lại', 'Reset', '重置', '초기화'],
    net: ['Còn lại sau khấu trừ minh họa', 'After illustrative deductions', '示例扣减后金额', '예시 공제 후 금액'],
    breakdown: ['Chi tiết phép tính', 'Calculation breakdown', '计算明细', '계산 내역'],
    hourly: ['Đơn giá giờ', 'Hourly base rate', '基本时薪', '시간당 기본급'],
    overtimePay: ['Tiền làm thêm', 'Overtime pay', '加班金额', '초과 근무 수당'],
    gross: ['Tổng trước khấu trừ', 'Total before deductions', '扣减前总额', '공제 전 합계'],
    percentDeduction: ['Khấu trừ theo tỷ lệ', 'Percentage deduction', '按比例扣减', '비율 공제액'],
    rounding: ['Tiền làm thêm và khấu trừ theo tỷ lệ được làm tròn đến 1 VND trước khi cộng trừ. Đơn giá giờ hiển thị 4 số thập phân; phép tính dùng giá trị đầy đủ.', 'Overtime pay and percentage deductions are rounded to the nearest VND before totals. Hourly rate displays 4 decimals; calculations use full precision.', '加班金额和比例扣减先四舍五入到整数越南盾，再计算总额。时薪显示 4 位小数，计算使用完整精度。', '초과 근무 수당과 비율 공제액은 각각 1 VND 단위로 반올림한 후 합산합니다. 시급은 소수점 4자리로 표시하며 계산에는 전체 정밀도를 사용합니다.'],
    staleCalc: ['Điều chỉnh thông số rồi bấm tính để xem chi tiết.', 'Set your assumptions, then calculate to see the breakdown.', '调整假设后点击计算以查看明细。', '가정을 설정한 후 계산을 눌러 내역을 확인하세요.'],
    invalid: ['Kiểm tra các mục được đánh dấu bên dưới.', 'Check the highlighted fields below.', '请检查下方标记的字段。', '아래 표시된 항목을 확인하세요.'],
    range: ['Nhập số từ {min} đến {max}.', 'Enter a number from {min} to {max}.', '请输入 {min} 至 {max} 之间的数字。', '{min}~{max} 사이의 숫자를 입력하세요.'],
    whole: ['Nhập số VND nguyên, không âm.', 'Enter a nonnegative whole VND amount.', '请输入非负整数越南盾金额。', '0 이상의 정수 VND 금액을 입력하세요.'],
    totalHours: ['Tổng giờ cơ bản và làm thêm không được vượt 744 giờ trong phép tính tháng này.', 'Regular and overtime hours together cannot exceed 744 in this monthly model.', '此月度模型中，正常及加班工时合计不得超过 744 小时。', '이 월별 계산에서는 기본 및 초과 근무 시간 합계가 744시간을 넘을 수 없습니다.'],
    excessive: ['Khấu trừ vượt tổng thu nhập. Hãy giảm khoản cố định hoặc tỷ lệ.', 'Deductions exceed total income. Reduce the fixed amount or percentage.', '扣减超过总收入，请降低固定金额或比例。', '공제액이 총소득보다 큽니다. 고정 공제액이나 공제율을 낮추세요.'],
    privacy: ['Chỉ dùng ưu tiên công việc; không cần tên, số điện thoại hay CV. Không gửi hoặc lưu ưu tiên; tải lại trang sẽ xóa.', 'Only job preferences; no name, phone or CV needed. Preferences are not sent or saved and disappear on reload.', '只需工作偏好，无需姓名、电话或简历。偏好不发送、不保存，刷新页面即清除。', '이름, 전화번호, 이력서 없이 근무 선호 조건만 입력하세요. 조건은 전송·저장되지 않으며 새로고침하면 사라집니다.'],
    park: ['Khu công nghiệp ưu tiên', 'Preferred industrial park', '首选工业园区', '희망 산업단지'],
    location: ['Khu vực ưu tiên', 'Preferred location', '首选地区', '희망 지역'],
    salary: ['Thu nhập tối thiểu (triệu VND/tháng)', 'Minimum income (million VND/month)', '最低收入（百万越南盾/月）', '최소 소득 (백만 VND/월)'],
    shift: ['Ca làm ưu tiên', 'Preferred shift', '班次偏好', '희망 근무 시간대'],
    skill: ['Kỹ năng / công việc ưu tiên', 'Preferred skill / work', '技能／工作偏好', '희망 기술 / 업무'],
    any: ['Không ưu tiên', 'No preference', '不限', '선호 없음'],
    day: ['Ca ngày', 'Day shift', '白班', '주간'],
    night: ['Ca đêm', 'Night shift', '夜班', '야간'],
    shifts: ['Làm theo ca', 'Shift work', '轮班工作', '교대 근무'],
    production: ['Sản xuất / lắp ráp', 'Production / assembly', '生产／组装', '생산 / 조립'],
    mechanical: ['Cơ khí', 'Mechanical work', '机械工作', '기계 작업'],
    quality: ['Kiểm tra chất lượng', 'Quality control', '质量检验', '품질 관리'],
    warehouse: ['Kho vận', 'Warehouse / logistics', '仓储／物流', '창고 / 물류'],
    machine: ['Vận hành máy', 'Machine operation', '机器操作', '기계 조작'],
    find: ['Xem gợi ý', 'Show matches', '查看匹配', '추천 보기'],
    edit: ['Sửa ưu tiên', 'Edit preferences', '修改偏好', '조건 수정'],
    method: ['Cách xếp hạng', 'How ranking works', '排名方式', '순위 산정 방식'],
    methodNote: ['Chỉ xét tin lao động phổ thông đang mở trong dữ liệu hiện tại. Trọng số: KCN 25, khu vực 20, thu nhập 25, ca làm 15, kỹ năng 15. Chỉ tính ưu tiên đã chọn: điểm đạt / tổng trọng số đã chọn × 100, làm tròn %. Thu nhập tối đa dưới yêu cầu bị loại; mức tối thiểu đạt yêu cầu được đủ điểm, chỉ mức tối đa đạt được nửa điểm. KCN/khu vực so khớp chính xác; ca/kỹ năng tìm từ khóa trong nội dung tin. Không rõ = 0 điểm. Điểm bằng nhau giữ thứ tự dữ liệu. Không phải AI hay cam kết tuyển dụng.', 'Only currently open worker jobs in the current data are considered. Weights: park 25, location 20, income 25, shift 15, skill 15. Only selected preferences count: earned points / selected weights × 100, rounded to %. Jobs whose maximum income is below your target are excluded. A qualifying minimum earns full income points; only a qualifying maximum earns half. Park/location use exact matches; shift/skill use keywords in the listing. Unknown = 0 points. Ties retain data order. This is rule-based, not AI or a hiring promise.', '仅考虑当前数据中开放的普工职位。权重：园区 25、地区 20、收入 25、班次 15、技能 15。只计算已选偏好：所得分／已选权重之和 × 100，四舍五入为百分比。最高收入低于目标的职位被排除；最低收入达标得全部收入分，仅最高收入达标得一半。园区和地区精确匹配；班次和技能按职位内容关键词匹配。未知计 0 分。同分保留数据顺序。采用明确规则，并非 AI 或录用承诺。', '현재 데이터에서 모집 중인 생산직 공고만 비교합니다. 가중치: 산업단지 25, 지역 20, 소득 25, 시간대 15, 기술 15. 선택한 조건만 계산합니다: 획득 점수 / 선택 가중치 합 × 100, 정수 %로 반올림. 최대 소득이 목표 미만인 공고는 제외합니다. 최소 소득 충족 시 소득 점수 전부, 최대 소득만 충족 시 절반을 부여합니다. 산업단지와 지역은 정확히 비교하고 시간대와 기술은 공고의 키워드로 비교합니다. 알 수 없음은 0점입니다. 동점은 데이터 순서를 유지합니다. 규칙 기반이며 AI나 채용 보장이 아닙니다.'],
    choose: ['Chọn ít nhất một ưu tiên để xếp hạng công việc.', 'Choose at least one preference to rank jobs.', '请至少选择一项偏好以对职位排序。', '일자리 순위를 보려면 조건을 하나 이상 선택하세요.'],
    empty: ['Chưa có công việc phù hợp với các ưu tiên này.', 'No jobs currently match these preferences.', '目前没有符合这些偏好的职位。', '현재 이 조건에 맞는 일자리가 없습니다.'],
    emptyHint: ['Thử giảm mức thu nhập hoặc đổi khu vực, ca làm, kỹ năng.', 'Try lowering the income target or changing location, shift or skill.', '可尝试降低收入目标，或调整地区、班次、技能。', '희망 소득을 낮추거나 지역, 시간대, 기술을 변경해 보세요.'],
    matches: ['Gợi ý từ dữ liệu hiện tại', 'Matches from current listings', '来自当前招聘信息的匹配', '현재 공고 기준 추천'],
    score: ['Mức khớp ưu tiên', 'Preference match', '偏好匹配度', '선호 조건 일치도'],
    details: ['Xem công việc', 'View job', '查看职位', '공고 보기'],
    income: ['Triệu VND/tháng · Theo tin đăng', 'Million VND/month · Advertised', '百万越南盾/月 · 招聘广告金额', '백만 VND/월 · 공고 기준'],
    yes: ['Khớp dữ liệu tin', 'Matches listing data', '符合职位信息', '공고 정보와 일치'],
    no: ['Không khớp', 'Does not match', '不匹配', '불일치'],
    unknown: ['Chưa đủ thông tin; cần xác nhận', 'Not enough information; confirm with recruiter', '信息不足，需向招聘方确认', '정보 부족, 채용 담당자 확인 필요'],
    partial: ['Chỉ mức cao trong khoảng thu nhập đạt yêu cầu; không bảo đảm', 'Only the upper income range meets your target; not guaranteed', '仅收入区间上限达到目标，不作保证', '소득 범위 상단만 충족하며 보장되지 않음'],
    keyword: ['Khớp từ khóa; cần xác nhận thực tế', 'Keyword match; confirm actual conditions', '关键词匹配，需确认实际条件', '키워드 일치, 실제 조건 확인 필요'],
    notSelected: ['Chưa chọn; không tính điểm', 'Not selected; excluded from scoring', '未选择，不计入评分', '미선택, 점수에서 제외'],
    updated: ['Ưu tiên đã đổi. Bấm xem gợi ý để cập nhật.', 'Preferences changed. Show matches to update.', '偏好已更改，请点击查看匹配以更新。', '조건이 변경되었습니다. 추천 보기를 눌러 갱신하세요.'],
    unavailable: ['Dữ liệu việc làm chưa sẵn sàng. Thử lại khi trang tải xong.', 'Job data is not ready. Try again after the page loads.', '职位数据尚未就绪，请在页面加载完成后重试。', '공고 데이터를 준비 중입니다. 페이지 로딩 후 다시 시도하세요.'],
    count: ['Hiển thị {shown} / {total} gợi ý có điểm khớp; chỉ xét tin đang mở.', 'Showing {shown} of {total} scored matches; open jobs only.', '显示 {total} 个有匹配分职位中的 {shown} 个，仅限开放职位。', '점수가 있는 추천 {total}개 중 {shown}개 표시, 모집 중 공고만 포함.'],
  };
  const defaults = Object.freeze({ base: 6000000, allowance: 500000, hours: 208, overtime: 20, multiplier: 1.5, rate: 0, fixed: 0 });
  const blankProfile = () => ({ park: '', location: '', salary: '', shift: '', skill: '' });
  const weights = Object.freeze({ park: 25, location: 20, salary: 25, shift: 15, skill: 15 });
  const limits = { base: [0, 1e9], allowance: [0, 1e9], hours: [1, 744], overtime: [0, 744], multiplier: [0, 5], rate: [0, 100], fixed: [0, 1e9] };
  const moneyFields = new Set(['base', 'allowance', 'fixed']);
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').toLowerCase().replace(/đ/g, 'd');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const language = lang => locales.includes(String(lang).split('-')[0]) ? String(lang).split('-')[0] : 'vi';
  const t = (key, lang, values = {}) => Object.entries(values).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), copy[key][locales.indexOf(language(lang))]);
  const number = (value, lang, decimals = 0) => new Intl.NumberFormat({ vi: 'vi-VN', en: 'en-GB', zh: 'zh-CN', ko: 'ko-KR' }[language(lang)], { maximumFractionDigits: decimals }).format(value);
  const amount = (value, lang) => number(value, lang) + ' VND';

  function calculate(values) {
    const errors = {}, input = {};
    for (const [key, [min, max]] of Object.entries(limits)) {
      const raw = values[key], n = Number(raw);
      if (!['number', 'string'].includes(typeof raw) || String(raw).trim() === '' || !Number.isFinite(n) || n < min || n > max) errors[key] = { key: 'range', min, max };
      else if (moneyFields.has(key) && !Number.isInteger(n)) errors[key] = { key: 'whole' };
      else input[key] = n;
    }
    if (!errors.hours && !errors.overtime && input.hours + input.overtime > 744) errors.overtime = { key: 'totalHours' };
    if (Object.keys(errors).length) return { errors };
    const hourly = input.base / input.hours;
    const overtimePay = Math.round(hourly * input.overtime * input.multiplier);
    const deduction = Math.round(input.base * input.rate / 100);
    const gross = input.base + input.allowance + overtimePay;
    if (deduction + input.fixed > gross) return { errors: { fixed: { key: 'excessive' } } };
    return { errors, input, hourly, overtimePay, deduction, gross, net: gross - deduction - input.fixed };
  }

  // Keywords describe listing evidence, never inferred qualifications or guaranteed schedules.
  const patterns = {
    day: /\bca ngay\b|\bgio hanh chinh\b|\bday shift\b|白班|日班|주간|주간근무/,
    night: /\bca dem\b|\bnight shift\b|夜班|야간/,
    shifts: /\btheo ca\b|\blam ca\b|\bca lam\b|\bshift(?:s| work)?\b|轮班|倒班|교대/,
    production: /\bsan xuat\b|\blap rap\b|\bproduction\b|\bassembly\b|生产|组装|생산|조립/,
    mechanical: /\bco khi\b|\bmechanical\b|机械|기계/,
    quality: /\bqc\b|\bkiem tra chat luong\b|\bquality control\b|质量|품질/,
    warehouse: /\bkho(?: van)?\b|\bwarehouse\b|\blogistics\b|仓储|仓库|物流|창고|물류/,
    machine: /\bvan hanh may\b|\bmachine operat(?:ion|or)\b|机器操作|기계 조작|기계 운전/,
  };
  const openJobs = jobs => (Array.isArray(jobs) ? jobs : []).filter(j => j && j.open === true && j.type === 'worker' && typeof j.id === 'string' && j.id);
  function validateProfile(profile) {
    const errors = {};
    if (profile.salary !== '' && profile.salary !== undefined && (!['number', 'string'].includes(typeof profile.salary) || !Number.isFinite(Number(profile.salary)) || Number(profile.salary) < 0.01 || Number(profile.salary) > 1000)) errors.salary = { key: 'range', min: 0.01, max: 1000 };
    if (profile.shift && !['day', 'night', 'shifts'].includes(profile.shift)) errors.shift = { key: 'choose' };
    if (profile.skill && !['production', 'mechanical', 'quality', 'warehouse', 'machine'].includes(profile.skill)) errors.skill = { key: 'choose' };
    return errors;
  }
  function rankJobs(jobs, profile) {
    if (Object.keys(validateProfile(profile)).length) return [];
    const active = Object.keys(weights).filter(key => String(profile[key] ?? '').trim() !== '');
    if (!active.length) return [];
    const denominator = active.reduce((sum, key) => sum + weights[key], 0);
    return openJobs(jobs).map((job, index) => {
      const validIncome = Number.isFinite(job.min) && Number.isFinite(job.max) && job.min >= 0 && job.max >= job.min;
      if (profile.salary && validIncome && job.max < Number(profile.salary)) return null;
      const evidence = normalize([job.title, job.description, job.requirements, ...(Array.isArray(job.tags) ? job.tags : []), job.shift, ...(Array.isArray(job.skills) ? job.skills : [])].filter(Boolean).join(' '));
      const factors = Object.keys(weights).map(key => {
        if (!active.includes(key)) return { key, points: 0, weight: weights[key], reason: 'notSelected', active: false };
        let fraction = 0, reason = 'no';
        if (key === 'park' || key === 'location') {
          fraction = job[key] === profile[key] ? 1 : 0;
          reason = !job[key] ? 'unknown' : fraction ? 'yes' : 'no';
        } else if (key === 'salary') {
          fraction = validIncome ? job.min >= Number(profile.salary) ? 1 : job.max >= Number(profile.salary) ? 0.5 : 0 : 0;
          reason = !validIncome ? 'unknown' : fraction === 1 ? 'yes' : fraction ? 'partial' : 'no';
        } else {
          fraction = patterns[profile[key]]?.test(evidence) ? 1 : 0;
          reason = fraction ? 'keyword' : 'unknown';
        }
        return { key, points: weights[key] * fraction, weight: weights[key], reason, active: true };
      });
      const earned = factors.reduce((sum, factor) => sum + factor.points, 0);
      return { job, factors, earned, denominator, score: Math.round(earned / denominator * 100), index };
    }).filter(result => result && result.earned > 0).sort((a, b) => b.earned - a.earned || a.index - b.index);
  }
  function jobLink(job, lang) {
    // Accept the runtime's real detail route, then enforce the active locale.
    // Never allow CMS text to introduce an external destination or another job ID.
    try {
      const url = new URL(job.href, 'https://career.local/');
      if (url.origin === 'https://career.local' && url.pathname === '/chi-tiet-viec-lam.html' && url.searchParams.get('id') === job.id) {
        url.searchParams.set('lang', language(lang));
        return 'chi-tiet-viec-lam.html' + url.search + url.hash;
      }
    } catch { /* Older snapshots can omit href; use the same canonical runtime route. */ }
    const params = new URLSearchParams({ id: job.id, lang: language(lang) });
    return 'chi-tiet-viec-lam.html?' + params;
  }

  const optionalCopy = {
    title: ['Cần hỗ trợ thêm? Tính thu nhập / gợi ý việc', 'Need more help? Income estimate / job suggestions', '需要更多帮助？收入估算／职位建议', '더 도움이 필요하세요? 소득 계산 / 일자리 추천'],
    link: ['Công cụ hỗ trợ (tùy chọn)', 'Optional job tools', '求职工具（可选）', '구직 도구 (선택)'],
  };
  const optionalText = (key, lang) => optionalCopy[key][locales.indexOf(language(lang))];
  const state = { salary: { ...defaults }, profile: blankProfile(), calculated: false, matched: false, optionalOpen: false, calcOpen: false, matchOpen: false, assumptionsOpen: false, methodOpen: false };
  let observer, queued = false, mountedSignature = '', mountedHost;
  const snapshot = () => {
    try {
      const data = window.MDPrototypeBridge?.snapshot();
      if (data && Array.isArray(data.jobs)) return { lang: language(data.lang), jobs: data.jobs, ready: true };
    } catch { /* The runtime may still be booting. A subsequent render will retry. */ }
    return { lang: language(document.querySelector('#languageSelect')?.value || document.documentElement.lang), jobs: [], ready: false };
  };
  const errorText = (error, lang) => t(error.key, lang, error.key === 'range' ? { min: number(error.min, lang, 2), max: number(error.max, lang, 2) } : {});
  function numericField(key, value, lang, profile = false) {
    const id = `md-career-${key}`, bound = profile ? [0.01, 1000] : limits[key];
    return `<div class="ct-field"><label for="${id}">${t(key, lang)}</label><input id="${id}" name="${key}" type="number" inputmode="${moneyFields.has(key) ? 'numeric' : 'decimal'}" min="${bound[0]}" max="${bound[1]}" step="${moneyFields.has(key) ? '1' : 'any'}" value="${escape(value)}" ${profile ? '' : 'required'} aria-describedby="${id}-error"><p id="${id}-error" class="ct-error" hidden></p></div>`;
  }
  function selectField(key, options, lang) {
    // Preserve a selected CMS value even if the corresponding job was closed or removed.
    const selected = state.profile[key];
    if (selected && !options.some(([value]) => value === selected)) options.push([selected, selected]);
    return `<div class="ct-field"><label for="md-career-${key}">${t(key, lang)}</label><select id="md-career-${key}" name="${key}" aria-describedby="md-career-${key}-error"><option value="">${t('any', lang)}</option>${options.map(([value, label]) => `<option value="${escape(value)}" ${selected === value ? 'selected' : ''}>${escape(label)}</option>`).join('')}</select><p id="md-career-${key}-error" class="ct-error" hidden></p></div>`;
  }
  const uniqueOptions = (jobs, key) => [...new Set(openJobs(jobs).map(j => j[key]).filter(value => typeof value === 'string' && value.trim()))].map(value => [value, value]);
  function markup(data) {
    const { lang, jobs } = data;
    return `<details class="ct-optional" data-ct-panel="optional" ${state.optionalOpen ? 'open' : ''}><summary id="md-career-title">${optionalText('title', lang)}<span class="ct-chevron" aria-hidden="true">⌄</span></summary><div class="ct-optional-body"><div class="ct-heading"><div><span class="ct-kicker">MINH ĐỨC / ${t('prototype', lang)}</span><h2>${t('tools', lang)}</h2><p>${t('intro', lang)}</p></div></div>
      <div class="ct-panels"><details class="ct-tool" data-ct-panel="calc" ${state.calcOpen ? 'open' : ''}><summary><span class="ct-tool-icon" aria-hidden="true">＋</span><span><strong>${t('calculator', lang)}</strong><small>${t('calcHint', lang)}</small></span><span class="ct-chevron" aria-hidden="true">⌄</span></summary><div class="ct-body"><p class="ct-note">${t('calcNote', lang)}</p><form id="md-career-calculator" novalidate><p class="ct-error-summary" role="alert" hidden>${t('invalid', lang)}</p><div class="ct-grid">${['base', 'allowance'].map(key => numericField(key, state.salary[key], lang)).join('')}</div><details class="ct-assumptions" data-ct-panel="assumptions" ${state.assumptionsOpen ? 'open' : ''}><summary>${t('assumptions', lang)}</summary><p class="ct-note">${t('assumptionsNote', lang)}</p><div class="ct-grid">${['hours', 'overtime', 'multiplier', 'rate', 'fixed'].map(key => numericField(key, state.salary[key], lang)).join('')}</div></details><div class="ct-actions"><button class="ct-primary" type="submit">${t('calculate', lang)} <span aria-hidden="true">→</span></button><button class="ct-secondary" type="reset">${t('reset', lang)}</button></div></form><div id="md-career-calculation" class="ct-output" aria-live="polite" aria-atomic="true"></div></div></details>
      <details class="ct-tool" data-ct-panel="match" ${state.matchOpen ? 'open' : ''}><summary><span class="ct-tool-icon" aria-hidden="true">◎</span><span><strong>${t('matching', lang)}</strong><small>${t('matchHint', lang)}</small></span><span class="ct-chevron" aria-hidden="true">⌄</span></summary><div class="ct-body"><p class="ct-note">${t('privacy', lang)}</p><form id="md-career-matching" novalidate><p class="ct-error-summary" role="alert" hidden>${t('invalid', lang)}</p><div class="ct-grid">${selectField('park', uniqueOptions(jobs, 'park'), lang)}${selectField('location', uniqueOptions(jobs, 'location'), lang)}${numericField('salary', state.profile.salary, lang, true)}${selectField('shift', ['day', 'night', 'shifts'].map(key => [key, t(key, lang)]), lang)}${selectField('skill', ['production', 'mechanical', 'quality', 'warehouse', 'machine'].map(key => [key, t(key, lang)]), lang)}</div><div class="ct-actions"><button class="ct-primary" type="submit">${t('find', lang)} <span aria-hidden="true">→</span></button><button class="ct-secondary" type="reset">${t('reset', lang)}</button></div></form><details class="ct-method" data-ct-panel="method" ${state.methodOpen ? 'open' : ''}><summary>${t('method', lang)}</summary><p>${t('methodNote', lang)}</p></details><div id="md-career-matches" class="ct-output" aria-live="polite" aria-atomic="true"></div></div></details></div></div></details>`;
  }
  function calculationHTML(result, lang) {
    if (!result || Object.keys(result.errors).length) return `<p class="ct-note">${t('staleCalc', lang)}</p>`;
    const { input: v, hourly, overtimePay, deduction, gross, net } = result;
    const row = (label, formula, total, decimals = 0) => `<div><dt>${t(label, lang)}<small>${escape(formula)}</small></dt><dd>${number(total, lang, decimals)} VND</dd></div>`;
    return `<div class="ct-total"><span>${t('net', lang)}</span><strong>${amount(net, lang)}</strong></div><h3>${t('breakdown', lang)}</h3><dl class="ct-breakdown">${row('base', '', v.base)}${row('allowance', '', v.allowance)}${row('hourly', `${amount(v.base, lang)} ÷ ${number(v.hours, lang, 20)}`, hourly, 4)}${row('overtimePay', `(${amount(v.base, lang)} ÷ ${number(v.hours, lang, 20)}) × ${number(v.overtime, lang, 20)} × ${number(v.multiplier, lang, 20)}`, overtimePay)}${row('gross', `${amount(v.base, lang)} + ${amount(v.allowance, lang)} + ${amount(overtimePay, lang)}`, gross)}${row('percentDeduction', `${amount(v.base, lang)} × ${number(v.rate, lang, 20)}%`, deduction)}${row('fixed', '', v.fixed)}${row('net', `${amount(gross, lang)} − ${amount(deduction, lang)} − ${amount(v.fixed, lang)}`, net)}</dl><p class="ct-note">${t('rounding', lang)}</p>`;
  }
  function matchesHTML(data) {
    const { lang, jobs, ready } = data;
    if (!ready) return `<p class="ct-note">${t('unavailable', lang)}</p>`;
    if (!state.matched) return `<p class="ct-note">${t('choose', lang)}</p>`;
    const matches = rankJobs(jobs, state.profile);
    const edit = `<button class="ct-secondary" type="button" data-ct-edit>${t('edit', lang)}</button>`;
    const next = `<div class="ct-match-next"><p>${t('matchNext',lang)}</p><a href="${document.body.dataset.page==='jobs'?'#resultHeading':'viec-lam.html?lang='+lang}">${t('browseAll',lang)} →</a></div>`;
    if (!matches.length) return `<div class="ct-empty"><h3>${t('empty', lang)}</h3><p>${t('emptyHint', lang)}</p>${edit}</div>${next}`;
    return `<div class="ct-result-heading"><h3>${t('matches', lang)}</h3>${edit}</div><p class="ct-note">${t('count', lang, { shown: Math.min(4, matches.length), total: matches.length })}</p><ol class="ct-match-list">${matches.slice(0, 4).map(({ job, factors, score, earned, denominator }) => `<li class="ct-match"><div class="ct-match-top"><h4><a href="${escape(jobLink(job, lang))}">${escape(job.title)}</a></h4><span class="ct-score">${score}%<small>${t('score', lang)}</small></span></div><p>${escape(job.park)} · ${escape(job.location)}</p><p class="ct-income">${Number.isFinite(job.min) && Number.isFinite(job.max) ? `${number(job.min, lang, 2)}–${number(job.max, lang, 2)} <small>${t('income', lang)}</small>` : t('unknown', lang)}</p><p class="ct-equation">${number(earned, lang, 2)} / ${denominator} × 100 = ${score}%</p><ul class="ct-factors">${factors.map(factor => `<li><strong>${t(factor.key, lang)}</strong><span>${t(factor.reason, lang)}${factor.active ? ` · ${number(factor.points, lang, 2)}/${factor.weight}` : ''}</span></li>`).join('')}</ul><a class="ct-job-link" href="${escape(jobLink(job, lang))}">${t('details', lang)} <span aria-hidden="true">→</span></a></li>`).join('')}</ol>${next}`;
  }
  function showErrors(form, errors, lang) {
    form.querySelectorAll('[aria-invalid]').forEach(control => control.removeAttribute('aria-invalid'));
    form.querySelectorAll('.ct-error').forEach(node => { node.hidden = true; node.textContent = ''; });
    const summary = form.querySelector('.ct-error-summary');
    summary.hidden = !Object.keys(errors).length;
    for (const [key, error] of Object.entries(errors)) {
      const control = form.elements.namedItem(key), message = form.querySelector(`#md-career-${key}-error`);
      if (!control || !message) continue;
      control.setAttribute('aria-invalid', 'true');
      message.textContent = errorText(error, lang); message.hidden = false;
      const disclosure = control.closest('details'); if (disclosure) disclosure.open = true;
    }
    form.querySelector('[aria-invalid="true"]')?.focus();
  }
  function updateOutputs(root, data) {
    root.querySelector('#md-career-calculation').innerHTML = calculationHTML(state.calculated ? calculate(state.salary) : null, data.lang);
    root.querySelector('#md-career-matches').innerHTML = matchesHTML(data);
  }
  function wire(root) {
    root.addEventListener('toggle', event => {
      const key = { optional: 'optionalOpen', calc: 'calcOpen', match: 'matchOpen', assumptions: 'assumptionsOpen', method: 'methodOpen' }[event.target.dataset.ctPanel];
      if (key) state[key] = event.target.open;
    }, true);
    root.addEventListener('submit', event => {
      const form = event.target;
      if (!form.matches('#md-career-calculator,#md-career-matching')) return;
      event.preventDefault();
      const data = snapshot(), isCalc = form.id === 'md-career-calculator';
      const values = Object.fromEntries(new FormData(form));
      if (isCalc) {
        state.salary = values;
        const result = calculate(values); state.calculated = !Object.keys(result.errors).length;
        showErrors(form, result.errors, data.lang);
        root.querySelector('#md-career-calculation').innerHTML = calculationHTML(result, data.lang);
      } else {
        state.profile = values;
        const errors = validateProfile(values);
        if (!Object.keys(errors).length && !Object.values(values).some(value => String(value).trim())) errors.park = { key: 'choose' };
        state.matched = !Object.keys(errors).length;
        showErrors(form, errors, data.lang);
        root.querySelector('#md-career-matches').innerHTML = matchesHTML(data);
        if(state.matched){const results=root.querySelector('#md-career-matches');results.tabIndex=-1;results.focus({preventScroll:true});results.scrollIntoView({block:'start',behavior:'auto'});}
      }
    });
    const changed = event => {
      const form = event.target.closest('form'); if (!form) return;
      const data = snapshot(), isCalc = form.id === 'md-career-calculator';
      if (isCalc) { state.salary = Object.fromEntries(new FormData(form)); state.calculated = false; }
      else { state.profile = Object.fromEntries(new FormData(form)); state.matched = false; }
      const message = root.querySelector(isCalc ? '#md-career-calculation' : '#md-career-matches');
      message.innerHTML = `<p class="ct-note">${t(isCalc ? 'staleCalc' : 'updated', data.lang)}</p>`;
      // Keep field errors until a valid resubmission; this avoids silently hiding other errors.
    };
    root.addEventListener('input', changed);
    root.addEventListener('change', changed);
    root.addEventListener('reset', event => {
      event.preventDefault();
      const isCalc = event.target.id === 'md-career-calculator', data = snapshot();
      if (isCalc) { state.salary = { ...defaults }; state.calculated = false; }
      else { state.profile = blankProfile(); state.matched = false; }
      const values = isCalc ? state.salary : state.profile;
      for (const [key, value] of Object.entries(values)) event.target.elements.namedItem(key).value = value;
      showErrors(event.target, {}, data.lang); updateOutputs(root, data);
    });
    root.addEventListener('click', event => {
      if (event.target.closest('[data-ct-edit]')) root.querySelector('#md-career-park')?.focus();
    });
  }
  function refresh() {
    const app = document.getElementById('app'); if (!app) return;
    const { page, jobTab } = document.body.dataset, data = snapshot();
    const params = new URLSearchParams(location.search), id = params.get('id');
    const workerListing = page === 'jobs' && (window.MDLocale?.jobsState?.(location)?.tab
      ?? (params.get('tab') === 'internal' ? 'internal' : jobTab || 'worker')) === 'worker';
    const detail = data.jobs.find(job => job.id === id && job.open === true && job.type === 'worker');
    const results = workerListing ? app.querySelector('#jobResults') : null;
    // Pagination follows the native results. Older shells may omit result IDs.
    const host = workerListing ? app.querySelector('#pages') || results || app.querySelector('.listing-controls') : page === 'detail' && detail ? app.querySelector('.detail-main .detail-block:last-child') || app.querySelector('.detail-info') : null;
    let root = app.querySelector('#md-career-tools');
    let discover = app.querySelector('[data-ct-discover]');
    if (!results && discover) { discover.remove(); discover = null; }
    if (!host) { root?.remove(); mountedHost = null; mountedSignature = ''; return; }
    const signature = JSON.stringify([data.lang, data.ready, data.jobs]);
    if (root && mountedHost === host && mountedSignature === signature && (!results || discover)) return;
    // Leave the renderPage function untouched; observe only its resulting public markup.
    const focused = root?.contains(document.activeElement) ? document.activeElement.id : '';
    if (!root) {
      root = document.createElement('section'); root.id = 'md-career-tools'; root.className = 'ct-tools';
      root.setAttribute('aria-labelledby', 'md-career-title');
      host.insertAdjacentElement('afterend', root); wire(root);
    }
    if (results && !discover) {
      discover = document.createElement('a'); discover.href = '#md-career-tools';
      discover.className = 'ct-discover'; discover.dataset.ctDiscover = '';
      discover.addEventListener('click', event => {
        const disclosure = app.querySelector('#md-career-tools')?.querySelector('.ct-optional');
        if (!disclosure) return;
        event.preventDefault(); state.optionalOpen = true;
        disclosure.open = true;
        const summary = disclosure.querySelector('summary');
        summary.focus({ preventScroll: true }); summary.scrollIntoView({ block: 'start', behavior: 'auto' });
      });
      results.insertAdjacentElement('afterend', discover);
    }
    if (discover) discover.textContent = optionalText('link', data.lang);
    root.lang = data.lang;
    root.innerHTML = markup(data); updateOutputs(root, data);
    mountedHost = host; mountedSignature = signature;
    if (focused) root.querySelector(`#${focused}`)?.focus({ preventScroll: true });
  }
  function schedule() {
    if (queued) return; queued = true;
    queueMicrotask(() => { queued = false; refresh(); });
  }
  function start() {
    refresh();
    const app = document.getElementById('app');
    if (app && !observer) {
      observer = new MutationObserver(records => {
        // Mutations within our own output must never trigger an observer/render loop.
        if (records.some(record => !record.target.closest?.('#md-career-tools'))) schedule();
      });
      observer.observe(app, { childList: true, subtree: true });
    }
  }
  window.MDCareerTools = Object.freeze({ calculate, rankJobs, validateProfile, jobLink, defaults, weights, copy, refresh, start });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
