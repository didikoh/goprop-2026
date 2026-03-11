<?php
include './connect.php'; // Include the database connection

// Prepare the SQL query
$query = "SELECT genting_train.line, genting_train.lineColor, genting_station.name, genting_station.description, genting_station.overDistance, genting_station.mapIframeUrl
        FROM genting_station
        JOIN genting_train ON genting_station.line = genting_train.id";


$result = $conn->query($query);

$trains = [];

// Check if there are results
if ($result->num_rows > 0) {
    // Fetch each row as an associative array
    while ($row = $result->fetch_assoc()) {
        $trains[] = $row;
    }
} else {
    echo "No stations found.";
}

header('Content-Type: application/json');

// Output the trains as JSON
echo json_encode($trains);

// Close the connection
$conn->close();
?>