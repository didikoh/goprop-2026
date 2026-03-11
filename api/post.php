<?php
include './connect.php'; // 数据库连接

// Set the content-type to JSON
header('Content-Type: application/json');
$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

if ($action === 'toggle_like') {
    $location = $data['location'];
    $projectName = $data['projectName'];
    session_start();
    $userId = $_SESSION['user_id'];
    $tableName = $location . '_projects';

    // 获取用户当前的 favProjects
    $stmt = $conn->prepare('SELECT favProjects FROM users_data WHERE id = ?');
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $stmt->bind_result($favProjects);
    $stmt->fetch();
    $stmt->close();

    // 解析 JSON 数据
    $favArray = $favProjects ? json_decode($favProjects, true) : [];

    if (in_array($projectName, $favArray)) {
        // 如果已存在，则移除并减少 likes
        $favArray = array_diff($favArray, [$projectName]); // 移除项目
        $query = "UPDATE `$tableName` SET likes = likes - 1 WHERE name = ?";
        $message = 'Project removed from favorites';
    } else {
        // 如果不存在，则添加并增加 likes
        $favArray[] = $projectName;
        $query = "UPDATE `$tableName` SET likes = likes + 1 WHERE name = ?";
        $message = 'Project added to favorites';
    }

    // 更新 likes 计数
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $projectName);
    $stmt->execute();
    $stmt->close();

    // 重新编码 JSON
    $newFavProjects = json_encode(array_values($favArray));

    // 更新用户的 favProjects
    $stmt = $conn->prepare('UPDATE users_data SET favProjects = ? WHERE id = ?');
    $stmt->bind_param('si', $newFavProjects, $userId);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true, 'message' => $message]);
} elseif ($action === 'views_count') {
    $location = $data['location'];
    $projectName = $data['projectName'];
    $tableName = $location . '_projects';

    $stmt = $conn->prepare("UPDATE `$tableName` SET views = views + 1 WHERE name = ?");
    $stmt->bind_param('s', $projectName);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true]);
} elseif ($action === 'project_register') {
    $user_type = $data['user_type'];
    $user_id = $data['user_id'];
    $projectName = $data['project_name'];
    $user_name = $data['user_name'];
    $user_contact = $data['user_contact'];
    $session_id = $data['session_id'];
    $place_id = $data['place_id'];


    if ($user_type === 'agent') {
        $collaborate = $data['collaborate'];
        $services = $data['services'];
        $social_media = $data['social_media'];
        $message = $data['message'];
        $stmt = $conn->prepare('INSERT INTO reg_agent (user_id,session_id,place_id, project, name, contact, collaborate, services, social_media, message) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?)');
        $stmt->bind_param('isssssssss', $user_id,$session_id, $place_id, $projectName, $user_name, $user_contact, $collaborate, $services, $social_media, $message);
        $stmt->execute();
        $stmt->close();
    } else {
        $purpose = $data['purpose'];
        $location = $data['location'];
        $room_type = $data['room_type'];

        $stmt = $conn->prepare('INSERT INTO reg_buyer (user_id, session_id, place_id, project, name, contact, purpose, location, room_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('issssssss', $user_id,$session_id, $place_id, $projectName, $user_name, $user_contact, $purpose, $location, $room_type);
        $stmt->execute();
        $stmt->close();
    }

    echo json_encode(['success' => true, 'message' => 'Registration successful, we will contact you soon']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
