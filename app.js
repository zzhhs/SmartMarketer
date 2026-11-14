(() => {
 const root = document.getElementById('dahua');
 const main = root.querySelector('main');
 const nav = root.querySelector('nav');
 const labels = ['账号中心','文案创作','爆款选题','视频剪辑','大华 AI 数字人','AI 外脑','技能库'];

 const rows = [
 ['67','AI 中转站正在控制你的电脑','3,009','561','842','1,108'],
 ['59','下一代大模型：持续学习','2,052','135','912','321'],
 ['38.4','大模型该怎么继续 Scaling?','1,013','39','326','72']
 ];
 const regions = [['广东',24],['四川',7],['浙江',7],['山东',7],['江苏',6],['上海',5],['湖南',4],['湖北',4],['河南',4],['福建',3]];
 const materials = ['大华企业 AI 化完整学习笔记：从业务问题到可运行产品','Gemini-AI-Studio 聊天记录_2026-07-23'];
 const skills = ['对标账号拆解','爆款视频自动采集','账号数据整理','视频二创','大华数字人','剪辑包装'];
 const summary = '参考口播摘要（视频只展示了部分原稿）：作者讨论第三方 AI 中转站和来源不明的工具可能带来的安全风险，提醒关注工具所获权限以及本地文件和凭据的保护。';
 const goals = ['建立认知','建立专业信任','获取咨询线索'];
 const formats = ['人物全屏口播','小窗口讲解','横屏演示'];
 const draft = {title:'',goal:goals[1],reference:'',external:'',body:'',material:'',notes:'',avatarTitle:'',avatarBody:'',editTitle:''};
 const storageKey = 'smartmarketer-workbench-v1';
 let page = 0, format = 0, category = '全部', output = '';
 try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  for (const key of Object.keys(draft)) {
   if (typeof saved.draft?.[key] === 'string') draft[key] = saved.draft[key];
  }
  if (formats[saved.format]) format = saved.format;
 } catch {
  // The workbench also runs when browser storage is unavailable.
 }
 function save() {
  try {
   localStorage.setItem(storageKey, JSON.stringify({draft, format}));
  } catch {
   // Keep current edits in memory if the browser blocks storage.
  }
 }
 const media = {"avatar": "assets/avatar.jpg", "original": "assets/original.jpg", "transcript": "assets/transcript.jpg"};
 const esc = (s) => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
 const box = (html) => '<section class="box stack">'+html+'</section>';
 const h = (label) => '<h2>'+label+'</h2>';
 const btn = (label,action,primary=false) => '<button type="button" '+(primary?'class="primary" ':'')+'data-action="'+action+'">'+label+'</button>';
 const image = (key, alt) => '<img class="reference" alt="'+alt+'" src="'+media[key]+'">';
 const controls = (html) => '<div class="controls">'+html+'</div>';
 const stats = (pairs) => '<div class="grid">'+pairs.map(([label,value])=>box('<small>'+label+'</small><div class="metric">'+value+'</div>')).join('')+'</div>';
 const field = (label,key,multi=false) => '<label>'+label+(multi?'<textarea data-field="'+key+'">'+esc(draft[key])+'</textarea>':'<input data-field="'+key+'" value="'+esc(draft[key])+'">')+'</label>';
 const picker = (items,key,current) => controls(items.map((label,i)=>'<button type="button" data-'+key+'="'+i+'" aria-pressed="'+(i===current)+'">'+label+'</button>').join(''));
 const table = (headers,records) => '<div class="table-wrap"><table><thead><tr>'+headers.map(x=>'<th scope="col">'+x+'</th>').join('')+'</tr></thead><tbody>'+records.map(row=>'<tr>'+row.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
 const categories=['全部','本地资料','资料库','网页','抖音','课程','飞书妙记'];
 const accountCards = (items) => '<div class="grid">'+items.map(([label,description])=>box('<strong>'+label+'</strong><p>'+description+'</p>')).join('')+'</div>';
 function trendChart() {
  // Approximate the unlabeled daily points from the reference frame.
  const values = [500,200,0,750,400,0,300,4100,0,10100,0,9200,2600,1600,1100,650,3700,45566,17476,3500,7700,12122,3900];
  const x = (i) => 55 + i * 30;
  const y = (value) => 210 - value / 46000 * 175;
  const points = values.map((value,i)=>x(i)+','+y(value)).join(' ');
  const grid = [0,11500,23000,34500,46000].map(value=>'<line x1="55" x2="715" y1="'+y(value)+'" y2="'+y(value)+'"/><text x="47" y="'+(y(value)+4)+'" text-anchor="end">'+value.toLocaleString('en-US')+'</text>').join('');
  const dates = [0,5,10,15,20,22].map(i=>'<text x="'+x(i)+'" y="232" text-anchor="middle">08/'+String(i+5).padStart(2,'0')+'</text>').join('');
  const labels = [17,18,21].map(i=>'<circle cx="'+x(i)+'" cy="'+y(values[i])+'" r="4"/><text x="'+x(i)+'" y="'+(y(values[i])-10)+'" text-anchor="middle">'+values[i].toLocaleString('en-US')+'</text>').join('');
  return '<svg class="account-trend" viewBox="0 0 740 245" role="img" aria-label="播放趋势，8 月 22 日最高 45,566 次">'+grid+dates+'<polygon points="55,210 '+points+' 715,210"/><polyline points="'+points+'"/>'+labels+'</svg><small>标注数值来自视频，未标注的每日播放量按原图走势估绘。</small>';
 }
 const link='https://www.douyin.com/video/7677190265979890681';
 const accountKey = 'smartmarketer-account-matrix-v1';
 let accounts = [];
 try {
  const saved = JSON.parse(localStorage.getItem(accountKey) || '[]');
  if (Array.isArray(saved)) accounts = saved;
 } catch {}
 let selectedAccount = 'all';
 const metricFields = [['plays','近 30 天播放'],['likes','点赞'],['comments','评论']];
 function recordedTrend(accounts) {
  const series = accounts.filter(account=>account.daily).map(account=>account.daily.split(',').map(Number));
  if (!series.length) return '<div class="empty">暂无每日播放数据，可在编辑账号中录入。</div>';
  const totals = series[0].map((_,i)=>series.reduce((sum,values)=>sum+values[i],0));
  const max = Math.max(1,...totals);
  const points = totals.map((value,i)=>(55+i*660/29)+','+(210-value/max*175)).join(' ');
  return '<svg class="account-trend" viewBox="0 0 740 245" role="img" aria-label="近 30 天每日播放趋势">'+
   '<text x="55" y="24">峰值 '+Math.max(...totals).toLocaleString('zh-CN')+'</text>'+
   '<polygon points="55,210 '+points+' 715,210"/><polyline points="'+points+'"/>'+
   '<text x="55" y="235">第 1 天</text><text x="715" y="235" text-anchor="end">第 30 天</text></svg>'+
   '<small>已录入趋势的账号 '+series.length+' / '+accounts.length+' 个</small>';
 }
 const carSamples = [
  ['电车实测局','电车测评人','续航、补能与能耗','高速跑完 300 公里还剩多少电？'],
  ['十万块选车','预算型购车顾问','十万元内新车横评','十万元落地，这三台怎么选？'],
  ['周末带娃开车','二孩家庭车主','家用 SUV 与儿童座椅','后排放两张儿童座椅还坐得下人吗？'],
  ['二手车验车笔记','二手车检测师','验车流程与避坑','看二手车先查这三个位置'],
  ['通勤车研究所','城市通勤族','小车、油耗与停车','每天通勤 40 公里一个月花多少？'],
  ['露营装车清单','自驾露营玩家','车载装备与装载方案','一家三口的露营装备怎么装？'],
  ['修理厂老周','汽修技师','日常保养与故障排查','什么时候该换刹车片？'],
  ['新手司机小林','新手女司机','驾驶练习与用车经验','第一次独立上高速的准备清单'],
  ['智驾体验簿','智能驾驶体验者','辅助驾驶与座舱体验','拥堵路段体验辅助驾驶'],
  ['经典车相册','汽车摄影爱好者','经典车型与汽车文化','老款旅行车为什么值得拍？']
 ].map(([name,persona,direction,post],i)=>{
  const daily = Array.from({length:30},(_,day)=>700+i*145+(day*331+i*653)%2400+(day===(i*7+12)%30?4600+i*290:0));
  return {name,persona,direction,post,daily:daily.join(','),plays:daily.reduce((a,b)=>a+b,0),
   likes:1260+i*273,comments:123+i*29,stage:i===9?'筹备中':'运营中',sample:true,
   followers:i===9?0:680+i*437, maleShare:[74,58,43,82,55,63,79,39,71,68][i],
   ageShares:[12+i,35-i,33,15,5], regionShares:[24-i,15+i,12,10,8,31]};
 });
 function audienceProfile(accounts) {
  const empty = '<div class="empty">暂无粉丝画像数据</div>';
  const samples = accounts.filter(account=>account.sample && account.followers);
  if (!samples.length) return box(h('账号粉丝画像')+empty);
  const followers = samples.reduce((sum,account)=>sum+account.followers,0);
  const weighted = value => Math.round(samples.reduce((sum,account)=>sum+account.followers*value(account),0)/followers);
  const male = weighted(account=>account.maleShare);
  const bars = (labels, shares) => labels.map((label,i)=>
   '<div><small>'+label+' · '+shares[i]+'%</small><div class="bar"><span style="width:'+shares[i]+'%"></span></div></div>'
  ).join('');
  const ages = ['23 岁及以下','24–30 岁','31–40 岁','41–50 岁','51 岁及以上'];
  const locations = ['广东','江苏','浙江','山东','四川','其他'];
  return box(h('账号粉丝画像')+'<small>'+followers.toLocaleString('zh-CN')+' 粉丝 · 模拟数据</small>'+
   '<div class="split">'+box(h('性别与年龄分布')+'<small>男性 '+male+'% · 女性 '+(100-male)+'%</small>'+
    bars(ages,ages.map((_,i)=>weighted(account=>account.ageShares[i]))))+
   box(h('地区分布')+bars(locations,locations.map((_,i)=>weighted(account=>account.regionShares[i]))))+'</div>');
 }
 function accountDetails(included, selected) {
  const samples = included.filter(account=>account.sample);
  const works = samples.flatMap(account=>{
   if (account.stage!=='运营中') return [];
   const plays = Math.round(account.plays/4);
   return [{account,title:account.post,plays,likes:Math.round(account.likes/4),
    comments:Math.round(account.comments/4),saves:Math.round(plays/100),shares:Math.round(plays/550)}];
  });
  const ranked = [...works].sort((a,b)=>b.comments-a.comments);
  const empty = message => '<div class="empty">'+message+'</div>';
  const scope = selected ? esc(selected.name) : '汽车账号矩阵';
  return box(h('全部已发布作品')+(works.length ?
   '<small>汽车账号模拟作品 · '+works.length+' 条</small>'+table(['作品','账号','播放','点赞','评论','收藏','转发'],
    works.map(work=>[esc(work.title),esc(work.account.name),work.plays.toLocaleString('zh-CN'),work.likes,work.comments,work.saves,work.shares])) :
   empty('暂无已发布作品数据')))+
   box(h('评论区需求信号')+(ranked.length ? '<small>按模拟作品评论量排序</small>'+
    accountCards(ranked.slice(0,3).map(work=>[work.comments+' 条评论',esc(work.title)])) : empty('暂无作品评论数据')))+
   audienceProfile(included)+
   box(h('阶段复盘')+(samples.length ?
    '<p>'+scope+' · 模拟运营复盘</p>'+h('目标差距')+
    stats([['运营中账号',String(samples.filter(account=>account.stage==='运营中').length)],['筹备中账号',String(samples.filter(account=>account.stage==='筹备中').length)],['模拟作品',String(works.length)]])+
    h('内容结构复盘')+(ranked.length ?
     accountCards(ranked.slice(0,3).map(work=>[esc(work.account.direction),esc(work.title)])) : empty('暂无已发布作品可供复盘'))+
    h('定位进展')+accountCards(samples.map(account=>[esc(account.name),esc(account.stage+' · '+account.direction)])) :
    empty('暂无阶段复盘')))+
   box(h('下一批优先拍什么')+(samples.length ?
    accountCards(samples.map(account=>[esc(account.name),'围绕「'+esc(account.direction)+'」制作一期实测或答疑。'])) :
    empty('暂无选题计划'))+h('下一轮执行动作')+(samples.length ?
    accountCards([['验证选题','把评论集中的问题做成下一期内容，发布后记录完播和收藏。'],
     ['更新数据','按账号回填播放和互动表现，复盘各方向的内容效果。']]) : empty('暂无执行计划')));
 }
 function accountCenter() {
  const roster = [...accounts,...carSamples];
  const selected = roster[Number(selectedAccount)];
  const included = selected ? [selected] : roster;
  const showDemo = selectedAccount === 'demo';
  const totals = metricFields.map(([key,label])=>{
   const values = included.map(account=>account[key]).filter(value=>value !== '' && value != null);
   return [label, values.length ? values.reduce((sum,value)=>sum+Number(value),0).toLocaleString('zh-CN') : '—'];
  });
  const choice = (key,content,style='') => '<button type="button" class="'+style+'" data-action="select-account:'+key+'" aria-pressed="'+(selectedAccount===String(key))+'">'+content+'</button>';
  return '<div class="account-layout"><div class="stack">'+(showDemo ? accountDemo() :
   box(h('账号经营总览')+'<p>'+esc(selected?.name || '全部账号')+' · '+(selected?.sample?'模拟数据':selected?'手动录入':accounts.length?'含 10 个模拟账号':'10 个汽车模拟账号')+'</p>'+stats(totals))+
   box(h('近 30 天播放趋势')+recordedTrend(included)))+
   '</div><section class="box stack account-list"><div class="row">'+h('账号矩阵')+btn('绑定新账号','add-account',true)+'</div>'+
   choice('all','<strong>全部账号</strong><small>'+accounts.length+' 个已登记 · 10 个模拟</small>')+
   '<div class="account-tiles">'+roster.map((account,index)=>choice(index,
    '<div class="account-tile-head"><span class="account-mark" aria-hidden="true">'+esc(account.name[0])+'</span><strong>'+esc(account.name)+'</strong></div>'+
    '<small>'+esc(account.stage || '运营中')+' · '+esc(account.sample?'模拟账号':account.handle)+'</small>'+
    '<span>'+esc(account.persona)+'</span><small>'+esc(account.direction)+'</small>','account-tile')).join('')+'</div>'+
   (selected && !selected.sample ? '<div>'+btn('编辑账号','edit-account')+'</div>' : '')+
   choice('demo','<small>查看原有 AI 运营示例</small>')+'</section></div>'+
   (showDemo ? accountDemoDetails() : accountDetails(included, selected));
 }
 function editAccount(index, source) {
  const account = accounts[index];
  const input = (key,label,attrs='required maxlength="120"')=>'<label>'+label+'<input name="'+key+'" '+attrs+' value="'+esc(account?.[key] ?? '')+'"></label>';
  drawer(account?'编辑账号':'绑定新账号','<form class="stack" data-account-index="'+index+'"><small>账号登记保存在当前浏览器，经营数据可手动填写。</small>'+
   input('name','账号名称')+input('handle','小红书号')+input('persona','人设')+input('direction','运营方向')+
   '<label>运营状态<select name="stage">'+['筹备中','运营中','已暂停'].map(stage=>'<option'+(stage===account?.stage?' selected':'')+'>'+stage+'</option>').join('')+'</select></label>'+
   metricFields.map(([key,label])=>input(key,label+'（选填）','type="number" min="0" max="299999999970"')).join('')+
   '<label>每日播放（选填，按同一统计周期从早到晚填写 30 个数字，用逗号分隔）<textarea name="daily">'+esc(account?.daily || '')+'</textarea></label>'+
   '<p role="alert" hidden></p><div><button class="primary" type="submit">保存账号</button></div></form>',source);
 }
 function accountDemo() {
  return box(h('账号经营总览')+'<p>视频演示数据</p>'+stats([['近 30 天播放','127,314'],['点赞','1,587'],['评论','432'],['可见样本收藏率','—']]))+
   box(h('近 30 天播放趋势')+trendChart()+stats([['30 天总播放','127,314'],['最高播放日','08/22'],['第二波峰值','08/23'],['流量判断','爆款驱动']]));
 }
 function accountDemoDetails() {
  return box(h('全部已发布作品')+'<small>视频画面显示 8 条作品，下表录入可见的 5 条。</small>'+table(['作品','播放','点赞','评论','收藏','转发'],[
 ['一条视频带你了解热门 AI 名词','9,443','226','3','136','18'],
 ['只需要把账号链接发给 AI，它就能够自动采集视频数据、发布文案、评论区，还能转写文案','8,799','144','65','112','48'],
 ['5 位 AI 宝藏博主，普通人学习 AI 必备','6.3 万','2,023','32','2,174','222'],
 ['Codex、Claude Code、Hermes、WorkBuddy 到底应该选哪一个','2.6 万','578','16','491','59'],
 ['Skill 到底是什么？去哪里安装？怎么手搓？','1.1 万','289','1','220','22']
 ]))+
   box(h('评论区需求信号')+stats([['最高评论作品','65 条'],['第二评论作品','32 条'],['第三评论作品','16 条']]))+
   box(h('账号粉丝画像')+'<small>437 粉丝</small><div class="split">'+box(h('男性为主，31–40 岁最集中')+'<div class="metric">91%</div><small>男性 91% · 女性 9%</small>'+[['23 岁以下',23],['24–30 岁',29],['31–40 岁',36],['41–50 岁',9]].map(([name,value])=>'<div><small>'+name+' · '+value+'%</small><div class="bar"><span style="width:'+value+'%"></span></div></div>').join(''))+box(h('地区分布')+regions.map(([name,value])=>'<div><small>'+name+' · '+value+'%</small><div class="bar"><span style="width:'+value/24*100+'%"></span></div></div>').join(''))+'</div>')+
   box(h('阶段复盘')+'<p>数字人账号已跑出首轮增长，播放与增粉高度集中在少数 AI 实操内容。</p><small>2026-07-29 至 2026-08-27</small>'+h('目标差距')+stats([['播放集中度','前 2 条贡献 72% 播放'],['观看表现','平均播放 15.75 秒'],['互动表现','单条最高 65 评论'],['业务承接','官方客资字段未取得']])+h('内容结构复盘')+accountCards([
    ['流量内容','AI 博主清单承担大规模增长'],
    ['专业信任','工具对比与 Skill 解释持续建立专业标签'],
    ['互动内容','对标账号自动采集最能带动评论']
   ])+h('定位进展')+accountCards([
    ['已建立','AI 实操与工具筛选、Agent 与 Skill 知识、数字人稳定输出'],
    ['待加强','工作台业务流程、内容到咨询的验证、数字人口播节奏']
   ]))+
   box(h('下一批优先拍什么')+accountCards([
    ['01','我把数字人账号单独拉进了一个新媒体工作台，数据不会再和真人号混在一起'],
    ['02','为什么同样讲 AI，清单内容 6 万播放，教程内容只有几千'],
    ['03','把一条对标视频丢给 AI，它如何变成选题、文案和数字人成片'],
    ['04','数字人口播最容易犯的错：解释太多，结果出现太晚']
   ])+h('下一轮执行动作')+accountCards([
    ['复刻高表现结构','保留清单和工具对比，每条内容聚焦一个任务。'],
    ['压缩数字人口播','把结果提前，减少铺垫。']
   ]));
 }
 function render() {
  nav.innerHTML=labels.map((label,i)=>'<button type="button" data-page="'+i+'" '+(page===i?'aria-current="page"':'')+'>'+label+'</button>').join('');
  const views=[
   accountCenter,

   () => '<div class="split">'+box(h('选题')+'<small>本次产物 · 标题 + 完整口播稿</small>'+field('选题','title')+'<strong>这条内容主要承担什么任务</strong>'+picker(goals,'goal',goals.indexOf(draft.goal))+'<div class="split">'+field('对标视频链接（选填）','reference')+field('其他外部链接（选填）','external')+'</div>'+field('大华原话、真实经历或必须写进去的材料（选填）','body',true)+'<div class="notice">'+(draft.material?'已关联 AI 外脑资料 · '+esc(draft.material):'AI 外脑资料')+' '+btn('选择资料','library')+'</div>'+controls('<small>先做提取</small><small>不替代大华观点</small><small>按口播标准输出</small>')+'<div class="notice"><strong>系统项目资料</strong><br><small>项目总览 · 大华个人内容资料</small></div><div>'+btn('生成文案','generate',true)+'</div>')+box(h('文案结果')+'<div class="empty" data-output aria-live="polite">'+(output?esc(output):'等待生成 · 文案会直接出现在这里')+'</div>')+'</div>',
   () => box('<div class="row">'+h('最近 7 天高质量对标视频')+controls(btn('打开飞书完整榜单','feishu',true)+btn('刷新','refresh'))+'</div>')+
   stats([['候选视频','281'],['最近 7 天入榜','3'],['对标账号','8'],['行业关键词','20']])+
   box(h('今日内容机会')+table(['热度分','视频标题','账号','点赞','评论','收藏','转发','操作'],rows.map((row,i)=>[row[0],'<strong>'+row[1]+'</strong>','第四种黑曜星',...row.slice(2),controls(btn('原视频','original:'+i)+btn('视频文案','transcript:'+i)+btn('转入文案创作','write:'+i))]))),
   () => '<div class="split">'+box('<label class="empty">上传需要处理的原视频<small>支持 MP4、MOV</small><input type="file" accept="video/mp4,video/quicktime"></label>'+field('视频标题','editTitle')+h('选择成片样式')+picker(formats,'format',format)+field('补充要求（选填）','notes',true))+box(h('真实执行流程')+'<div class="entry">01　保存原片副本</div><div class="entry">02　按所选母版处理</div><div class="entry">03　样片验收后出成片</div>')+'</div>',
   () => '<div class="split">'+box(h('大华专属数字人')+field('视频标题','avatarTitle')+field('视频文案','avatarBody',true))+box('<div style="width:min(100%,180px);margin:auto">'+image('avatar','大华数字人预览')+'</div>')+'</div>',
   () => box(h('资料库')+stats([['总资料数','21'],['视频资料','6'],['无预览封面','0'],['可直接复用','13']])+picker(categories,'category',categories.indexOf(category))+'<div class="grid">'+(materials.map((label,i)=>category==='全部'||category===categories[i+1]?box('<small>'+categories[i+1]+'</small>'+h(label)+'<p>'+['2.5 万字 · 19 个内容块','410.6 万字 · 88 个内容块'][i]+'</p><div>'+btn('用于写稿','material:'+i)+'</div>'):'').join('')||'<p>视频未展示这一分类下的资料详情。</p>')+'</div>'),
   () => stats([['全部工具','6'],['网页可执行','1'],['工作流编排','0'],['Skill 说明','6']])+'<div class="grid">'+skills.map((label,i)=>box('<small>Skill · '+(i===0?'可直接使用':'说明与本地运行')+'</small>'+h(label+' Skill')+'<div>'+btn('查看说明','skill:'+i)+(i===0?' '+btn('网页执行','execute',true):'')+'</div>')).join('')+'</div>'
  ];
  main.innerHTML='<div class="heading"><div><small>小红书新媒体工作台</small><h1>'+labels[page]+'</h1></div><small>原型演示</small></div><div class="stack">'+views[page]()+'</div>';
  globalThis.lucide?.createIcons({attrs:{width:13,height:13}});
 }
 let opener;
 function close() {
  root.querySelector('.shade')?.remove();
  opener?.focus();
 }
 function drawer(title,content,source) {
  close();
  opener=source;
  const overlay=document.createElement('div');
  overlay.className='shade';
  overlay.innerHTML='<section class="drawer" role="dialog" aria-label="'+esc(title)+'"><div class="row">'+h(title)+btn('关闭','close')+'</div>'+content+'</section>';
  root.append(overlay);
  overlay.querySelector('button').focus();
 }
 root.addEventListener('keydown', e=>{if(e.key==='Escape'&&root.querySelector('.shade'))close();});
 root.addEventListener('input',e=>{if(e.target.dataset.field){draft[e.target.dataset.field]=e.target.value;save();}});
 root.addEventListener('submit',e=>{
  const form=e.target;
  if (form.dataset.accountIndex===undefined) return;
  e.preventDefault();
  const index=Number(form.dataset.accountIndex);
  const account={...accounts[index],...Object.fromEntries(Array.from(new FormData(form),([key,value])=>[key,value.trim()]))};
  const error=form.querySelector('[role="alert"]');
  const fail=message=>{error.hidden=false;error.textContent=message;};
  if (![account.name,account.handle,account.persona,account.direction].every(Boolean)) return fail('请填写账号名称、小红书号、人设和运营方向。');
  if (accounts.some((item,i)=>i!==index && item.handle.toLowerCase()===account.handle.toLowerCase())) return fail('该小红书号已登记。');
  if (account.daily) {
   const daily=account.daily.split(/[,，]/).map(value=>value.trim());
   if (daily.length!==30 || daily.some(value=>!/^\d{1,10}$/.test(value))) return fail('请填写 30 个用逗号分隔的非负整数。');
   account.daily=daily.join(',');
   account.plays=String(daily.reduce((sum,value)=>sum+Number(value),0));
  }
  const next=accounts.slice();
  next[index]=account;
  try {
   localStorage.setItem(accountKey,JSON.stringify(next));
  } catch {
   return fail('无法保存账号，请检查浏览器存储权限。');
  }
  accounts=next;
  close();
  render();
  main.querySelector('[data-action="select-account:'+selectedAccount+'"]').focus();
 });
 root.addEventListener('click',e=>{
  const el=e.target.closest('button');
  if(!el)return;
  const data=el.dataset;
  if(data.page!==undefined){page=Number(data.page);category='全部';render();nav.querySelector('[aria-current]').focus();return;}
  if(data.goal!==undefined||data.format!==undefined){
   const key=data.goal!==undefined?'goal':'format';
   if(key==='goal')draft.goal=goals[Number(data.goal)];
   else format=Number(data.format);
   save();
   main.querySelectorAll('[data-'+key+']').forEach(node=>node.setAttribute('aria-pressed',String(node===el)));
   return;
  }
  if(data.category!==undefined){category=categories[Number(data.category)];render();main.querySelector('[data-category="'+data.category+'"]').focus();return;}
  if(!data.action)return;
  const [action,index]=data.action.split(':');
  const row=rows[Number(index)];
  switch(action){
   case 'select-account': {
    const scrollTop=main.querySelector('.account-tiles').scrollTop;
    selectedAccount=index;
    render();
    main.querySelector('.account-tiles').scrollTop=scrollTop;
    main.querySelector('[data-action="select-account:'+index+'"]').focus({preventScroll:true});
    break;
   }
   case 'add-account':editAccount(accounts.length,el);break;
   case 'edit-account':editAccount(Number(selectedAccount),el);break;
   case 'close':close();break;
   case 'library':page=5;category='全部';render();break;
   case 'material':draft.material=materials[Number(index)];save();page=1;render();break;
   case 'write':
    close();
    draft.title=row[1];
    draft.reference=Number(index)===0?link:'';
    draft.body='内容方向：AI 工作流与效率\n互动数据：点赞 '+row[2]+'，评论 '+row[3]+'，收藏 '+row[4]+'，转发 '+row[5];
    if(Number(index)===0)draft.body+='\n\n'+summary;
    save();output='';page=1;render();main.querySelector('[data-field="title"]').focus();break;
   case 'generate':
    output=draft.title?'预览 · '+draft.goal+'\n'+draft.title+'\n'+draft.body:'请先填写选题。';
    main.querySelector('[data-output]').textContent=output;break;
   case 'original':
   case 'transcript':
    drawer(row[1],(Number(index)===0?image(action,action==='original'?'原视频画面':'视频文案抽屉原帧'):'<p>演示中未打开此条详情。</p>')+'<div>'+btn('转入文案创作','write:'+index,true)+'</div>',el);break;
   case 'refresh':drawer('刷新数据','<p>当前展示视频里的数据快照。</p>',el);break;
   case 'feishu':drawer('飞书完整榜单','<p>视频未提供可打开的飞书表格链接。</p>',el);break;
   case 'skill':drawer(skills[Number(index)]+' Skill','<p>'+(Number(index)===0?'可在网页执行。':'说明与本地运行。')+'</p>',el);break;
   case 'execute':drawer('对标账号拆解 Skill','<p>原型展示技能入口。</p>',el);break;
  }
 });
 render();
})();
