<?php
    include './connect.php';

    $location = $_GET['location'];

    $table_name = $location . '_projects';
    $sql = ($location == "all") ? "SELECT * FROM jb_projects UNION SELECT * FROM genting_projects UNION SELECT * FROM kl_projects" : "SELECT * FROM {$table_name}";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $projects = $result->fetch_all(MYSQLI_ASSOC);

    if (!$result) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => false,
            "message" => "Query execution failed: " . $conn->error
        ]);
        exit;
    }

    if ($projects) {
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "data" => $projects
        ]);
    } else {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => false,
            "message" => "No projects found for " . $location . " location."
        ]);
    }

    $stmt->close();
    $conn->close();
    exit;
?>