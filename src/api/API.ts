const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY =
  "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";

export const askAI = async (message: string, model: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: {model},
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    if (data.choices?.[0]?.message?.content) {
      console.log("Response: ", data);
      return data.choices[0].message.content;
    }

    console.warn(`请求失败，尝试重试 ${i + 1}/${retries}`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 延迟 1s 重试
  }
  return "抱歉，我无法获取有效的回复。";
};
