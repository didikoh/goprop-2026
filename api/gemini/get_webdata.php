<?php
// 引入数据库连接
require_once '../connect.php';

// 创建 PDO 数据库连接
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 从前端获取 projectName 参数
    $projectName = isset($_GET['projectName']) ? $_GET['projectName'] : '';

    // 编写 SQL 查询语句
    $sql = "SELECT id, name, webdata FROM chat_webdata WHERE name = :projectName";

    // 准备查询
    $stmt = $pdo->prepare($sql);

    // 绑定参数
    $stmt->bindParam(':projectName', $projectName, PDO::PARAM_STR);

    // 执行查询
    $stmt->execute();

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
