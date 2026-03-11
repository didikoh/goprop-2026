<?php
$apiKey = "AIzaSyD_nvAogEqHlujbyJ8hBqHfLcdoy_1r-tk";
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
// 允许跨域请求

// 读取前端传来的 JSON 请求体
$input = json_decode(file_get_contents("php://input"), true);

// 安全解析前端字段
$instruction = $input['instruction'] ?? '';
$history = $input['history'] ?? [];  // 格式是完整 contents[]
$useFunctionCall = $input['use_function_call'] ?? false;
$functionDeclarations = $input['functionDeclarations'] ?? []; // 只在 use_function_call=true 时有效
$message = $input['message'] ?? null; // 当前消息，如果前端额外给
$search = $input['search'] ?? false;

// 构建 contents：从前端传来的历史 + 当前 message
$contents = [];
foreach ($history as $h) {
    if (isset($h['role']) && isset($h['parts'])) {
        $contents[] = [
            "role" => $h['role'],
            "parts" => $h['parts']
        ];
    }
}
if ($message) {
    $contents[] = [
        "role" => "user",
        "parts" => [["text" => $message]]
    ];
}

// 构建请求体
$data = [
    "system_instruction" => [
        "parts" => [["text" => $instruction]]
    ],
    "contents" => $contents
];

// 工具收集
$tools = [];
if ($useFunctionCall && !empty($functionDeclarations)) {
    $tools[] = [
        "functionDeclarations" => $functionDeclarations
    ];
}
if ($search) {
    $tools[] = [
        "googleSearch" => (object)[]
    ];
}
if (!empty($tools)) {
    $data["tools"] = $tools;
}

// 发起 POST 请求
$options = [
    'http' => [
        'header' => "Content-Type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

// 解析响应
$response = json_decode($result, true);

// 输出文本（基础实现）
if (isset($response['candidates'][0])) {
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo "[Error] No valid response.";
}
