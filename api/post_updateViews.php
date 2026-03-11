<?php
include './connect.php'; // Include the database connection

// 获取输入的数据
$data = json_decode(file_get_contents('php://input'), true);

// 验证输入数据是否完整
if (!isset($data['name'])) {
    $response = array('success' => false, 'error' => 'Invalid input');
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}

$name = $data['name'];

// 使用准备好的语句防止 SQL 注入
$stmt = $conn->prepare("UPDATE projects_en_data SET views = views + 1 WHERE name = ?");
$stmt->bind_param("s", $name);

$response = array();

// 执行 SQL 语句
if ($stmt->execute()) {
    // 查询更新后的最新 views 值
    $stmt->close(); // 关闭之前的 statement

    // 创建新的查询语句来获取最新的 views 数据
    $stmt_select = $conn->prepare("SELECT views FROM projects_en_data WHERE name = ?");
    $stmt_select->bind_param("s", $name);
    $stmt_select->execute();
    $stmt_select->bind_result($latestViews);
    $stmt_select->fetch();

    // 将最新的 views 数据添加到响应中
    $response['success'] = true;
    $response['views'] = $latestViews;

    // 关闭 statement
    $stmt_select->close();
} else {
    $response['success'] = false;
    $response['error'] = $stmt->error;
}

$conn->close();

// 返回 JSON 格式的响应
header('Content-Type: application/json');
echo json_encode($response);
?>
