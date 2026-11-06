/* Editorial examples for the prototype. These are proposed working methods, not client case studies or delivery commitments. */
window.MDEditorial = (() => {
  'use strict';
  const localeIndex = { vi: 0, en: 1, zh: 2, ko: 3 };
  const labels = {
    outputs: ['Đầu ra đề xuất', 'Proposed deliverables', '建议交付内容', '제안 산출물'],
    discuss: ['Trao đổi về giải pháp này', 'Discuss this solution', '咨询此方案', '이 솔루션 문의하기'],
    coordination: ['Phối hợp & tiêu chí nghiệm thu', 'Responsibilities & acceptance', '职责与验收标准', '역할 분담 및 검토 기준'],
    client: ['Doanh nghiệp xác nhận', 'The business confirms', '企业确认', '기업 확인 사항'],
    team: ['Đầu mối dịch vụ chuẩn bị', 'The service coordinator prepares', '服务对接人准备', '서비스 담당자 준비 사항'],
    acceptance: ['Cùng kiểm tra trước khi triển khai', 'Check together before proceeding', '实施前共同核对', '진행 전 공동 확인'],
    scenario: ['Sơ đồ phối hợp minh họa', 'Illustrative coordination blueprint', '协作流程示例', '협력 진행 예시'],
    scenarioNote: ['Ví dụ minh họa cách phối hợp; không phải kết quả thực tế của khách hàng.', 'Illustrative example of coordination; not real client results.', '协作方式示例，并非真实客户成果。', '협력 방식을 설명하는 예시이며 실제 고객 성과가 아닙니다.'],
    context: ['Bối cảnh', 'Context', '背景', '상황'],
    approach: ['Cách tiếp cận đề xuất', 'Proposed approach', '建议方式', '제안 방식'],
    decision: ['Điểm cần chốt', 'Decision to confirm', '需确认的事项', '결정할 사항'],
    question: ['Câu hỏi nên đặt ra', 'Questions to ask', '建议提问', '확인할 질문'],
    takeaway: ['Điều nên mang theo', 'Your practical takeaway', '实用提示', '기억할 점']
  };
  const services = {
    supply: {
      scope: ['Phù hợp khi doanh nghiệp cần chuyển kế hoạch sản xuất thành nhu cầu tuyển dụng có thể triển khai theo từng vị trí và ca làm.', 'For businesses turning a production plan into a practical hiring brief for each role and shift.', '适用于需要将生产计划转化为具体岗位、班次招聘需求的企业。', '생산 계획을 직무와 교대조별 실행 가능한 채용 수요로 정리할 때 적합합니다.'],
      outputs: [
        ['Bảng nhu cầu theo vị trí, địa điểm và ca: tách nhu cầu đã xác nhận khỏi dự kiến; ghi rõ ngày cần người và người duyệt.', 'A role, site and shift matrix: separate confirmed demand from forecasts, with target start dates and an approval owner.', '岗位、地点与班次需求表：区分已确认需求和预测需求，注明计划到岗日期及审批人。', '직무·사업장·교대조별 수요표: 확정 수요와 예상 수요를 구분하고 희망 입사일과 승인 담당자를 기록합니다.'],
        ['Phiếu tiêu chí ứng viên và thông tin công việc: nhiệm vụ, điều kiện làm việc, cách tính thu nhập và các điểm cần xác minh.', 'A candidate brief and job information sheet covering tasks, working conditions, income components and facts still to verify.', '候选人要求与岗位信息表：包含工作任务、工作条件、收入组成及待核实事项。', '지원자 요건 및 직무 안내서: 업무, 근무 환경, 급여 구성과 추가 확인 사항을 정리합니다.'],
        ['Danh sách theo dõi từ liên hệ đến tiếp nhận: trạng thái ứng viên, lịch hẹn, vướng mắc và đầu mối xử lý.', 'An outreach-to-onboarding tracker showing candidate status, appointments, open issues and the person handling each issue.', '从联系到入职的跟进表：记录候选人状态、预约安排、待解决问题及负责人。', '연락부터 입사 안내까지의 관리표: 지원자 진행 상태, 일정, 미해결 사항과 담당자를 기록합니다.']
      ],
      client: ['Xác nhận nhu cầu thực tế, nội dung tuyển dụng, điều kiện tại nơi làm việc và người quyết định tiếp nhận.', 'Confirm actual demand, recruitment information, site conditions and who makes the hiring decision.', '确认实际需求、招聘信息、工作现场条件及录用决策人。', '실제 수요, 채용 안내 내용, 현장 근무 조건과 채용 결정권자를 확인합니다.'],
      team: ['Đề xuất kế hoạch tiếp cận, biểu mẫu sàng lọc và cách cập nhật tiến độ; đánh dấu thông tin chưa được doanh nghiệp xác nhận.', 'Propose outreach, screening templates and progress reporting; clearly flag information awaiting business confirmation.', '提出招聘接触计划、筛选模板和进度更新方式，标记尚待企业确认的信息。', '지원자 모집 방안, 검토 양식과 진행 상황 공유 방식을 제안하고 기업 확인이 필요한 정보를 표시합니다.'],
      checks: [
        ['Mỗi vị trí có tiêu chí rõ ràng; nội dung trao đổi với ứng viên khớp với bản doanh nghiệp đã duyệt.', 'Each role has clear criteria, and candidate communications match the approved job brief.', '每个岗位都有明确标准，与候选人沟通的信息与企业批准的内容一致。', '각 직무의 요건이 명확하고 지원자 안내 내용이 기업 승인 내용과 일치하는지 확인합니다.'],
        ['Thống nhất cách ghi nhận tiếp nhận, lý do chưa phù hợp và quy trình cập nhật khi nhu cầu thay đổi.', 'Agree how to record starts, reasons a match did not proceed and changes in demand.', '约定到岗记录、未达成匹配原因及需求变更的更新流程。', '입사 현황, 채용이 진행되지 않은 사유와 수요 변경 사항을 기록하는 방식을 합의합니다.']
      ],
      scenario: [
        ['Một nhà máy dự kiến bổ sung ca làm nhưng số người và thời điểm vẫn có thể thay đổi.', 'A factory plans an additional shift, while headcount and timing may still change.', '一家工厂计划增加班次，但人数和时间仍可能调整。', '공장에서 교대조 추가를 검토 중이며 필요 인원과 시작 시점은 변경될 수 있습니다.'],
        ['Tách nhu cầu chắc chắn và dự phòng; chốt điều kiện công việc trước khi tiếp cận ứng viên; cập nhật theo từng ca.', 'Separate confirmed and contingency demand, approve job conditions before outreach and track progress by shift.', '区分确定需求和备用需求，在联系候选人前确认岗位条件，并按班次更新进度。', '확정 수요와 예비 수요를 나누고, 모집 전에 근무 조건을 승인받은 뒤 교대조별로 진행 상황을 관리합니다.'],
        ['Ai duyệt thay đổi và ai xác nhận ứng viên đã được tiếp nhận tại nhà máy?', 'Who approves changes, and who confirms a candidate has been received at the factory?', '由谁批准变更，由谁确认候选人已在工厂完成接收？', '수요 변경은 누가 승인하고, 지원자의 현장 도착과 접수는 누가 확인하나요?']
      ]
    },
    recruitment: {
      scope: ['Phù hợp khi cần tìm người cho vị trí cụ thể và muốn đánh giá ứng viên bằng tiêu chí thống nhất giữa các bên.', 'For a specific vacancy where everyone involved needs a consistent way to assess candidates.', '适用于具体岗位招聘，需要各方按照统一标准评估候选人的情况。', '특정 직무를 채용하며 관계자 간에 일관된 지원자 평가 기준이 필요할 때 적합합니다.'],
      outputs: [
        ['Bảng tiêu chí vị trí: tách kỹ năng bắt buộc, kỹ năng có thể đào tạo và bằng chứng cần hỏi trong phỏng vấn.', 'A role scorecard separating essential skills, trainable skills and evidence to explore in an interview.', '岗位评价表：区分必备技能、可培训技能及面试中需要了解的实际经验。', '직무 평가표: 필수 역량, 교육 가능한 역량과 면접에서 확인할 경험을 구분합니다.'],
        ['Mẫu hồ sơ đề xuất: kinh nghiệm liên quan, điểm phù hợp, điểm cần kiểm chứng, kỳ vọng và thời điểm có thể nhận việc.', 'A candidate summary covering relevant experience, fit, open questions, expectations and possible availability.', '候选人推荐摘要：记录相关经验、匹配点、待核实问题、期望条件及可到岗时间。', '지원자 검토 요약: 관련 경험, 적합한 점, 추가 확인 사항, 희망 조건과 입사 가능 시점을 정리합니다.'],
        ['Luồng phỏng vấn và phản hồi: vòng đánh giá, người tham gia, cách ghi nhận quyết định và thông báo cho ứng viên.', 'An interview and feedback workflow with stages, participants, decision records and candidate communication.', '面试与反馈流程：明确评估阶段、参与人员、决策记录及候选人通知方式。', '면접 및 피드백 절차: 평가 단계, 참여자, 결정 기록과 지원자 안내 방식을 정리합니다.']
      ],
      client: ['Chốt mô tả công việc, điều kiện tuyển dụng, người đánh giá chuyên môn và người phê duyệt quyết định.', 'Approve the job description and hiring terms, and identify technical assessors and the final decision-maker.', '确认职位说明和招聘条件，指定专业评估人员及最终决策人。', '직무 설명과 채용 조건을 승인하고, 전문 역량 평가자와 최종 결정권자를 지정합니다.'],
      team: ['Chuẩn bị thông tin ứng viên được phép chia sẻ, điều phối lịch trao đổi và tổng hợp phản hồi theo tiêu chí đã thống nhất.', 'Prepare candidate information cleared for sharing, coordinate conversations and consolidate feedback against the agreed criteria.', '整理获准分享的候选人资料，协调沟通安排，并按照约定标准汇总反馈。', '공유가 허용된 지원자 정보를 준비하고 면접 일정을 조율하며 합의된 기준에 따라 피드백을 취합합니다.'],
      checks: [
        ['Nhận xét phân biệt thông tin đã xác minh, lời ứng viên cung cấp và nội dung cần đánh giá thêm.', 'Distinguish verified facts, candidate statements and points requiring further assessment.', '评价中区分已核实事实、候选人陈述及需进一步评估的内容。', '확인된 사실, 지원자 진술과 추가 평가가 필요한 사항을 구분합니다.'],
        ['Mỗi quyết định có lý do liên quan đến công việc; ứng viên biết bước tiếp theo và đầu mối liên hệ.', 'Record job-related reasons for decisions, and give candidates a clear next step and contact.', '记录与岗位相关的决策理由，让候选人了解下一步及联系人员。', '채용 결정의 직무 관련 사유를 기록하고 지원자에게 다음 단계와 연락 담당자를 안내합니다.']
      ],
      scenario: [
        ['Doanh nghiệp cần tuyển kỹ thuật viên bảo trì cho thiết bị đang vận hành.', 'A business needs a maintenance technician for equipment already in operation.', '企业需要为在用设备招聘维修技术人员。', '기업에서 현재 가동 중인 설비를 담당할 유지보수 기술자를 채용하려 합니다.'],
        ['Làm rõ loại thiết bị và nhiệm vụ thực tế; dùng câu hỏi tình huống đã được người phụ trách chuyên môn duyệt để đánh giá.', 'Clarify equipment and actual tasks, then assess with scenario questions approved by the technical lead.', '明确设备类型和实际任务，使用经专业负责人确认的情境问题进行评估。', '설비 종류와 실제 업무를 확인한 후 기술 책임자가 검토한 상황 질문으로 역량을 평가합니다.'],
        ['Kỹ năng nào cần có ngay, kỹ năng nào có thể đào tạo và ai xác nhận mức độ đáp ứng?', 'Which skills are needed on day one, which can be taught, and who confirms readiness?', '哪些技能入职时必须具备，哪些可以培训，由谁确认是否符合要求？', '입사 시 필요한 역량과 교육 가능한 역량은 무엇이며, 준비 여부는 누가 확인하나요?']
      ]
    },
    factory: {
      scope: ['Phù hợp khi cần làm rõ cách tiếp nhận và phối hợp nhân sự theo điều kiện vận hành của nhà máy hoặc khu công nghiệp.', 'For clarifying workforce onboarding and coordination around the operating conditions of a factory or industrial site.', '适用于需要结合工厂或工业园区运营条件，明确人员接收与协作方式的情况。', '공장이나 산업단지의 운영 여건에 맞춰 인력 입사 절차와 협력 방식을 정리할 때 적합합니다.'],
      outputs: [
        ['Sơ đồ tiếp nhận: hướng dẫn đến nhà máy, điểm liên hệ, giấy tờ cần xác nhận và người phụ trách từng bước.', 'An arrival and onboarding map with directions, contacts, documents to confirm and an owner for each step.', '到岗接收流程图：包含路线、联系人员、待确认材料及每一步的负责人。', '현장 도착 및 입사 안내도: 오시는 길, 연락처, 확인할 서류와 단계별 담당자를 정리합니다.'],
        ['Bảng phân công giữa nhân sự, quản lý ca và đầu mối dịch vụ; ghi rõ việc nào cần nhà máy phê duyệt.', 'A responsibility matrix across HR, shift supervisors and the service coordinator, marking items requiring site approval.', '人事、班组负责人及服务对接人的职责表，注明需要工厂批准的事项。', '인사팀, 교대조 관리자와 서비스 담당자의 역할표를 작성하고 현장 승인이 필요한 항목을 표시합니다.'],
        ['Sổ theo dõi vướng mắc: lịch ca, hướng dẫn ban đầu, thông tin thiếu và cách chuyển việc đến đúng người xử lý.', 'An issue log for shift arrangements, initial instructions and missing information, with a clear route to the right owner.', '问题跟进表：记录班次安排、入职指导及信息缺漏，并明确转交负责人的路径。', '교대 일정, 초기 안내와 누락 정보에 대한 관리표를 마련하고 적절한 담당자에게 전달하는 절차를 정합니다.']
      ],
      client: ['Xác nhận nội quy, điều kiện làm việc, yêu cầu đào tạo và an toàn tại cơ sở; chỉ định người có thẩm quyền hướng dẫn.', 'Confirm site rules, working conditions, training and safety requirements; designate authorised people to provide instruction.', '确认现场规章、工作条件、培训和安全要求，指定有权限的人员进行指导。', '현장 규정, 근무 조건, 교육 및 안전 요건을 확인하고 안내 권한이 있는 담당자를 지정합니다.'],
      team: ['Tổng hợp hướng dẫn đã được phê duyệt, điều phối thông tin tiếp nhận và chuyển vướng mắc đến người phụ trách của nhà máy.', 'Consolidate approved guidance, coordinate arrival information and route issues to the responsible site contact.', '汇总已批准的指引，协调到岗信息，并将问题交给工厂相应负责人。', '승인된 안내 사항을 정리하고 현장 접수 정보를 조율하며 문제를 해당 현장 담당자에게 전달합니다.'],
      checks: [
        ['Thông tin ca làm và điểm tiếp nhận thống nhất giữa ứng viên, đầu mối dịch vụ và quản lý nhà máy.', 'Candidates, the service coordinator and site managers share the same shift and arrival information.', '候选人、服务对接人和工厂管理人员掌握一致的班次与接收信息。', '지원자, 서비스 담당자와 현장 관리자가 동일한 교대 일정과 접수 정보를 알고 있는지 확인합니다.'],
        ['Các bước hướng dẫn và xác nhận điều kiện làm việc có người chịu trách nhiệm; vấn đề chưa xử lý được ghi nhận rõ.', 'Instruction and working-condition checks have named owners; unresolved issues remain visible.', '指导及工作条件确认环节均有指定负责人，未解决事项有明确记录。', '초기 안내와 근무 조건 확인에 담당자가 지정되어 있고 미해결 사항이 기록되어 있는지 확인합니다.']
      ],
      scenario: [
        ['Một bộ phận đổi lịch ca trong khi nhóm nhân sự mới sắp đến nhận việc.', 'A department changes its shift pattern shortly before a new group arrives.', '一个部门调整班次，而一批新员工即将到岗。', '신규 인력이 출근하기 직전에 한 부서의 교대 일정이 변경됩니다.'],
        ['Kiểm tra lịch đã duyệt, cập nhật hướng dẫn đến nơi làm việc và xác nhận người phụ trách tiếp nhận, đào tạo.', 'Check the approved schedule, update arrival instructions and confirm who handles reception and training.', '核对已批准的班次，更新到岗指引，并确认接收与培训负责人。', '승인된 일정을 확인하고 현장 방문 안내를 갱신하며 접수 및 교육 담당자를 확인합니다.'],
        ['Ai thông báo thay đổi, ai xác nhận đã nhận thông tin và việc gì còn phải hoàn tất trước khi bắt đầu?', 'Who communicates the change, who acknowledges it, and what must be completed before work starts?', '由谁通知变更，由谁确认收到，还有哪些事项必须在开始工作前完成？', '변경 사항은 누가 전달하고 수신 여부는 누가 확인하며, 업무 시작 전에 무엇을 완료해야 하나요?']
      ]
    },
    consulting: {
      scope: ['Phù hợp khi doanh nghiệp chưa rõ thiếu người ở đâu, nguyên nhân nào cần ưu tiên hoặc phương án nào phù hợp với vận hành.', 'For businesses clarifying where workforce gaps arise, what drives them and which response fits their operations.', '适用于需要明确用工缺口、优先处理的原因及适合运营情况的方案的企业。', '인력 부족이 발생하는 지점과 원인을 파악하고 운영에 맞는 대응 방안을 검토할 때 적합합니다.'],
      outputs: [
        ['Bản đồ hiện trạng: nhu cầu theo bộ phận, nguồn dữ liệu, điểm nghẽn và giả định chưa được kiểm chứng.', 'A current-state map of departmental demand, available evidence, bottlenecks and assumptions still to validate.', '现状图：梳理部门需求、数据来源、瓶颈和待验证的假设。', '현황표: 부서별 수요, 근거 자료, 병목 요인과 검증이 필요한 가정을 정리합니다.'],
        ['Bảng so sánh phương án: tuyển mới, điều chỉnh phối hợp hoặc cải thiện tiếp nhận; nêu điều kiện, nguồn lực và đánh đổi.', 'An options comparison covering recruitment, coordination changes or onboarding improvements, with prerequisites, resources and trade-offs.', '方案比较表：比较新增招聘、协作调整或入职流程优化，列明前提条件、所需资源和取舍。', '대안 비교표: 신규 채용, 협업 방식 조정 또는 입사 절차 개선의 전제 조건, 필요 자원과 장단점을 비교합니다.'],
        ['Đề cương thử nghiệm: phạm vi nhỏ, người phụ trách, dữ liệu cần theo dõi và điều kiện để tiếp tục hoặc điều chỉnh.', 'A pilot outline with a limited scope, accountable owners, evidence to collect and criteria for continuing or adjusting.', '试行方案：明确有限范围、负责人、需收集的信息，以及继续或调整的判断标准。', '시범 운영안: 적용 범위, 책임자, 수집할 자료와 유지 또는 조정 판단 기준을 정합니다.']
      ],
      client: ['Cung cấp bối cảnh, dữ liệu được phép sử dụng, các giới hạn vận hành và người có thẩm quyền quyết định.', 'Provide operating context, data cleared for use, practical constraints and a decision-maker.', '提供业务背景、获准使用的数据、运营限制及决策负责人。', '운영 상황, 사용 가능한 자료, 현장 제약과 의사결정 담당자를 제공합니다.'],
      team: ['Làm rõ giả định, tổng hợp lựa chọn và đề xuất tiêu chí đánh giá; tách nhận định khỏi bằng chứng đã có.', 'Clarify assumptions, compare options and propose evaluation criteria, separating hypotheses from existing evidence.', '澄清假设、汇总选项并提出评估标准，区分判断与已有证据。', '가정을 명확히 하고 대안을 정리하며 평가 기준을 제안합니다. 추정과 확인된 근거를 구분합니다.'],
      checks: [
        ['Mỗi phương án nêu rõ vấn đề cần giải quyết, dữ liệu còn thiếu và người chịu trách nhiệm cho bước kế tiếp.', 'Each option names the problem it addresses, missing evidence and an owner for the next step.', '每个方案说明要解决的问题、缺失信息及下一步负责人。', '각 대안이 해결할 문제, 부족한 자료와 다음 단계 담당자를 명시합니다.'],
        ['Tiêu chí đánh giá được thống nhất trước khi thử; không coi giả định hoặc dự báo là kết quả đã đạt.', 'Agree evaluation criteria before the pilot; do not present assumptions or forecasts as achieved results.', '试行前约定评估标准，不将假设或预测描述为已取得的成果。', '시범 운영 전에 평가 기준을 합의하고 가정이나 예측을 달성한 성과로 제시하지 않습니다.']
      ],
      scenario: [
        ['Một bộ phận thường xuyên báo thiếu người nhưng chưa rõ vướng ở tuyển dụng, lịch ca hay khâu tiếp nhận.', 'A department repeatedly reports shortages without knowing whether recruitment, scheduling or onboarding is the cause.', '某部门经常反映缺人，但尚不清楚问题出在招聘、排班还是入职接收。', '한 부서에서 인력 부족이 반복되지만 채용, 교대 편성, 입사 절차 중 어디에서 문제가 생기는지 불분명합니다.'],
        ['Đối chiếu nhu cầu và dữ liệu hiện có, trao đổi với người vận hành rồi chọn một điểm nghẽn để kiểm tra trước.', 'Compare demand with available records, consult the operating team and select one bottleneck to investigate first.', '核对需求和现有记录，与运营人员沟通，先选定一个瓶颈进行验证。', '수요와 기존 기록을 비교하고 운영 담당자와 협의한 뒤 먼저 확인할 병목 요인을 정합니다.'],
        ['Thông tin nào sẽ cho thấy phương án đang giải quyết đúng nguyên nhân?', 'What evidence would show that the proposed change addresses the actual cause?', '哪些信息能够说明该方案正在解决真正的原因？', '제안한 변화가 실제 원인을 해결하는지 어떤 자료로 판단할 수 있나요?']
      ]
    }
  };

  const articles = {
    'xu-huong-kcn': {
      title: ['Tìm việc tại khu công nghiệp: từ tin tuyển dụng đến quyết định', 'Industrial park jobs: from a listing to a decision', '工业园区求职：从招聘信息到做出决定', '산업단지 취업: 공고 확인부터 결정까지'],
      summary: ['Một cách kiểm tra công việc, ca làm và đường đi để lựa chọn dựa trên thông tin rõ ràng.', 'A practical way to check the role, shifts and commute before choosing your next job.', '核对岗位、班次和通勤信息，在信息清楚的基础上做出选择。', '직무, 교대 근무와 통근 조건을 확인하고 충분한 정보를 바탕으로 일자리를 선택하는 방법입니다.'],
      sections: [
        {
          heading: ['Đọc vị trí cụ thể trước khi nhìn mức thu nhập', 'Understand the role before comparing income', '先了解岗位，再比较收入', '급여를 비교하기 전에 직무를 확인하세요'],
          body: ['Cùng một tên “nhân viên sản xuất” có thể chỉ những công việc rất khác nhau. Hãy ghi lại điều tin tuyển dụng đã nêu và tách riêng điều còn thiếu; tên khu công nghiệp chưa đủ để xác định nơi làm việc.', 'The same “production worker” title can describe very different tasks. Write down what the listing confirms and what remains unclear. An industrial park name alone does not identify your workplace.', '同样叫“生产员工”，实际任务可能很不一样。记录招聘信息已经说明的内容，并单独列出缺失的信息。只有园区名称，还不能确定具体工作地点。', '같은 “생산직” 공고라도 실제 업무는 다를 수 있습니다. 공고에서 확인한 내용과 아직 모르는 내용을 나눠 적어 보세요. 산업단지 이름만으로는 정확한 근무지를 알 수 없습니다.'],
          bullets: [
            ['Xác định nhà máy, địa chỉ làm việc, bộ phận và nhiệm vụ chính; phân biệt với địa điểm phỏng vấn.', 'Confirm the factory, work address, department and main tasks; distinguish the workplace from the interview venue.', '确认工厂、工作地址、部门和主要任务，并区分工作地点与面试地点。', '공장, 근무지 주소, 부서와 주요 업무를 확인하고 면접 장소와 실제 근무지를 구분하세요.'],
            ['Hỏi về tư thế làm việc, thiết bị sử dụng, môi trường và phần hướng dẫn trước khi bắt đầu.', 'Ask about working posture, equipment, the environment and instruction before starting.', '询问工作姿势、使用设备、工作环境及上岗前的指导安排。', '작업 자세, 사용하는 장비, 현장 환경과 업무 시작 전 교육을 물어보세요.'],
            ['Làm rõ kinh nghiệm cần có và phần được đào tạo; không tự suy ra từ tên vị trí.', 'Clarify required experience and what training is provided rather than inferring this from the title.', '明确所需经验和培训内容，不要仅凭岗位名称推断。', '직무명으로 판단하지 말고 필요한 경험과 교육받을 수 있는 내용을 확인하세요.']
          ]
        },
        {
          heading: ['Đặt ca làm cạnh lịch sinh hoạt thực tế', 'Check the shift against your daily routine', '结合日常安排核对班次', '교대 일정을 생활 패턴과 함께 살펴보세요'],
          body: ['Một công việc phù hợp cần tính cả hành trình đến nơi làm và trở về. Lịch xe, chỗ ở và trách nhiệm gia đình có thể ảnh hưởng đến khả năng theo ca lâu dài.', 'A suitable job also needs a workable journey there and back. Transport schedules, accommodation and family responsibilities can affect whether a shift pattern works for you.', '一份合适的工作，也需要可行的往返安排。交通班次、住宿和家庭事务都会影响你是否能适应轮班。', '적합한 일자리인지 판단하려면 출퇴근도 함께 고려해야 합니다. 교통편, 거주지와 가족 돌봄 일정이 교대 근무 가능 여부에 영향을 줄 수 있습니다.'],
          bullets: [
            ['Kiểm tra giờ bắt đầu, kết thúc, cách đổi ca và cách thông báo thay đổi.', 'Check start and finish times, shift rotation and how changes are communicated.', '核对上下班时间、轮班方式及变更通知方式。', '시작·종료 시간, 교대 순환 방식과 변경 안내 방법을 확인하세요.'],
            ['Nếu có xe đưa đón, hỏi điểm đón, giờ xe và phương án khi kết thúc ca muộn.', 'If transport is offered, ask about pickup points, timetables and options after a late finish.', '如提供接送，询问上车点、时间表及晚下班时的安排。', '통근버스가 있다면 승차 장소, 운행 시간과 늦게 퇴근할 때의 이동 방법을 물어보세요.'],
            ['Tự tính chi phí đi lại, ăn ở và thời gian dành cho việc riêng trước khi so sánh hai công việc.', 'Consider travel and living costs, plus time for personal commitments, when comparing jobs.', '比较岗位时，把通勤、食宿开支以及个人事务所需时间一起考虑。', '두 일자리를 비교할 때 교통비, 식비·주거비와 개인 일정에 필요한 시간도 고려하세요.']
          ],
          questions: ['“Ca làm thường thay đổi thế nào? Nếu lịch đổi, tôi sẽ nhận thông báo từ ai và qua kênh nào?”', '“How do shifts usually change, and who will notify me through which channel?”', '“班次通常怎样调整？如果变更，由谁通过什么方式通知我？”', '“교대 일정은 어떻게 바뀌며, 변경 시 누구에게 어떤 방식으로 안내받나요?”']
        },
        {
          heading: ['Xác nhận trước khi đến phỏng vấn hoặc nhận việc', 'Confirm the details before you travel', '出发面试或到岗前再次确认', '면접이나 출근 전에 다시 확인하세요'],
          body: ['Lưu lại tin tuyển dụng và nội dung đã trao đổi. Nếu thông tin mới khác với tin ban đầu, hãy yêu cầu người liên hệ giải thích và gửi lại nội dung đã thống nhất để bạn có thể kiểm tra.', 'Keep the listing and a record of the conversation. If new details differ from the original listing, ask your contact to explain and send the agreed information for you to review.', '保存招聘信息和沟通记录。如果新信息与原招聘内容不同，请联系人解释，并发送双方确认的内容以便核对。', '채용 공고와 상담 내용을 보관하세요. 새로 안내받은 내용이 원래 공고와 다르다면 담당자에게 설명과 확인된 내용을 요청해 검토하세요.'],
          bullets: [
            ['Xác nhận đơn vị tuyển dụng, người liên hệ, địa điểm, thời gian và giấy tờ cần mang.', 'Confirm the recruiting organisation, contact person, venue, time and documents to bring.', '确认招聘单位、联系人、地点、时间和需携带的材料。', '채용 주체, 담당자, 장소, 시간과 지참 서류를 확인하세요.'],
            ['Hỏi rõ mục đích của giấy tờ được yêu cầu và chỉ gửi thông tin cần thiết qua kênh đã xác minh.', 'Ask why requested documents are needed, and share only necessary information through a verified channel.', '询问所需材料的用途，仅通过核实过的渠道提供必要信息。', '요청받은 서류의 용도를 묻고 확인된 연락 경로로 필요한 정보만 전달하세요.']
          ]
        }
      ],
      takeaway: ['Lập một ghi chú gồm: việc làm gì, ở đâu, ca nào, thu nhập tính ra sao và liên hệ ai. Chỗ nào chưa rõ, hãy hỏi trước khi quyết định.', 'Keep one note covering tasks, location, shifts, income calculation and your contact. Resolve the blanks before deciding.', '用一份笔记记录：做什么、在哪里、上什么班、收入如何计算、联系谁。决定前先问清空白项。', '업무, 장소, 교대 일정, 급여 계산 방식과 연락 담당자를 한곳에 기록하세요. 모르는 부분은 결정 전에 확인하세요.']
    },
    'chinh-sach-phuc-loi': {
      title: ['Đọc thông tin thu nhập và phúc lợi trước khi nhận việc', 'How to review pay and benefits before accepting a role', '接受工作前，如何看懂收入与福利', '입사 결정 전 급여와 복리후생 확인하기'],
      summary: ['Tách từng khoản thu nhập, kiểm tra điều kiện áp dụng và đặt đúng câu hỏi để so sánh công việc.', 'Separate income components, check eligibility and ask the questions that make job comparisons useful.', '区分收入项目、核对适用条件，通过具体问题比较工作机会。', '급여 항목을 구분하고 적용 조건을 확인해 일자리를 비교하는 데 필요한 질문을 정리합니다.'],
      sections: [
        {
          heading: ['Phân biệt khoản cố định và khoản phụ thuộc điều kiện', 'Separate fixed pay from conditional amounts', '区分固定收入与有条件收入', '고정 급여와 조건부 지급 항목을 구분하세요'],
          body: ['Khoảng “tổng thu nhập” trong tin tuyển dụng có thể gộp nhiều khoản. Để hiểu một con số, cần biết nó được tính với ca làm, thời lượng làm việc và điều kiện nào. Đừng tự coi mức cao nhất là khoản chắc chắn nhận được.', 'A “total income” range can combine several components. To understand the figure, ask which shifts, working hours and conditions it assumes. Do not treat the highest figure as an amount you will necessarily receive.', '招聘信息中的“综合收入”可能包含多个项目。要理解这个数字，需要知道它基于哪些班次、工作时长和条件。不要把最高金额当作必然可以获得的收入。', '공고의 “총 급여”에는 여러 항목이 포함될 수 있습니다. 어떤 교대 근무, 근무 시간과 조건을 기준으로 계산했는지 확인하세요. 최고 금액을 반드시 받는 급여로 생각하지 않는 것이 좋습니다.'],
          bullets: [
            ['Hỏi riêng mức lương cho công việc theo lịch làm việc thỏa thuận.', 'Ask separately about pay for the role under the agreed working schedule.', '单独询问按约定工作安排计算的岗位工资。', '합의한 근무 일정에 따른 직무 급여를 별도로 확인하세요.'],
            ['Với phụ cấp hoặc thưởng, ghi lại điều kiện, cách tính và thời điểm chi trả.', 'For each allowance or bonus, record the conditions, calculation method and payment timing.', '对每项津贴或奖金，记录适用条件、计算方式和发放时间。', '수당이나 상여는 지급 조건, 계산 방식과 지급 시기를 기록하세요.'],
            ['Yêu cầu giải thích các khoản khấu trừ được thông báo và cách thể hiện trên bảng thanh toán.', 'Ask for an explanation of any stated deductions and how they appear on the pay statement.', '请对方解释告知的扣款项目，以及这些项目如何体现在工资单上。', '안내된 공제 항목의 의미와 급여 명세서 표시 방식을 설명받으세요.']
          ],
          questions: ['“Khoảng thu nhập này gồm những khoản nào? Nếu điều kiện làm việc của tôi khác giả định đó thì cách tính thay đổi ra sao?”', '“What makes up this range, and how would the calculation change if my working conditions differ from those assumptions?”', '“这个收入范围包含哪些项目？如果我的工作安排与计算假设不同，金额会怎样变化？”', '“이 급여 범위에는 어떤 항목이 포함되며, 제 근무 조건이 계산 기준과 다르면 어떻게 달라지나요?”']
        },
        {
          heading: ['Đọc phúc lợi cùng điều kiện sử dụng', 'Read benefits alongside their conditions', '结合使用条件了解福利', '복리후생의 이용 조건도 확인하세요'],
          body: ['“Có hỗ trợ” chưa cho biết hỗ trợ theo hình thức nào hoặc ai được sử dụng. Một khoản tiền, một dịch vụ do đơn vị bố trí và khoản hoàn trả chi phí có thể tạo trải nghiệm rất khác nhau.', '“Support provided” does not explain its form or who can use it. A cash allowance, an arranged service and reimbursement of expenses can work very differently.', '“提供支持”并不能说明支持的形式或适用对象。现金补贴、统一安排的服务和费用报销，实际使用方式可能很不一样。', '“지원 제공”이라는 문구만으로 지원 방식이나 이용 대상을 알 수는 없습니다. 현금 수당, 회사가 마련한 서비스와 비용 환급은 이용 방식이 다를 수 있습니다.'],
          bullets: [
            ['Bữa ăn: cung cấp tại nơi làm việc hay hỗ trợ tiền; áp dụng cho ca nào?', 'Meals: supplied on site or paid as an allowance, and for which shifts?', '餐食：现场提供还是发放补贴，适用于哪些班次？', '식사: 현장 제공인지 식대 지급인지, 어떤 교대조에 적용되는지 확인하세요.'],
            ['Chỗ ở và xe đưa đón: địa điểm, điều kiện đăng ký, chi phí người lao động cần tự trả.', 'Housing and transport: locations, registration conditions and costs you would cover yourself.', '住宿和接送：地点、申请条件以及需要自行承担的费用。', '숙소와 통근 교통편: 위치, 신청 조건과 본인 부담 비용을 확인하세요.'],
            ['Đào tạo và các chương trình khác: nội dung, đối tượng tham gia, người giải đáp và tài liệu áp dụng.', 'Training and other programmes: content, eligibility, contact person and the applicable written information.', '培训及其他项目：内容、适用对象、咨询人员和相关书面说明。', '교육 및 기타 제도: 내용, 참여 대상, 문의 담당자와 적용 안내 자료를 확인하세요.']
          ]
        },
        {
          heading: ['So sánh bằng cùng một bộ câu hỏi', 'Use the same questions for each job', '用同一组问题比较岗位', '같은 질문으로 일자리를 비교하세요'],
          body: ['Khi so sánh, đặt các công việc cạnh nhau theo cùng lịch làm việc và cùng loại khoản thu nhập. Ghi “chưa xác nhận” thay vì tự điền thông tin còn thiếu. Với điều khoản ảnh hưởng đến quyết định, hãy xin tài liệu áp dụng và đọc trước khi đồng ý.', 'Compare roles using the same working schedule and the same categories of income. Mark missing details as “unconfirmed” rather than filling them in yourself. Ask for the applicable written terms before agreeing to conditions that affect your decision.', '比较时，尽量使用相同的工作安排和收入项目分类。缺失的信息标记为“待确认”，不要自行补全。对于影响决定的条件，应先索取并阅读适用的书面说明。', '같은 근무 일정과 같은 급여 항목을 기준으로 비교하세요. 부족한 정보는 추정하지 말고 “미확인”으로 표시하세요. 결정에 영향을 주는 조건은 적용 문서를 요청해 동의 전에 읽어보세요.'],
          questions: ['“Thông tin nào sẽ được ghi trong giấy tờ nhận việc? Nếu có điểm khác với nội dung đã tư vấn, tôi cần trao đổi với ai?”', '“Which details will appear in my joining documents, and whom should I contact if they differ from what we discussed?”', '“哪些信息会写入入职材料？如果与沟通内容不同，我应该联系谁？”', '“입사 관련 서류에는 어떤 조건이 기재되며, 상담 내용과 다르면 누구에게 문의해야 하나요?”']
        }
      ],
      takeaway: ['Giữ một bảng so sánh với ba cột: khoản được thông báo, điều kiện áp dụng và nội dung cần xác nhận. Sự rõ ràng giúp bạn chọn phù hợp với hoàn cảnh của mình.', 'Keep three columns: the stated benefit or pay item, its conditions and what still needs confirmation. Clarity helps you choose for your circumstances.', '建立三列比较表：告知的收入或福利项目、适用条件、待确认内容。信息越清楚，越容易结合自身情况选择。', '안내된 급여·복지 항목, 적용 조건, 추가 확인 사항을 세 칸으로 정리하세요. 명확한 정보가 자신의 상황에 맞는 선택에 도움이 됩니다.']
    },
    'kinh-nghiem-phong-van': {
      title: ['Chuẩn bị phỏng vấn bằng kinh nghiệm thật và câu hỏi rõ', 'Prepare for an interview with real examples and clear questions', '用真实经历和明确问题准备面试', '실제 경험과 명확한 질문으로 면접 준비하기'],
      summary: ['Chuẩn bị điều cần kể, điều cần hỏi và bước tiếp theo để cuộc trao đổi hữu ích cho cả hai bên.', 'Plan what to explain, what to ask and what comes next so the conversation works for both sides.', '准备好要说明的经历、要问的问题和后续步骤，让沟通对双方都有帮助。', '설명할 경험, 확인할 질문과 다음 단계를 준비해 서로에게 도움이 되는 면접을 진행하세요.'],
      sections: [
        {
          heading: ['Trước buổi gặp: hiểu việc và kiểm tra thông tin', 'Before the meeting: understand the role and the arrangements', '面试前：了解岗位并核对安排', '면접 전: 직무와 일정을 확인하세요'],
          body: ['Đọc lại tin tuyển dụng và chọn những nhiệm vụ bạn hiểu rõ nhất, cùng những điểm cần hỏi thêm. Bạn không cần thuộc một bài giới thiệu dài; cần giúp người phỏng vấn hiểu kinh nghiệm và khả năng đáp ứng công việc của mình.', 'Read the listing again and identify both familiar tasks and points you need explained. You do not need a memorised speech; you need to help the interviewer understand your experience and readiness for the work.', '重新阅读招聘信息，找出自己熟悉的任务和需要进一步询问的内容。不必背诵长篇自我介绍，重点是让面试者理解你的经历和岗位适应情况。', '공고를 다시 읽고 익숙한 업무와 추가 설명이 필요한 부분을 나눠 보세요. 긴 자기소개를 외우기보다 면접관이 자신의 경험과 업무 준비 상태를 이해하도록 설명하는 것이 중요합니다.'],
          bullets: [
            ['Xác nhận địa điểm hoặc đường dẫn, giờ hẹn, người liên hệ và giấy tờ đã được yêu cầu.', 'Confirm the venue or meeting link, time, contact person and requested documents.', '确认地点或会议链接、时间、联系人及要求携带的材料。', '장소나 접속 링크, 약속 시간, 연락 담당자와 요청받은 서류를 확인하세요.'],
            ['Chuẩn bị phần giới thiệu ngắn: kinh nghiệm liên quan, công việc muốn làm và lịch có thể bắt đầu.', 'Prepare a short introduction: relevant experience, the work you want and when you could start.', '准备简短介绍：相关经历、希望从事的工作及可开始的时间。', '관련 경험, 희망 업무와 입사 가능 시점을 짧게 소개할 수 있도록 준비하세요.'],
            ['Ghi sẵn các giới hạn thực tế về ca làm hoặc đi lại để trao đổi chính xác.', 'Note practical constraints around shifts or travel so you can discuss them accurately.', '提前记下班次或通勤方面的实际限制，以便准确沟通。', '교대 근무나 통근에 관한 현실적인 제약을 적어 두고 정확히 설명하세요.']
          ]
        },
        {
          heading: ['Kể một việc đã làm, không chỉ một điểm mạnh', 'Describe something you did, not just a strength', '讲清做过的事，而不只是优点', '장점만 말하기보다 실제 했던 일을 설명하세요'],
          body: ['Một ví dụ cụ thể giúp người nghe hiểu cách bạn làm việc. Chọn một tình huống có thật và nói rõ phần mình trực tiếp thực hiện. Nếu chưa có kinh nghiệm đúng vị trí, có thể dùng việc học, việc trước đây hoặc hoạt động khác có liên quan.', 'A specific example shows how you work. Choose a real situation and explain your own contribution. If you lack experience in this exact role, use a relevant example from study, previous work or another activity.', '具体例子能让对方了解你的工作方式。选择真实情境，说明自己直接完成的部分。如果没有完全对应的岗位经验，可以使用学习、以前工作或其他相关活动中的例子。', '구체적인 사례는 일하는 방식을 보여줍니다. 실제 상황을 고르고 직접 맡았던 부분을 설명하세요. 해당 직무 경험이 없다면 학업, 이전 업무나 관련 활동에서 사례를 찾을 수 있습니다.'],
          bullets: [
            ['Bối cảnh: nhiệm vụ là gì và điều gì cần xử lý?', 'Context: what was the task, and what needed attention?', '背景：任务是什么，哪些问题需要处理？', '상황: 어떤 업무였으며 무엇을 처리해야 했나요?'],
            ['Hành động: bạn đã làm gì, phối hợp với ai và hỏi lại khi chưa rõ như thế nào?', 'Action: what did you do, whom did you work with and how did you clarify uncertainties?', '行动：你做了什么、与谁协作、遇到不清楚的地方如何确认？', '행동: 무엇을 했고 누구와 협력했으며 불분명한 점은 어떻게 확인했나요?'],
            ['Kết quả và bài học: điều gì thay đổi, điều gì chưa đạt và lần sau bạn sẽ làm gì khác?', 'Outcome and learning: what changed, what remained unresolved and what would you do differently?', '结果与收获：有什么变化、还有哪些不足、下次会怎样调整？', '결과와 배움: 무엇이 달라졌고 무엇이 남았으며 다음에는 어떻게 하겠나요?']
          ],
          questions: ['“Tôi chưa sử dụng loại thiết bị này. Vị trí yêu cầu kinh nghiệm đầu vào thế nào và có phần hướng dẫn nào trước khi bắt đầu?”', '“I have not used this equipment before. What experience is required, and what instruction is provided before starting?”', '“我之前没有使用过这类设备。岗位要求哪些已有经验，开始前会提供什么指导？”', '“이 장비는 사용해 본 적이 없습니다. 어떤 경험이 필요하며 업무 시작 전 어떤 교육을 받게 되나요?”']
        },
        {
          heading: ['Kết thúc bằng những điểm đã hiểu và bước kế tiếp', 'Finish with shared understanding and a next step', '结束前确认共识和下一步', '확인한 내용과 다음 단계로 마무리하세요'],
          body: ['Phỏng vấn cũng là lúc bạn kiểm tra mức độ phù hợp của công việc. Ưu tiên các câu hỏi ảnh hưởng trực tiếp đến quyết định và nhắc lại điều đã hiểu để tránh hai bên diễn giải khác nhau.', 'An interview also lets you assess whether the job suits you. Prioritise questions that affect your decision, and repeat back your understanding to avoid different interpretations.', '面试也是你判断岗位是否合适的机会。优先询问影响决定的事项，并复述自己的理解，避免双方理解不一致。', '면접은 자신에게 맞는 일자리인지 확인하는 자리이기도 합니다. 결정에 영향을 주는 질문을 우선하고, 이해한 내용을 다시 말해 서로 다르게 해석한 부분이 없는지 확인하세요.'],
          bullets: [
            ['“Khi bắt đầu, tôi sẽ được hướng dẫn những gì và ai là người hỗ trợ trực tiếp?”', '“What guidance will I receive when I start, and who will support me directly?”', '“开始工作时会有哪些指导，由谁直接协助我？”', '“업무를 시작할 때 어떤 안내를 받으며 직접 도와줄 담당자는 누구인가요?”'],
            ['“Nhiệm vụ và ca làm thực tế có điểm nào khác nội dung tin tuyển dụng không?”', '“Do the actual tasks or shifts differ from the listing in any way?”', '“实际任务或班次与招聘信息有不同之处吗？”', '“실제 업무나 교대 일정 중 공고 내용과 다른 부분이 있나요?”'],
            ['“Bước tiếp theo là gì, tôi sẽ được liên hệ qua đâu và có thể hỏi lại ai?”', '“What is the next step, how will you contact me and whom can I follow up with?”', '“下一步是什么，会通过什么方式联系我，我可以向谁跟进？”', '“다음 단계는 무엇이고 어떤 방식으로 연락받으며 추가 문의는 누구에게 하면 되나요?”']
          ]
        }
      ],
      takeaway: ['Sau buổi gặp, ghi lại điều đã thống nhất, câu hỏi còn mở và đầu mối theo dõi. Một quyết định tốt bắt đầu từ thông tin trung thực và rõ ràng ở cả hai phía.', 'After the conversation, note what was agreed, open questions and your follow-up contact. A useful decision starts with clear, honest information on both sides.', '面试后，记录双方确认的内容、未解决的问题及跟进联系人。清楚、真实的双向信息有助于做出合适的决定。', '면접 후 합의한 내용, 남은 질문과 후속 연락 담당자를 기록하세요. 양측의 명확하고 정직한 정보가 적절한 결정의 출발점입니다.']
    }
  };

  const fallbackEscape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const index = lang => localeIndex[String(lang || 'vi').toLowerCase().split(/[-_]/)[0]] ?? 0;
  const local = (value, lang) => value?.[index(lang)] || value?.[0] || '';
  const encoder = escape => typeof escape === 'function' ? value => escape(String(value ?? '')) : fallbackEscape;

  function renderServiceDetail(serviceId, lang, escape) {
    const service = Object.prototype.hasOwnProperty.call(services, serviceId) ? services[serviceId] : null;
    if (!service) return '';
    const E = encoder(escape), t = value => E(local(value, lang));
    const list = items => `<ul class="editorial-list">${items.map(item => `<li>${t(item)}</li>`).join('')}</ul>`;
    return `<div class="editorial-service">
      <p class="editorial-scope">${t(service.scope)}</p>
      <a class="btn red md-blueprint-cta" href="lien-he.html?service=${E(serviceId)}&amp;lang=${E(Object.keys(localeIndex)[index(lang)])}">${t(labels.discuss)}<span aria-hidden="true">→</span></a>
      <section class="md-service-blueprint">
        <h3 class="editorial-heading">${t(labels.scenario)}</h3>
        <p class="editorial-note">${t(labels.scenarioNote)}</p>
        <div class="md-blueprint-grid">${['context', 'approach', 'decision'].map((key, i) => `<div class="md-blueprint-stage"><span class="md-blueprint-step">${i + 1}</span><h4>${t(labels[key])}</h4><p>${t(service.scenario[i])}</p></div>`).join('')}</div>
      </section>
      <details class="editorial-detail"><summary>${t(labels.outputs)}</summary><div class="editorial-detail-body">${list(service.outputs)}</div></details>
      <details class="editorial-detail"><summary>${t(labels.coordination)}</summary><div class="editorial-detail-body">
        <dl class="editorial-responsibilities"><div><dt>${t(labels.client)}</dt><dd>${t(service.client)}</dd></div><div><dt>${t(labels.team)}</dt><dd>${t(service.team)}</dd></div></dl>
        <h4 class="editorial-subheading">${t(labels.acceptance)}</h4>${list(service.checks)}
      </div></details>
    </div>`;
  }

  function renderArticle(postId, lang, escape) {
    const article = Object.prototype.hasOwnProperty.call(articles, postId) ? articles[postId] : null;
    if (!article) return '';
    const E = encoder(escape), t = value => E(local(value, lang));
    return `<div class="editorial-article">${article.sections.map(section => `<section class="editorial-section">
      <h2>${t(section.heading)}</h2><p>${t(section.body)}</p>
      ${section.bullets ? `<ul class="editorial-list">${section.bullets.map(item => `<li>${t(item)}</li>`).join('')}</ul>` : ''}
      ${section.questions ? `<aside class="editorial-question"><h3>${t(labels.question)}</h3><p>${t(section.questions)}</p></aside>` : ''}
    </section>`).join('')}<aside class="editorial-takeaway"><h2>${t(labels.takeaway)}</h2><p>${t(article.takeaway)}</p></aside></div>`;
  }

  function articleMeta(postId, lang) {
    const article = Object.prototype.hasOwnProperty.call(articles, postId) ? articles[postId] : null;
    if (!article) return null;
    const summary = local(article.summary, lang);
    return { title: local(article.title, lang), summary, excerpt: summary, readMinutes: 3 };
  }

  // The CMS and public article renderer share this content source. Plain text
  // keeps the editor portable while the public page retains semantic sections.
  function articleRecord(postId, lang) {
    const article = Object.prototype.hasOwnProperty.call(articles, postId) ? articles[postId] : null;
    if (!article) return null;
    const text = value => local(value, lang);
    const body = article.sections.map(section => [
      text(section.heading), text(section.body),
      ...(section.bullets || []).map(item => '• ' + text(item)),
      ...(section.questions ? [text(labels.question), text(section.questions)] : [])
    ].join('\n')).concat([text(labels.takeaway) + '\n' + text(article.takeaway)]).join('\n\n');
    return { title: text(article.title), excerpt: text(article.summary), body };
  }

  return Object.freeze({ renderServiceDetail, renderArticle, articleMeta, articleRecord });
})();
