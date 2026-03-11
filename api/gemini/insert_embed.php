<?php
// 引入数据库连接
require_once '../connect.php';

$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die("数据库连接失败：" . $e->getMessage());
}

// 读取 JSON 请求数据
$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'] ?? '';
$vector = $data['vector'] ?? [];

if ($name && is_array($vector)) {
    $stmt = $pdo->prepare("INSERT INTO chat_embed_jb (name, vector) VALUES (?, ?)");
    $stmt->execute([$name, json_encode($vector)]);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => '缺少参数']);
}
?>
