<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$apiKey = $_ENV['GOOGLE_API'];

if (isset($_POST['startLocation']) && isset($_POST['endLocation'])) {
    $startLocation = urlencode($_POST['startLocation']);
    $endLocation = urlencode($_POST['endLocation']);

    // Prepare the API URL
    $url = "https://maps.googleapis.com/maps/api/directions/json?origin=$startLocation&destination=$endLocation&key=$apiKey";

    // Initialize cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    // Check for cURL errors
    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        echo json_encode(["error" => "cURL error: " . $error_msg]);
        exit();
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Check if response is valid
    if ($httpCode !== 200) {
        echo json_encode(["error" => "Google API returned HTTP status code $httpCode"]);
        exit();
    }

    // Decode the response
    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["error" => "Error decoding JSON response: " . json_last_error_msg()]);
        exit();
    }

    // Return the data
    echo json_encode($data);
} else {
    echo json_encode(["error" => "Invalid inputs"]);
}
