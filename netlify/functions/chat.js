'use strict';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { message: 'Method not allowed' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json(503, {
      message: 'DeepSeek API 尚未配置。请在 Netlify 环境变量中设置 DEEPSEEK_API_KEY。'
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { message: '请求格式不正确。' });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
  const question = messages.filter((item) => item.role === 'user').at(-1)?.content;
  if (!question || typeof question !== 'string') {
    return json(400, { message: '请输入问题。' });
  }
  if (question.length > 800) {
    return json(400, { message: '问题过长，请精简到 800 字以内。' });
  }

  const context = typeof body.context === 'string' ? body.context.slice(0, 300) : '';
  const system = [
    '你是“京工文脉”北京工业文化数字学习平台的AI导览。',
    '请用简洁、准确、适合高校思政课学习的中文回答。',
    '优先围绕北京工业遗产、工业历史、制度文化、工业精神、科技创新与研学路线作答。',
    '不编造具体史实、数据、人物访谈或场馆开放信息；不确定时明确说明，并建议查阅权威来源。',
    '回答控制在 300—600 字，可使用短段落和项目符号。',
    `当前页面：${context || '北京工业文化学习平台'}`
  ].join('\n');

  try {
    const response = await fetch(process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          { role: 'system', content: system },
          ...messages.map((item) => ({
            role: item.role === 'assistant' ? 'assistant' : 'user',
            content: String(item.content || '').slice(0, 1200)
          }))
        ],
        temperature: 0.45,
        max_tokens: 700,
        stream: false
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || 'DeepSeek 服务暂时不可用。';
      return json(502, { message });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) return json(502, { message: 'AI 未返回有效内容。' });
    return json(200, { reply });
  } catch (error) {
    console.error('DeepSeek request failed:', error);
    return json(502, { message: 'AI 服务连接失败，请稍后再试。' });
  }
};

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(payload)
  };
}