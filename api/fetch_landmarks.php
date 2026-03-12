<?php
    include './connect.php';

    $location = $_GET['location'];

    $table_name = $location . '_landmarks';
    $sql = "SELECT * FROM {$table_name}";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $landmarks = $result->fetch_all(MYSQLI_ASSOC);

    if (!$result) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => false,
            "message" => "Query execution failed: " . $conn->error
        ]);
        exit;
    }

    if ($landmarks) {
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "data" => $landmarks
        ]);
    } else {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => false,
            "message" => "No landmarks found for " . $location
        ]);
    }

    $stmt->close();
    $conn->close();
    exit;
?>