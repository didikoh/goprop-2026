<?php
include './connect.php';

// Get the referrer from the POST request
$referrer = isset($_POST['referrer']) ? $_POST['referrer'] : 'Direct';

// Prepare and execute the SQL query to insert data
$sql = "INSERT INTO referer_data (referrer) VALUES (?)";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("s", $referrer);

    if ($stmt->execute()) {
        echo "Referrer recorded successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Error preparing statement: " . $conn->error;
}

// Close the database connection
$conn->close();
?>