<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins, or specify your React app domain
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// The API endpoint you want to proxy
$apiKey = "c8fbb53db9c1475981834812240310"; // Your WeatherAPI key
$location = isset($_GET['q']) ? urlencode($_GET['q']) : "Kuala Lumpur"; // Location from the query string

// WeatherAPI URL with location and API key
$apiUrl = "https://api.weatherapi.com/v1/current.json?key={$apiKey}&q={$location}";

// Initialize a cURL session
$ch = curl_init();

// Set the cURL options
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification (optional)

// Execute the cURL request
$response = curl_exec($ch);

// Check for errors
if(curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch);
    exit();
}

// Close the cURL session
curl_close($ch);

// Set appropriate headers for JSON response
header('Content-Type: application/json');

// Output the response from the API
echo $response;
?>