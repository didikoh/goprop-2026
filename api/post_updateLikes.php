<?php
include './connect.php'; // 引入数据库连接

// 获取输入的数据
$data = json_decode(file_get_contents('php://input'), true);

// 验证输入数据是否完整
if (!isset($data['name']) || !isset($data['add'])) {
    $response = array('success' => false, 'error' => 'Invalid input');
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}

$name = $data['name'];
$add = $data['add']; // 获取 add 的布尔值

// 根据 add 值选择 SQL 语句
$sql = $add ? "UPDATE projects_en_data SET likes = likes + 1 WHERE name = ?" 
            : "UPDATE projects_en_data SET likes = likes - 1 WHERE name = ?";

// 使用准备好的语句防止 SQL 注入
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $name);

$response = array();

// 执行 SQL 语句
if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
    $response['error'] = $stmt->error;
}

// 关闭 statement 和数据库连接
$stmt->close();
$conn->close();

// 返回 JSON 格式的响应
header('Content-Type: application/json');
echo json_encode($response);
?>
