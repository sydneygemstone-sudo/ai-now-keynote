"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type TopicId = "voice" | "create" | "research" | "computer" | "tools" | "build";
type View = "map" | TopicId | "magic";

const assetUrl = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

type Topic = {
  id: TopicId;
  number: string;
  verb: string;
  title: string;
  summary: string;
  question: string;
  minutes: string;
  accent: string;
};

const topics: Topic[] = [
  {
    id: "voice",
    number: "01",
    verb: "对话",
    title: "它听懂现场，也允许你打断",
    summary: "从一问一答，进入持续、可插话、结合图像与搜索的实时协作。",
    question: "和 AI 说话，今天到底新在哪？",
    minutes: "05 MIN",
    accent: "#ff9b72",
  },
  {
    id: "create",
    number: "02",
    verb: "造视觉",
    title: "不只是一张图，是整套视觉世界",
    summary: "品牌、游戏资产、数字人一致性与图生图，可以从一个需求同时展开。",
    question: "一句需求，能长出多少视觉资产？",
    minutes: "12 MIN",
    accent: "#ffc95b",
  },
  {
    id: "research",
    number: "03",
    verb: "做研究",
    title: "互联网变成一支有证据的研究队",
    summary: "它先制定计划，再跑长链搜索，最后把判断与出处一起交回来。",
    question: "不是搜答案，而是做出可核验的决定。",
    minutes: "08 MIN",
    accent: "#72d9be",
  },
  {
    id: "computer",
    number: "04",
    verb: "操作电脑",
    title: "一句话，驱动浏览器和桌面流程",
    summary: "AI 可以看页面、填草稿、整理文件；重要动作前停下来等你批准。",
    question: "让 AI 真正动手，而不只是告诉你怎么点。",
    minutes: "07 MIN",
    accent: "#75b9ff",
  },
  {
    id: "tools",
    number: "05",
    verb: "做工具",
    title: "自然语言，直接变成可用的小程序",
    summary: "清单、家庭工具包、旅行管家、办公仪表盘，都不必停在一份文档。",
    question: "以前买模板，现在现场生成自己的工具。",
    minutes: "09 MIN",
    accent: "#c6a7ff",
  },
  {
    id: "build",
    number: "06",
    verb: "造软件",
    title: "发布会王牌，已经变成普通人的施工队",
    summary: "游戏、网页、原生 App、视觉与测试，从一句开放需求一路做到可运行成品。",
    question: "先看官方最强样片，再看真实同题实测。",
    minutes: "15 MIN",
    accent: "#ff7b88",
  },
];

const prompts = {
  voice:
    "请和我进行自然的实时对话。允许我随时打断；每次只推进一个重点。先问我：今天最想让 AI 帮我完成什么？然后结合我的回答追问一个关键限制。",
  brand:
    "我要开一家面向年轻家庭的社区烘焙店。请先给品牌定位和一句话气质，再保持同一视觉系统，制作：主标志、横版标志、色板、字体方向、包装袋、咖啡杯、门头和三张社交媒体海报。先输出一张完整品牌板，不要零散图片。",
  character:
    "创造一位有鲜明面部特征和服装细节的数字角色。先生成标准正面设定图，再保持脸、发型、服装和身材一致，生成她从早晨通勤、午间工作、傍晚运动到夜晚回家的四个场景。用四宫格展示一致性。",
  model3d:
    "把我上传的产品照片分析为适合 3D 建模的参考包：先给正视、侧视、背视和俯视图，再说明几何结构、材质、尺寸假设和遮挡区域。不要凭空补关键尺寸，把不确定处明确标红。",
  research:
    "我要为悉尼的普通成年人做一次‘当下 AI 能做什么’现场展示。请使用 Deep Research：先给我可编辑的研究计划，再只使用最近 90 天的一手资料，找出 6 个真正可现场演示的前沿能力。每项写：普通人价值、入口、账户限制、现场风险、备用方案和原始来源。先列证据，再给 60 分钟编排建议。",
  computer:
    "这是一个安全现场演示。只操作我指定的本地演示页：读取活动资料，填入对应字段，检查缺失项，然后停在‘提交’按钮前。不要登录、不要发送、不要付款、不要修改演示页以外的内容。停下后截图并汇报你做了什么。",
  build:
    "把我的一句话想法做成可现场玩的单页小程序：先复述目标和验收标准；完成信息架构、视觉设计、交互实现和测试。必须能在笔记本与手机使用，所有按钮有反馈，断网仍能打开。完成后给我运行入口和测试证据，不要给长篇过程报告。",
  magic:
    "开始前，请先复述目标，列出你将使用的资料和权限，并说明你会在哪一步停下来等我确认。不确定就问，不要猜。完成后只给结果、证据和下一步。",
};

const presenterNotes: Record<View, { say: string; do: string; fallback: string }> = {
  map: {
    say: "今天不讲工具名单。让大家直接点一项能力，看看一句自然语言怎样越过中间摩擦，变成研究、工具或成品。",
    do: "请一位观众选一张能力卡，直接进入。任何时候点左上角都能回到全景图。",
    fallback: "全景图和所有真实案例都在本机，断网也能完成主线。",
  },
  voice: {
    say: "大家都用过语音问答。新的部分是：你可以插话、纠正、给图像，它继续接着现场工作，而不是等你写好一整段命令。",
    do: "复制现场开场词，打开当天可用的 ChatGPT Voice 或 Grok 对话入口，做一轮 60 秒短演示。",
    fallback: "直接用屏幕上的三段对话说明可打断、能追问、可结合图像；不要现场排查账户。",
  },
  create: {
    say: "先看渡口：同一个世界观长出背景、角色、界面与游戏。然后现场选一个 benchmark，展示 AI 不是画一张图，而是维护整套视觉系统。",
    do: "先点开大图，再复制品牌整套或数字人一天的提示词。现场只跑一个，其余用现有渡口资产证明。",
    fallback: "现有 17 张渡口视觉资产已内置，生成入口失败也能讲清资产包与一致性。",
  },
  research: {
    say: "搜索是拿到一个答案；深度研究是先规划、持续搜索、整理冲突，最后把出处和判断一起交给你。",
    do: "复制任务，打开 ChatGPT 后选择 Deep Research。完整报告不现场等，展示研究计划与回报结构即可。",
    fallback: "用页面上的四步链路与输出结构讲完，不承诺现场生成速度。",
  },
  computer: {
    say: "重点不是会点击，而是它能理解目标、看页面、完成草稿，并在提交、付款、发送这些动作前停住。",
    do: "先点运行模拟，再复制同一条安全任务到 Codex 或 agent 入口。",
    fallback: "模拟流程完全本地，明确展示停止边界。",
  },
  tools: {
    say: "以前我们买通用 PDF 模板。现在可以说出自己的家庭、旅行或工作场景，让 AI 现场生成能勾选、会计算、可打印的小工具。",
    do: "切换四个工具卡，勾选其中一项，再点生成我的版本。",
    fallback: "所有 mini-app 均为页面内置互动，不依赖在线服务。",
  },
  build: {
    say: "先看模型厂商自己挑出来的王牌：GPT-5.6 从一句开放需求做出完整游戏，Fable 5 把高保真实现、测试和视觉自检放进同一条开发链。再看中文实测和同题对打，最后落回我们自己的真实成品。",
    do: "先播 OpenAI 官方视频 00:17 的造游戏片段；如果现场网络稳定，再打开 Asterism。随后任选一张中文实测卡，直接从标注时间播放。",
    fallback: "六张官方与测评封面已保存在本机；断网时用卡片内容讲完，再打开离线《渡口》证明成品链。",
  },
  magic: {
    say: "像挥一下手，桌上就出现需要的东西：不是现实不需要工作，而是中间的搜索、转写、排版、编码和重复操作正在一层层消失。",
    do: "让观众说一句愿望，输入框演示它如何变成三项可验收结果，最后用目标、证据、停止边界收口。",
    fallback: "使用预置愿望，整段完全离线。",
  },
};

function formatClock(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

function CopyButton({
  label,
  prompt,
  copied,
  onCopy,
  primary = false,
}: {
  label: string;
  prompt: string;
  copied: string | null;
  onCopy: (label: string, prompt: string) => void;
  primary?: boolean;
}) {
  return (
    <button
      className={`action-button ${primary ? "primary" : ""}`}
      onClick={() => onCopy(label, prompt)}
    >
      {copied === label ? "✓ 已复制" : label}
    </button>
  );
}

function TopicHeader({
  topic,
  onBack,
}: {
  topic: Topic;
  onBack: () => void;
}) {
  return (
    <div className="topic-heading">
      <button className="back-map" onClick={onBack}>← 返回能力全景图</button>
      <div className="topic-label" style={{ color: topic.accent }}>
        {topic.number} · {topic.verb} · {topic.minutes}
      </div>
      <h1>{topic.title}</h1>
      <p>{topic.summary}</p>
    </div>
  );
}

function VoiceView({ copied, onCopy, onBack }: { copied: string | null; onCopy: (label: string, prompt: string) => void; onBack: () => void }) {
  const topic = topics[0];
  return (
    <div className="topic-content voice-layout">
      <TopicHeader topic={topic} onBack={onBack} />
      <div className="voice-stage">
        <div className="voice-orb" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="voice-script">
          <div><b>你</b><p>等一下，我刚想到一个更重要的条件——</p></div>
          <div className="ai-line"><b>AI</b><p>好，我停在这里。你先补充，我再按新条件继续。</p></div>
          <div><b>你 + 图片</b><p>看一下这个现场，现在先做哪一步？</p></div>
        </div>
        <div className="frontier-grid">
          <div><strong>可打断</strong><span>不是录完再回答</span></div>
          <div><strong>会追问</strong><span>先补关键条件</span></div>
          <div><strong>能看图</strong><span>把现场带进对话</span></div>
          <div><strong>接着做</strong><span>沿同一目标推进</span></div>
        </div>
      </div>
      <div className="action-band">
        <div><span>60 秒现场演示</span><strong>让观众直接打断它一次</strong></div>
        <div className="action-row">
          <CopyButton label="复制开场词" prompt={prompts.voice} copied={copied} onCopy={onCopy} primary />
          <a className="action-button" href="https://chatgpt.com/" target="_blank" rel="noreferrer">打开 ChatGPT ↗</a>
        </div>
      </div>
    </div>
  );
}

const artImages = [
  [assetUrl("/dukou/bg-e0.jpg"), "渡口 · 22:00"],
  [assetUrl("/dukou/bg-e3.jpg"), "风暴中的抉择"],
  [assetUrl("/dukou/bg-e7.jpg"), "天亮之前"],
  [assetUrl("/dukou/sprite-ahe.jpg"), "阿禾"],
  [assetUrl("/dukou/sprite-bozhou.jpg"), "柏舟"],
  [assetUrl("/dukou/sprite-caozhang.jpg"), "曹掌柜"],
];

function CreateView({ copied, onCopy, onBack }: { copied: string | null; onCopy: (label: string, prompt: string) => void; onBack: () => void }) {
  const topic = topics[1];
  return (
    <div className="topic-content create-layout">
      <TopicHeader topic={topic} onBack={onBack} />
      <div className="art-proof">
        <div className="art-proof-head">
          <div><span>真实项目 · 渡口</span><h2>一个世界观，长出完整美术资产包</h2></div>
          <div className="proof-stats"><b>17</b><span>背景 + 人物</span></div>
        </div>
        <p className="asset-prompt"><b>需求</b> 做一个发生在雾河共和国崩解前夜的互动叙事；水墨夜色、人物统一、每个抉择都有对应现场。</p>
        <div className="art-mosaic">
          {artImages.map(([src, label], index) => (
            <figure className={`art-${index}`} key={src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={label} />
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
        <p className="proof-line">同一画风 · 同一世界 · 多场景 · 多人物 · 最后进入可玩的产品</p>
      </div>
      <div className="benchmark-title">
        <span>LIVE · IMAGE 2 BENCHMARK</span>
        <h2>现场选一个，不再只生成“一张图”</h2>
      </div>
      <div className="benchmark-grid">
        <article>
          <span>01 · 品牌整套</span>
          <h3>开一家店</h3>
          <p>一次生成标志、色板、包装、门头与社交海报。</p>
          <CopyButton label="复制品牌任务" prompt={prompts.brand} copied={copied} onCopy={onCopy} />
        </article>
        <article>
          <span>02 · 角色一致性</span>
          <h3>数字人的一天</h3>
          <p>同一张脸、同一套衣服，跨四个场景保持身份。</p>
          <CopyButton label="复制一致性任务" prompt={prompts.character} copied={copied} onCopy={onCopy} />
        </article>
        <article>
          <span>03 · 图像 → 空间</span>
          <h3>照片到 3D 参考包</h3>
          <p>先补齐多视图、材质和不确定尺寸，再进入建模。</p>
          <CopyButton label="复制 3D 任务" prompt={prompts.model3d} copied={copied} onCopy={onCopy} />
        </article>
      </div>
      <div className="action-band compact">
        <div><span>现场入口</span><strong>复制一个任务，去图像入口跑同题比较</strong></div>
        <a className="action-button primary" href="https://chatgpt.com/" target="_blank" rel="noreferrer">打开图像入口 ↗</a>
      </div>
    </div>
  );
}

function ResearchView({ copied, onCopy, onBack }: { copied: string | null; onCopy: (label: string, prompt: string) => void; onBack: () => void }) {
  const topic = topics[2];
  return (
    <div className="topic-content research-layout">
      <TopicHeader topic={topic} onBack={onBack} />
      <div className="research-hero">
        <div className="research-path">
          <div><b>01</b><strong>先定研究计划</strong><span>你可以修改范围</span></div>
          <i>→</i>
          <div><b>02</b><strong>跑长链搜索</strong><span>网页 · 文件 · 指定网站</span></div>
          <i>→</i>
          <div><b>03</b><strong>给结论和证据</strong><span>每条都能回到来源</span></div>
        </div>
        <div className="research-output">
          <div className="report-cover"><span>DEEP RESEARCH</span><h2>悉尼 AI 现场演示<br />能力决策书</h2><p>研究计划 · 证据链 · 限制 · 备用方案</p></div>
          <div className="report-items">
            <p><b>结论 01</b> 适合现场 · 有本地回放</p>
            <p><b>结论 02</b> 入口受账户限制</p>
            <p><b>结论 03</b> 重要声明已核验</p>
          </div>
        </div>
      </div>
      <div className="prompt-stage">
        <span>复制后，在 ChatGPT 里选择 Deep Research</span>
        <p>{prompts.research}</p>
        <div className="action-row">
          <CopyButton label="复制深度研究任务" prompt={prompts.research} copied={copied} onCopy={onCopy} primary />
          <a className="action-button" href="https://chatgpt.com/" target="_blank" rel="noreferrer">打开 ChatGPT ↗</a>
        </div>
      </div>
    </div>
  );
}

function ComputerView({ copied, onCopy, onBack }: { copied: string | null; onCopy: (label: string, prompt: string) => void; onBack: () => void }) {
  const topic = topics[3];
  const [running, setRunning] = useState(false);
  return (
    <div className="topic-content computer-layout">
      <TopicHeader topic={topic} onBack={onBack} />
      <div className={`computer-demo ${running ? "is-running" : ""}`}>
        <div className="fake-window">
          <div className="fake-chrome"><i /><i /><i /><span>demo.local / 活动登记</span></div>
          <div className="fake-body">
            <label>活动名称 <span>{running ? "社区 AI 体验日" : "等待填写"}</span></label>
            <label>时间 <span>{running ? "周六 14:00" : "等待填写"}</span></label>
            <button disabled>提交 · 已锁定</button>
          </div>
        </div>
        <div className="execution-track">
          {["看懂页面", "填写草稿", "检查缺失", "停在提交前"].map((step, index) => (
            <div className={running ? `done delay-${index}` : ""} key={step}>
              <b>{index + 1}</b><span>{step}</span><i>{running ? "✓" : "·"}</i>
            </div>
          ))}
        </div>
      </div>
      <div className="boundary-line"><b>能动手</b><i>＋</i><b>留证据</b><i>＋</i><b className="stop">高影响动作前停下</b></div>
      <div className="action-band">
        <div><span>安全现场演示</span><strong>先本地模拟，再复制同一条指令给 Codex</strong></div>
        <div className="action-row">
          <button className="action-button" onClick={() => setRunning(true)}>{running ? "✓ 已停在提交前" : "运行本地模拟"}</button>
          <CopyButton label="复制电脑操作任务" prompt={prompts.computer} copied={copied} onCopy={onCopy} primary />
        </div>
      </div>
    </div>
  );
}

const toolkits = [
  { id: "family", icon: "♥", name: "新生儿家庭", desc: "喂养、睡眠、就医与交接清单", tasks: ["记录今日喂养", "准备外出包", "确认下次预约"] },
  { id: "adhd", icon: "◎", name: "ADHD 家庭", desc: "情绪、任务、奖励与复盘工具包", tasks: ["今天只定一个目标", "完成 10 分钟启动", "记录有效策略"] },
  { id: "travel", icon: "↗", name: "旅行管家", desc: "行程、预算、物品与突发预案", tasks: ["护照与签证", "离线地图", "雨天备用计划"] },
  { id: "business", icon: "▦", name: "小生意仪表盘", desc: "订单、库存、现金与下一步动作", tasks: ["处理待发订单", "补充低库存", "检查本周现金"] },
];

function ToolsView({ copied, onCopy, onBack }: { copied: string | null; onCopy: (label: string, prompt: string) => Promise<boolean>; onBack: () => void }) {
  const topic = topics[4];
  const [selected, setSelected] = useState(1);
  const [checked, setChecked] = useState<number[]>([0]);
  const [manualCopy, setManualCopy] = useState(false);
  const toolkit = toolkits[selected];
  const selectedTasks = checked.map((index) => toolkit.tasks[index]);
  const toolkitPrompt = `请为我制作一个“${toolkit.name}”数字工具包。场景说明：${toolkit.desc}。

今天优先处理：
${selectedTasks.length ? selectedTasks.map((task, index) => `${index + 1}. ${task}`).join("\n") : "1. 请先帮我确定今天最重要的一项任务"}

交付要求：
- 不要只写建议或大纲，直接生成一个可使用的单页交互工具；
- 包含可勾选任务、完成进度、日期、备注和下一步；
- 支持手机与笔记本，支持打印或导出 PDF；
- 文案清楚、字号足够大，普通人无需学习即可使用；
- 不编造个人数据，不确定处留成可编辑字段；
- 完成后给我可直接打开的文件、使用方法和自测结果。`;
  const copyLabel = `生成${toolkit.name}版本`;
  const generateVersion = async () => {
    const success = await onCopy(copyLabel, toolkitPrompt);
    setManualCopy(!success);
  };
  return (
    <div className="topic-content tools-layout">
      <TopicHeader topic={topic} onBack={onBack} />
      <div className="toolkit-picker">
        {toolkits.map((item, index) => (
          <button className={selected === index ? "active" : ""} onClick={() => { setSelected(index); setChecked([0]); setManualCopy(false); }} key={item.id}>
            <i>{item.icon}</i><strong>{item.name}</strong><span>{item.desc}</span>
          </button>
        ))}
      </div>
      <div className="mini-app">
        <div className="mini-app-head">
          <div><span>为我的情况生成</span><h2>{toolkit.name} · 今日工具</h2></div>
          <b>{Math.round((checked.length / toolkit.tasks.length) * 100)}%</b>
        </div>
        <div className="mini-progress"><i style={{ width: `${(checked.length / toolkit.tasks.length) * 100}%` }} /></div>
        <div className="mini-tasks">
          {toolkit.tasks.map((task, index) => (
            <button
              className={checked.includes(index) ? "checked" : ""}
              onClick={() => setChecked((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index])}
              key={task}
            ><i>{checked.includes(index) ? "✓" : ""}</i><span>{task}</span><b>今天</b></button>
          ))}
        </div>
        <div className="mini-footer"><span>可勾选 · 会计算 · 能打印 · 可继续改</span><button onClick={generateVersion}>{copied === copyLabel ? "✓ 提示词已复制" : manualCopy ? "复制受限 · 提示词已展开" : "生成我的版本"}</button></div>
        {manualCopy && <div className="copy-fallback"><strong>浏览器阻止了自动复制，请按 ⌘C</strong><textarea readOnly value={toolkitPrompt} onFocus={(event) => event.currentTarget.select()} autoFocus /></div>}
      </div>
      <div className="case-strip">
        <span>真实项目结构</span>
        <strong>SPIKE Prime 家庭游戏</strong><i>＋</i><strong>26 页打印包</strong><i>＋</i><strong>编程游戏入口</strong>
      </div>
    </div>
  );
}

function BuildView({ copied, onCopy, onBack }: { copied: string | null; onCopy: (label: string, prompt: string) => void; onBack: () => void }) {
  const topic = topics[5];
  const fieldCases = [
    {
      image: assetUrl("/showcase/remakebench-vs.jpg"),
      eyebrow: "同题对打 · 00:18",
      title: "$50、同一条提示词，两个模型直接做游戏",
      detail: "不是看榜单：把同题产物并排播放，直接看氛围、帧率与可玩性。",
      href: "https://www.youtube.com/watch?v=7cs82KwACAA&t=18s",
      action: "从 00:18 看对打 ↗",
    },
    {
      image: assetUrl("/showcase/aichao-gpt56.jpg"),
      eyebrow: "AI超元域 · 06:53",
      title: "GPT-5.6 Sol：Codex 调 Godot 现场造游戏",
      detail: "波音 747 三维模型之后，继续做侏罗纪坦克、A-10 空战与原生 iOS App。",
      href: "https://www.youtube.com/watch?v=7aCMHJRHZK0&t=413s",
      action: "从 06:53 看实测 ↗",
    },
    {
      image: assetUrl("/showcase/aichao-fable5.jpg"),
      eyebrow: "AI超元域 · 06:12",
      title: "Fable 5：物理模拟、坦克游戏、自动化测试",
      detail: "从可交互黑洞切到侏罗纪坦克，再让 Claude Code 开发并测试原生 App。",
      href: "https://www.youtube.com/watch?v=QpOdo5ai7nA&t=372s",
      action: "从 06:12 看游戏 ↗",
      source: "https://github.com/win4r/jurassic-hunter",
    },
    {
      image: assetUrl("/showcase/lingdu-fable5.jpg"),
      eyebrow: "零度解说 · 中文复盘",
      title: "把发布能力翻译成普通人看得懂的实测",
      detail: "现场不需要读模型文档：用中文视频快速解释入口、实际效果与使用方式。",
      href: "https://www.youtube.com/watch?v=uXk6JNdcE0A",
      action: "打开中文实测 ↗",
    },
  ];
  return (
    <div className="topic-content build-layout">
      <TopicHeader topic={topic} onBack={onBack} />
      <div className="showcase-kicker"><span>OFFICIAL LAUNCH · ACE SCENARIOS</span><strong>先看厂商自己挑出来的最强样片</strong></div>
      <div className="official-showcase">
        <article className="official-card gpt-card">
          <a className="official-visual" href="https://www.youtube.com/watch?v=-MPGU2a67Ls&t=17s" target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl("/showcase/openai-gpt56.jpg")} alt="OpenAI 官方 GPT-5.6 造游戏演示" />
            <i>▶</i><b>00:17</b>
          </a>
          <div className="official-copy">
            <div><span>OPENAI 官方演示</span><em>GPT-5.6 SOL</em></div>
            <h2>一句开放需求，长出一款完整游戏</h2>
            <p>在 Codex 里设计机制、生成专属美术、加入关卡和配乐，自己试玩，再继续改到可交付。</p>
            <ul><li>玩法机制</li><li>专属美术</li><li>关卡 + 配乐</li><li>游戏 QA</li></ul>
            <div className="showcase-actions">
              <a className="action-button primary" href="https://www.youtube.com/watch?v=-MPGU2a67Ls&t=17s" target="_blank" rel="noreferrer">看官方 00:17 ↗</a>
              <a className="action-button" href="https://asterism.openai.chatgpt.site/" target="_blank" rel="noreferrer">直接玩 Asterism ↗</a>
              <a className="text-link" href="https://openai.com/index/gpt-5-6/" target="_blank" rel="noreferrer">更多官方交互</a>
            </div>
          </div>
        </article>
        <article className="official-card fable-card">
          <a className="official-visual" href="https://www.youtube.com/watch?v=Y9Wz2PV404E" target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl("/showcase/anthropic-fable5.jpg")} alt="Anthropic 官方 Claude Fable 5 发布演示" />
            <i>▶</i><b>01:53</b>
          </a>
          <div className="official-copy">
            <div><span>ANTHROPIC 官方发布</span><em>CLAUDE FABLE 5</em></div>
            <h2>高保真实现，也把检查工作一起做了</h2>
            <p>官方把它放在最难的长期工程上：实现设计、自己写测试，再用视觉检查结果是否真的符合目标。</p>
            <ul><li>高保真 UI</li><li>自写测试</li><li>视觉自检</li><li>长期工程</li></ul>
            <div className="showcase-actions">
              <a className="action-button primary" href="https://www.youtube.com/watch?v=Y9Wz2PV404E" target="_blank" rel="noreferrer">看官方发布 ↗</a>
              <a className="action-button" href="https://www.anthropic.com/claude/fable" target="_blank" rel="noreferrer">看能力说明 ↗</a>
            </div>
          </div>
        </article>
      </div>

      <div className="field-heading"><span>REAL OUTPUTS · TIMESTAMPED</span><h2>别听形容词。直接看同题产物与中文实测。</h2></div>
      <div className="field-grid">
        {fieldCases.map((item) => (
          <article className="field-card" key={item.title}>
            <a className="field-visual" href={item.href} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} />
              <i>▶</i>
            </a>
            <div className="field-copy"><span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.detail}</p></div>
            <div className="field-actions"><a href={item.href} target="_blank" rel="noreferrer">{item.action}</a>{item.source && <a href={item.source} target="_blank" rel="noreferrer">开源仓库 ↗</a>}</div>
          </article>
        ))}
      </div>

      <div className="own-case">
        <div className="own-case-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl("/dukou/bg-ending.jpg")} alt="渡口互动叙事的水墨夜景" />
          <span>你的真实项目 · 不是唯一例子</span>
        </div>
        <div className="own-case-copy"><span>FROM PROMPT TO PRODUCT</span><h2>渡口</h2><p>一句世界观进入剧情、视觉、代码与路径测试；8 次抉择、5 个可达结局、17 张统一资产，最后装进一个离线文件。</p><div><a className="action-button" href={assetUrl("/dukou-demo.html")} target="_blank" rel="noreferrer">现场玩《渡口》 →</a><b>8 抉择 · 5 结局 · 17 资产</b></div></div>
      </div>
      <div className="team-compare">
        <div className="old-way"><span>以前</span><h3>多人 · 数周 · 反复交接</h3><p>产品 / 编剧 / 视觉 / 前端 / 音频 / 测试</p></div>
        <div className="new-way"><span>现在</span><h3>一人定目标 · AI 多专业施工</h3><p>小时到天级做出第一版，人负责判断与验收</p></div>
      </div>
      <div className="action-band compact">
        <div><span>现场再造一个</span><strong>让观众说需求，做一个 demo 级小游戏或办公工具</strong></div>
        <CopyButton label="复制快速造软件任务" prompt={prompts.build} copied={copied} onCopy={onCopy} primary />
      </div>
    </div>
  );
}

function MagicView({ copied, onCopy, onBack }: { copied: string | null; onCopy: (label: string, prompt: string) => void; onBack: () => void }) {
  const [wish, setWish] = useState("我要把明天的活动准备好，但我还没有开始。");
  const [cast, setCast] = useState(false);
  return (
    <div className="topic-content magic-layout">
      <div className="topic-heading magic-heading">
        <button className="back-map" onClick={onBack}>← 返回能力全景图</button>
        <div className="topic-label">THE NEW INTERFACE</div>
        <h1>说出意图。<br />让中间摩擦消失。</h1>
        <p>像魔法师挥一下手：不是世界不再需要工作，而是搜索、整理、排版、编码与重复点击被一层层拿走。</p>
      </div>
      <div className={`spell-stage ${cast ? "cast" : ""}`}>
        <div className="spell-input">
          <span>说出你的愿望</span>
          <textarea value={wish} onChange={(event) => { setWish(event.target.value); setCast(false); }} />
          <button onClick={() => setCast(true)}>挥一下手 ✦</button>
        </div>
        <div className="spell-results">
          <article><span>01</span><strong>行动仪表盘</strong><p>今晚、明早、现场三段安排</p></article>
          <article><span>02</span><strong>材料工具包</strong><p>清单、提示卡、备用文件</p></article>
          <article><span>03</span><strong>执行证据</strong><p>完成什么、还差什么、哪里停</p></article>
        </div>
      </div>
      <div className="three-gates">
        <div><span>01</span><h2>目标</h2><p>先让 AI 复述它要完成什么</p></div>
        <div><span>02</span><h2>证据</h2><p>要求它展示资料、结果和测试</p></div>
        <div><span>03</span><h2>停止边界</h2><p>发送、付款、发布前必须停下</p></div>
      </div>
      <div className="closing-line">
        <strong>以后的人机界面，也许只剩一句自然语言。</strong>
        <CopyButton label="复制通用启动约束" prompt={prompts.magic} copied={copied} onCopy={onCopy} primary />
      </div>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("map");
  const [presenter, setPresenter] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const setRoute = useCallback((next: View) => {
    setView(next);
    setPresenter(false);
    window.history.pushState({ view: next }, "", next === "map" ? "/" : `/#${next}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as View;
    const initialRoute = window.setTimeout(() => {
      if (["voice", "create", "research", "computer", "tools", "build", "magic"].includes(hash)) setView(hash);
    }, 0);
    const pop = () => {
      const next = window.location.hash.replace("#", "") as View;
      setView(["voice", "create", "research", "computer", "tools", "build", "magic"].includes(next) ? next : "map");
    };
    window.addEventListener("popstate", pop);
    return () => {
      window.clearTimeout(initialRoute);
      window.removeEventListener("popstate", pop);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const copy = useCallback(async (label: string, prompt: string): Promise<boolean> => {
    let success = false;

    try {
      const activeElement = document.activeElement as HTMLElement | null;
      const textarea = document.createElement("textarea");
      textarea.value = prompt;
      textarea.readOnly = true;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, prompt.length);
      success = document.execCommand("copy");
      textarea.remove();
      activeElement?.focus();
    } catch {
      success = false;
    }

    if (!success && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(prompt);
        success = true;
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1800);
    } else {
      setCopied(null);
    }
    return success;
  }, []);

  const fullscreen = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  }, []);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "Escape" || event.key.toLowerCase() === "m") setRoute("map");
      if (event.key.toLowerCase() === "p") setPresenter((value) => !value);
      if (event.key.toLowerCase() === "f") void fullscreen();
      const number = Number(event.key);
      if (number >= 1 && number <= 6) setRoute(topics[number - 1].id);
      if (event.key === "0") setRoute("magic");
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [fullscreen, setRoute]);

  const currentTopic = topics.find((topic) => topic.id === view);
  const notes = presenterNotes[view];
  const title = view === "map" ? "AI 能力全景图" : view === "magic" ? "自然语言就是新界面" : currentTopic?.verb ?? "AI NOW";
  const progress = useMemo(() => Math.min(elapsed / 3600, 1), [elapsed]);

  return (
    <main className="ai-stage">
      <header className="site-header">
        <button className="wordmark" onClick={() => setRoute("map")}><i>AI</i><span>NOW / LIVE</span></button>
        <div className="route-title"><span>{title}</span>{view !== "map" && <button onClick={() => setRoute("map")}>全景图 M</button>}</div>
        <div className="header-actions">
          <button onClick={() => setPresenter((value) => !value)} className={presenter ? "active" : ""}>讲者提示 P</button>
          <button onClick={() => void fullscreen()}>全屏 F</button>
        </div>
      </header>

      <div className="time-rail"><i style={{ transform: `scaleX(${progress})` }} /></div>

      {view === "map" && (
        <div className="map-view">
          <section className="map-intro">
            <div className="map-copy">
              <span className="overline">WHAT AI CAN DO · RIGHT NOW</span>
              <h1>一句话，<br />开始造东西。</h1>
              <p>不讲遥远未来。点一张卡，直接看今天的 AI 怎样从自然语言走到真实结果。</p>
            </div>
            <button className="magic-shortcut" onClick={() => setRoute("magic")}>
              <span>最后 4 分钟</span><strong>自然语言<br />就是新界面</strong><i>→</i>
            </button>
          </section>
          <section className="capability-map" aria-label="可点击 AI 能力全景图">
            {topics.map((topic) => (
              <button
                className={`cap-card cap-${topic.id}`}
                style={{ "--accent": topic.accent } as React.CSSProperties}
                onClick={() => setRoute(topic.id)}
                key={topic.id}
              >
                <div className="cap-top"><span>{topic.number}</span><i>{topic.minutes}</i></div>
                <h2>{topic.verb}</h2>
                <strong>{topic.question}</strong>
                <p>{topic.summary}</p>
                <b>进入现场 →</b>
              </button>
            ))}
          </section>
          <footer className="map-footer">
            <button className="live-timer" onClick={() => setRunning((value) => !value)}><span>{running ? "演示进行中" : "开始 60 分钟"}</span><b>{formatClock(elapsed)}</b></button>
            <p>数字键 1–6 直达 · 0 收尾 · M 返回全景 · P 讲者提示</p>
          </footer>
        </div>
      )}

      {view === "voice" && <VoiceView copied={copied} onCopy={copy} onBack={() => setRoute("map")} />}
      {view === "create" && <CreateView copied={copied} onCopy={copy} onBack={() => setRoute("map")} />}
      {view === "research" && <ResearchView copied={copied} onCopy={copy} onBack={() => setRoute("map")} />}
      {view === "computer" && <ComputerView copied={copied} onCopy={copy} onBack={() => setRoute("map")} />}
      {view === "tools" && <ToolsView copied={copied} onCopy={copy} onBack={() => setRoute("map")} />}
      {view === "build" && <BuildView copied={copied} onCopy={copy} onBack={() => setRoute("map")} />}
      {view === "magic" && <MagicView copied={copied} onCopy={copy} onBack={() => setRoute("map")} />}

      {presenter && (
        <aside className="presenter-cue" aria-label="讲者提示">
          <div className="cue-title"><div><span>LIVE CUE</span><strong>{title}</strong></div><button onClick={() => setPresenter(false)}>×</button></div>
          <section><span>现在说</span><p>{notes.say}</p></section>
          <section><span>现在做</span><p>{notes.do}</p></section>
          <section className="cue-fallback"><span>入口失败时</span><p>{notes.fallback}</p></section>
          <div className="cue-shortcuts">M 返回 · P 关闭 · F 全屏 · 1–6 跳转</div>
        </aside>
      )}

      {view !== "map" && (
        <nav className="floating-map-nav" aria-label="演示导航">
          {topics.map((topic) => <button className={view === topic.id ? "active" : ""} onClick={() => setRoute(topic.id)} key={topic.id}>{topic.number}</button>)}
          <button className={view === "magic" ? "active" : ""} onClick={() => setRoute("magic")}>✦</button>
        </nav>
      )}
    </main>
  );
}
