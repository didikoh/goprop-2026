<?php
require_once '../connect.php'; // 用你的 connect.php 连线

date_default_timezone_set('Asia/Kuala_Lumpur'); // 调整为你所在时区
$today = date('Y-m-d');

// 检查今天是否有记录
$stmt = $conn->prepare("SELECT count FROM chat_daily_stats WHERE stat_date = ?");
$stmt->bind_param("s", $today);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // 如果有今天的记录 → +1
    $newCount = $row['count'] + 1;
    $stmt = $conn->prepare("UPDATE chat_daily_stats SET count = ? WHERE stat_date = ?");
    $stmt->bind_param("is", $newCount, $today);
    $stmt->execute();
    echo json_encode(["status" => "updated", "count" => $newCount]);
} else {
    // 如果今天没有记录 → 插入新行
    $count = 1;
    $stmt = $conn->prepare("INSERT INTO chat_daily_stats (stat_date, count) VALUES (?, ?)");
    $stmt->bind_param("si", $today, $count);
    $stmt->execute();
    echo json_encode(["status" => "inserted", "count" => 1]);
}
