<?php
require 'vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$apiKey = $_ENV['GOOGLE_API'];

$callbackFunction = "initializeAutocomplete"; // JavaScript function name
$googleMapsApiUrl = "https://maps.googleapis.com/maps/api/js?key={$apiKey}&libraries=places&callback={$callbackFunction}&loading=async";

header('Content-Type: application/json');
echo json_encode(['url' => $googleMapsApiUrl]);
?>
