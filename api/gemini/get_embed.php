<?php
// 引入数据库连接
require_once '../connect.php';

// 创建 PDO 数据库连接
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $location = isset($_GET['location']) ? $_GET['location'] : '';
    
    $sql = "SELECT id, name, vector FROM chat_embed_{$location}";

    // 执行查询
    $stmt = $pdo->query($sql);

    // 获取结果
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 输出为 JSON 格式
    header('Content-Type: application/json');
    echo json_encode($results, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    // 错误处理
    echo "数据库连接失败: " . $e->getMessage();
}
?>
