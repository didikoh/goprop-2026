<?php
include './connect.php'; // 数据库连接
// 设定常见 bot 的 user-agent 关键词
$knownBots = [
    'Googlebot',
    'Bingbot',
    'Slurp',
    'DuckDuckBot',
    'Baiduspider',
    'YandexBot',
    'Sogou',
    'Exabot',
    'facebot',
    'ia_archiver'
];

// 获取 user-agent
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// 是否为 bot？
$isBot = false;
foreach ($knownBots as $bot) {
    if (stripos($userAgent, $bot) !== false) {
        $isBot = true;
        break;
    }
}

if ($isBot) {
    // 获取访客 IP 地址
    $response = file_get_contents("https://api.ipify.org?format=json");
    $ipAddress = 'Unknown';
    if ($response !== false) {
        $data = json_decode($response, true);
        if (isset($data['ip'])) {
            $ipAddress = $data['ip'];
        }
    }

    // 获取访客国家
    $country = 'Unknown';
    $apiUrl = "https://ipinfo.io/$ipAddress/json";
    $response = file_get_contents($apiUrl);
    if ($response !== false) {
        $data = json_decode($response, true);
        if (isset($data['country'])) {
            $country = $data['country'];
        }
    }

    // 记录日志到数据库
    $stmt = $conn->prepare("INSERT INTO bot_log (ip_address, user_agent, is_bot, country, visited_at) VALUES (?, ?, ?, ?, NOW())");
    $isBotValue = $isBot ? '1' : '0';
    $stmt->bind_param(
        "ssss",
        $ipAddress,
        $userAgent,
        $isBotValue,
        $country
    );
    $stmt->execute();
    $stmt->close();
    // 可选：如果是 Bot 可立即退出
    exit(); // 或 return;

}
?>