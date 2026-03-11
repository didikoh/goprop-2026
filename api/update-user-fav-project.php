<?php
include './connect.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['favProjects']) && !empty($data['user_uid'])) {
    $project = $data['favProjects'];
    $user_id = $data['user_uid'];

    // 查询当前用户的 favProjects
    $sql = "SELECT favProjects FROM users_data WHERE user_uid = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $currentProjects = json_decode($row['favProjects'], true) ?: [];

            if (in_array($project, $currentProjects)) {
                // 项目已存在，移除项目
                $updatedProjects = array_filter($currentProjects, function($item) use ($project) {
                    return $item !== $project;
                });

                $updatedProjectsJson = json_encode(array_values($updatedProjects));

                // 更新数据库
                $updateSql = "UPDATE users_data SET favProjects = ? WHERE user_uid = ?";
                $updateStmt = $conn->prepare($updateSql);

                if ($updateStmt) {
                    $updateStmt->bind_param('ss', $updatedProjectsJson, $user_id);
                    if ($updateStmt->execute()) {
                        echo json_encode(['success' => true, 'message' => 'Project removed successfully.', 'updatedData' => $updatedProjects]);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Failed to update projects: ' . $updateStmt->error]);
                    }
                    $updateStmt->close();
                } else {
                    echo json_encode(['success' => false, 'message' => 'Failed to prepare update statement: ' . $conn->error]);
                }
            } else {
                // 项目不存在，添加项目
                $currentProjects[] = $project;
                $updatedProjectsJson = json_encode($currentProjects);

                // 更新数据库
                $updateSql = "UPDATE users_data SET favProjects = ? WHERE user_uid = ?";
                $updateStmt = $conn->prepare($updateSql);

                if ($updateStmt) {
                    $updateStmt->bind_param('ss', $updatedProjectsJson, $user_id);
                    if ($updateStmt->execute()) {
                        echo json_encode(['success' => true, 'message' => 'Project added successfully.', 'updatedData' => $currentProjects]);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Failed to update projects: ' . $updateStmt->error]);
                    }
                    $updateStmt->close();
                } else {
                    echo json_encode(['success' => false, 'message' => 'Failed to prepare update statement: ' . $conn->error]);
                }
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare select statement: ' . $conn->error]);
    }
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
}
