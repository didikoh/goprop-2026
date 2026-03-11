<?php
$allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8668",
    "http://localhost",
    "https://goprop.ai"
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
// header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT,INSERT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$env = getenv('APP_ENV') ?: 'development';

// 通用配置（主机名和账号密码固定）
$host = 'vrtech.my';
$user = 'vrtechmy_goprop_admin';
$pass = 'goprop_admin';
$port = 3306;

// 根据环境切换数据库名
$db = $env == 'development' ? 'vrtechmy_goprop540_dev' : 'vrtechmy_goprop540';

// bypass for local dev
// $db = 'vrtechmy_goprop540';

// Create connection
$conn = new mysqli($host, $user, $pass, $db, $port);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Optional: Set the charset to avoid encoding issues
$conn->set_charset("utf8mb4");
?>