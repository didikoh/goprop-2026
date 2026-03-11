<?php
include './connect.php';

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data from the map_data table
$sql = "SELECT * FROM map_data"; // Adjust columns as needed
$result = $conn->query($sql);

// Check if data exists
if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    // Return data as JSON
    echo json_encode($data);
} else {
    echo json_encode([]);
}

// Close the connection
$conn->close();
?>