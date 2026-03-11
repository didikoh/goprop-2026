<?php
require_once '../connect.php'; // 引入你的 connect.php

header('Content-Type: application/json');

// 获取请求内容
$data = json_decode(file_get_contents("php://input"), true);
$chatId = $data['chatId'] ?? null;
$sessionId = $data['sessionId'] ?? null;
$projectName = $data['projectName'] ?? '';
$messages = $data['messages'] ?? [];
$messageCount = is_array($messages) ? count($messages) : 0;
$visitorId = $data['visitorId'] ?? '';
//  新增：解析 tokens 数组 → input_token / output_token
$tokens = $data['tokens'] ?? [];      // 期待 [input, output]
$inputToken = $tokens[0] ?? 0;                 // 默认 0
$outputToken = $tokens[1] ?? 0;


if (!$chatId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing chatid"]);
    exit();
}

// 检查是否存在
$stmt = $conn->prepare("SELECT 1 FROM chat_activity WHERE chatId = ? LIMIT 1");
$stmt->bind_param("s", $chatId);
$stmt->execute();
$exists = $stmt->get_result()->num_rows > 0;
$stmt->close();

if ($exists) {
    // 3️⃣ 更新
    $stmt = $conn->prepare(
        "UPDATE chat_activity
             SET messages = ?,
                 projectName = ?,          -- NEW
                 messageCount = ?,          -- NEW
                 visitorId = ?,
                 input_token   = input_token  + ?,
                 output_token  = output_token + ?
           WHERE chatId = ?"
    );
    $encodedMessages = json_encode($messages);
    $stmt->bind_param(
        "ssisiis",
        $encodedMessages,
        $projectName,
        $messageCount,
        $visitorId,
        $inputToken,
        $outputToken,
        $chatId,
    );
    $stmt->execute();
    echo json_encode(["status" => "updated", "chatId" => $chatId]);
} else {
    // 4️⃣ 插入
    $stmt = $conn->prepare(
        "INSERT INTO chat_activity
             (visitorId, session_id, chatId, projectName, messageCount, messages, input_token, output_token)
         VALUES (?,?, ?,?, ?, ?, ?, ?)"
    );
    $encodedMessages = json_encode($messages);
    $stmt->bind_param(
        "ssssisii",
        $visitorId,
        $sessionId,
        $chatId,
        $projectName,
        $messageCount,
        $encodedMessages,
        $inputToken,
        $outputToken
    );
    $stmt->execute();
    echo json_encode(["status" => "inserted", "chatId" => $chatId]);
}

$stmt->close();
$conn->close();
?>