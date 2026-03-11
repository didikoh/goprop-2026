<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

function fetchWebPageText($url) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');

    $html = curl_exec($ch);

    if (curl_errno($ch)) {
        http_response_code(500);
        echo json_encode(["error" => curl_error($ch)]);
        curl_close($ch);
        exit;
    }

    curl_close($ch);

    // 清除 script 和 style 标签
    $html = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $html);
    $html = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', '', $html);

    $text = strip_tags($html);
    $text = preg_replace('/\s+/', ' ', $text);
    return trim($text);
}

if (!isset($_GET['url'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing 'url' parameter."]);
    exit;
}

$url = $_GET['url'];
$text = fetchWebPageText($url);
echo json_encode(["text" => $text]);
