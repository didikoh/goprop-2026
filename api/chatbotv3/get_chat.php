<?php
header('Content-Type: application/json');

// 引入数据库连接
require_once '../connect.php';

// 获取参数
$input = json_decode(file_get_contents('php://input'), true);
$chatId = $input['chatId'] ?? '';

// 检查 chatId 是否存在
if (!$chatId) {
    echo json_encode(["success" => false, "error" => "Missing chatId"]);
    exit();
}

// 准备 SQL 查询
$stmt = $conn->prepare("SELECT * FROM chat_activity WHERE chatId = ?");
$stmt->bind_param("s", $chatId);

// 执行查询
$stmt->execute();
$result = $stmt->get_result();


// 检查是否有结果
if ($row = $result->fetch_assoc()) {
    if (isset($row['messageCount'])) {
        $json = json_decode($row['messageCount'], true);
        $row['messageCount'] = $json ? $json : $row['messageCount'];
    }
    echo json_encode(["success" => true, "data" => $row]);
} else {
    echo json_encode(["success" => false, "error" => "Chat not found"]);
}

$stmt->close();
$conn->close();
?>