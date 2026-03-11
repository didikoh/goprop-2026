<?php
include './connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['action'])) {
    echo json_encode(["success" => false, "message" => "Missing analytics type"]);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'];

$action = $data['action'];

switch ($action) {
    case 'visitor':
        $sql = "INSERT INTO analytics_visitors (visitor_id, user_id, user_type, user_email, session_id, ip_address, coordinate, device_type, browser, browser_version, os, referrer, landing_page, city, country, region, postal, timezone)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "ssssssssssssssssss",
            $data['visitor_id'],
            $data['user_id'],
            $data['user_type'],
            $data['user_email'],
            $data['session_id'],
            $data['ip_address'],
            $data['coordinate'],
            $data['device_type'],
            $data['browser'],
            $data['browser_version'],
            $data['os'],
            $data['referrer'],
            $data['landing_page'],
            $data['city'],
            $data['country'],
            $data['region'],
            $data['postal'],
            $data['timezone']
        );
        break;

    case 'page_exit':
        if (!isset($data['visitor_id'], $data['session_id'], $data['duration_seconds'], $data['exit_page'])) {
            $error_message = "Missing required fields for page_exit";
            // file_put_contents('analytics_log.txt', date('Y-m-d H:i:s') . " - ERROR: $error_message\n", FILE_APPEND);
            echo json_encode(["success" => false, "message" => $error_message]);
            exit;
        }
        $sql = "UPDATE analytics_visitors
                SET exit_page = ?, duration_seconds = ? 
                WHERE visitor_id = ? AND session_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "siss",
            $data['exit_page'],
            $data['duration_seconds'],
            $data['visitor_id'],
            $data['session_id']
        );
        // file_put_contents('analytics_log.txt', date('Y-m-d H:i:s') . " - INFO: Executing page_exit update for visitor_id: {$data['visitor_id']}, session_id: {$data['session_id']}, exit_page: {$data['exit_page']}, duration_seconds: {$data['duration_seconds']}\n", FILE_APPEND);
        break;

    case 'insert_project_views':
        $sql = "INSERT INTO analytics_project_views (session_id, sub_id, place_id, project_name, viewed_at)
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $viewed_at = date('Y-m-d H:i:s', strtotime($data['viewed_at']));
        $stmt->bind_param(
            "sssss",
            $data['session_id'],
            $data['sub_id'],
            $data['place_id'],
            $data['project_name'],
            $viewed_at
        );
        break;

    case 'update_project_views':
        $sql = "UPDATE analytics_project_views
                SET p_details = ?, p_distance = ?, p_chatbot = ?, p_compare = ?, p_share = ?, p_location = ?, p_virtual_tour = ?, p_floor_plan = ?, p_video = ?, p_external = ?, p_submit_explore_more = ?, duration_seconds = ?
                WHERE sub_id = ? AND place_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "iiiiiiiiiiiiss",
            $data['p_details'],
            $data['p_distance'],
            $data['p_chatbot'],
            $data['p_compare'],
            $data['p_share'],
            $data['p_location'],
            $data['p_virtual_tour'],
            $data['p_floor_plan'],
            $data['p_video'],
            $data['p_external'],
            $data['p_submit_explore_more'],
            $data['duration_seconds'],
            $data['sub_id'],
            $data['place_id']
        );
        break;

    case 'insert_540_views':
        $sql = "INSERT INTO analytics_540_views (session_id, name, direction, type, floor, unit)
        VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "ssssss",
            $data['session_id'],
            $data['name'],
            $data['direction'],
            $data['type'],
            $data['floor'],
            $data['unit']
        );
        break;

    case 'get_coordinates':
        if (empty($data['city'])) {
            echo json_encode(["success" => false, "message" => "Missing city"]);
            exit;
        }
        // 建议将API Key放到环境变量或配置文件，这里用 getenv
        $googleApiKey = "AIzaSyBclyZBckGfVCvwaqEQe6NI7fQMEg7Nhww";
        if (!$googleApiKey) {
            echo json_encode(["success" => false, "message" => "Missing Google API Key"]);
            exit;
        }
        $city = urlencode($data['city']);
        $url = "https://maps.googleapis.com/maps/api/geocode/json?address={$city}&key={$googleApiKey}";
        $resp = file_get_contents($url);
        if ($resp === false) {
            echo json_encode(["success" => false, "message" => "Failed to fetch from Google API"]);
            exit;
        }
        $json = json_decode($resp, true);
        if (isset($json['results'][0]['geometry']['location'])) {
            $loc = $json['results'][0]['geometry']['location'];
            echo json_encode([
                "success" => true,
                "lat" => $loc['lat'],
                "lng" => $loc['lng']
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "No result"]);
        }
        exit;

    case 'get_data':
        $dateFrom = !empty($data['customDateFrom']) ? $conn->real_escape_string($data['customDateFrom']) . " 00:00:00" : null;
        $dateTo = !empty($data['customDateTo']) ? $conn->real_escape_string($data['customDateTo']) . " 23:59:59" : null;

        $tables = [
            [
                "table" => "analytics_visitors",
                "dateField" => "visited_at"
            ],
            [
                "table" => "analytics_project_views",
                "dateField" => "viewed_at"
            ],
            [
                "table" => "analytics_540_views",
                "dateField" => "visited_at"
            ],
            [
                "table" => "chat_activity",
                "dateField" => "chat_at"
            ],
            [
                "table" => "chat_daily_stats",
                "dateField" => "stat_date"
            ]
        ];

        $resultData = [];
        foreach ($tables as $tbl) {
            $table = $tbl['table'];
            $dateField = $tbl['dateField'];
            $where = [];
            if ($dateFrom) {
                if ($table === "chat_daily_stats") {
                    $where[] = "$dateField >= '" . substr($dateFrom, 0, 10) . "'";
                } else {
                    $where[] = "$dateField >= '$dateFrom'";
                }
            }
            if ($dateTo) {
                if ($table === "chat_daily_stats") {
                    $where[] = "$dateField <= '" . substr($dateTo, 0, 10) . "'";
                } else {
                    $where[] = "$dateField <= '$dateTo'";
                }
            }
            $whereSql = $where ? "WHERE " . implode(" AND ", $where) : "";
            $sql = "SELECT * FROM `$table` $whereSql";
            $res = $conn->query($sql);
            if ($res) {
                $rows = [];
                while ($row = $res->fetch_assoc()) {
                    $rows[] = $row;
                }
                $resultData[$table] = $rows;
            } else {
                $resultData[$table] = [];
            }
        }
        echo json_encode([
            "success" => true,
            "data" => $resultData
        ]);
        $conn->close();
        exit;

    default:
        echo json_encode(["success" => false, "message" => "Unknown analytics type"]);
        exit;
}

if (isset($stmt) && $stmt->execute()) { // Ensure $stmt is defined before executing
    echo json_encode(["success" => true, "message" => "Analytics data inserted"]);
} else if (isset($stmt)) { // Handle errors only if $stmt is defined
    echo json_encode(["success" => false, "message" => "DB Error: " . $stmt->error]);
}

if (isset($stmt)) {
    $stmt->close();
}
$conn->close();
?>