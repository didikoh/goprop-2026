<?php
include './connect.php'; // 数据库连接

header('Content-Type: application/json');
$action = $_GET['action'] ?? '';

if ($action === 'global_projects') {
    // 使用 UNION 合并三个表的数据
    $sql = '
        SELECT * FROM jb_projects
        UNION
        SELECT * FROM genting_projects
        UNION
        SELECT * FROM kl_projects
    ';

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $projects = $result->fetch_all(MYSQLI_ASSOC);

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode([
        "success" => true,
        "data" => $projects
    ]);

    $stmt->close();
    $conn->close();
    exit; 
}
else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>