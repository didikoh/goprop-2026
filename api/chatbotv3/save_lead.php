<?php
header("Content-Type: application/json");

// 引入数据库连接（请根据你实际路径调整）
require_once '../connect.php';

// 读取前端传来的 JSON 数据
$input = json_decode(file_get_contents('php://input'), true);

// 提取字段
$name = trim($input['name'] ?? '');
$phone = trim($input['phone'] ?? '');
$visitor_id = trim($input['visitor_id'] ?? '');

// 简单验证
if (empty($name) || empty($phone)) {
    echo json_encode(["success" => false, "error" => "Missing name or phone"]);
    exit;
}

// 插入数据库
$stmt = $conn->prepare("INSERT INTO chat_leads (name, phone, visitor_id) VALUES (?, ?,?)");
$stmt->bind_param("sss", $name, $phone, $visitor_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>