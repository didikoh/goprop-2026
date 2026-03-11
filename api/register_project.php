<?php
include './connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Decode JSON body
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input["type"])) {
        $type = $input["type"];
        $project = $input["project"];

        if ($type == "buyer") {
            $name = $input["name"];
            $contact = $input["contact"];
            $purpose = $input["purpose"];
            $current_stay = $input["current_stay"];
            $room_type = json_encode($input["room_type"]);

            $sql = "INSERT INTO reg_buyer (project, name,contact, purpose, current_stay, room_type) VALUES (?,?, ?, ?, ?, ?)";
            if ($stmt = $conn->prepare($sql)) {
                $stmt->bind_param("ssssss", $project, $name, $contact, $purpose, $current_stay, $room_type);
                if (!$stmt->execute()) {
                    $response = array(
                        "success" => false,
                        "message" => "Error executing main statement: " . $stmt2->error
                    );
                } else {
                    $response = array(
                        "success" => true,
                        "message" => "Register project successfully"
                    );
                }
                $stmt->close();
            } else {
                $response = array(
                    "success" => false,
                    "message" => "Error preparing main statement: " . $stmt->error
                );
            }

        } else if ($type == "agent") {
            $user_uid = $input["user_uid"];
            $collaborate = $input["collaborate"];
            $services = $input["services"];
            $marketing = $input["marketing"];
            $message = $input["message"];

            $sql = "INSERT INTO reg_agent (project, user_uid, collaborate, services, marketing, message) VALUES (?, ?, ?, ?, ?, ?)";
            if ($stmt = $conn->prepare($sql)) {
                $stmt->bind_param("ssiiis", $project, $user_uid, $collaborate, $services, $marketing, $message);
                if (!$stmt->execute()) {
                    $response = array(
                        "success" => false,
                        "message" => "Error executing main statement: " . $stmt2->error
                    );
                } else {
                    $response = array(
                        "success" => true,
                        "message" => "Register project successfully"
                    );
                }
                $stmt->close();
            } else {
                $response = array(
                    "success" => false,
                    "message" => "Error preparing main statement: " . $stmt->error
                );
            }
        } else {
            $response = array(
                "success" => false,
                "message" => "Type Error"
            );
        }
    } else {
        $response = array(
            "success" => false,
            "message" => "Type not Set"
        );
    }

} else {
    $response = array(
        "success" => false,
        "message" => "Error preparing main statement: " . $conn->error
    );
}

// 返回 JSON 格式的响应
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>