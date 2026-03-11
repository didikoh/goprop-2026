<?php
include './connect.php'; // Include the database connection

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['location'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input data"
    ]);
    exit;
}

$location = $data['location'];
// Validate location against allowed values to prevent SQL injection
$allowed_locations = ['kl', 'genting', 'jb']; // Add valid locations here
if (!in_array($location, $allowed_locations)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid location specified"
    ]);
    exit;
}

$table_name = $conn->real_escape_string($location . '_landmarks');
// Build the SQL query
$sql = "SELECT * FROM {$table_name}";
// Execute the query
$result = $conn->query($sql);

// Check for query errors
if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Query execution failed: " . $conn->error
    ]);
    exit;
}

// Fetch the data
$landmarks = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $landmarks[] = $row;
    }
}

// Set the content-type to JSON
header('Content-Type: application/json');

// Output the landmarks as JSON
echo json_encode([
    "success" => true,
    "data" => $landmarks
]);

// Close the database connection
$conn->close();
?>