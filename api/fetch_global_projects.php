<?php
include './connect.php'; // 引入数据库连接

// 允许的项目表
$allowed_tables = ['kl_projects', 'genting_projects', 'jb_projects'];

// 构建 SQL 查询
$queries = [];
foreach ($allowed_tables as $table) {
    $queries[] = "SELECT * FROM {$table}";
}
$sql = implode(" UNION ALL ", $queries); // 使用 UNION ALL 合并查询结果

// 执行查询
$result = $conn->query($sql);

// 检查查询是否成功
if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Query execution failed: " . $conn->error
    ]);
    exit;
}

// 获取数据
$projects = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $projects[] = $row;
    }
}

// 设置 JSON 响应头
header('Content-Type: application/json');

// 输出查询结果
echo json_encode([
    "success" => true,
    "data" => $projects
]);

// 关闭数据库连接
$conn->close();
?>
