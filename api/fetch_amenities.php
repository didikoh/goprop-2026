<?php
include 'connect.php'; // Include the database connection

header('Content-Type: application/json'); // Set header for JSON response

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['location']) || !isset($data['amenity'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input data"
    ]);
    exit;
}

$location = $data['location'];
$amenity = $data['amenity'];

if ($amenity == 'transport') {
    $table_name1 = $conn->real_escape_string($location . '_train');
    $table_name2 = $conn->real_escape_string($location . '_station');
    // Build the SQL query
    $sql = "SELECT * FROM `{$table_name2}` JOIN `{$table_name1}` ON `{$table_name2}`.line = `{$table_name1}`.id";
} else {
    $table_name = $conn->real_escape_string($location . '_' . $amenity);
    // Build the SQL query
    $sql = "SELECT * FROM {$table_name}";
}
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
$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Output the projects as JSON
echo json_encode([
    "success" => true,
    "data" => $data
]);

// Close the connection
$conn->close();
?>