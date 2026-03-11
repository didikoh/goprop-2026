<?php
include './connect.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['firstname'], $data['lastname'], $data['email'], $data['contact'], $data['user_uid'], $data['country'], $data['city'])) {
    $firstname = $data['firstname'];
    $lastname = $data['lastname'];
    $email = $data['email'];
    $contact = $data['contact'];
    $user_id = $data['user_uid'];
    $country = $data['country'];
    $city = $data['city'];

    $sql = "UPDATE users_data SET firstname = ?, lastname = ?, email = ?, contactNumber = ?, country = ?, city = ? WHERE user_uid = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param('sssssss', $firstname, $lastname, $email, $contact, $country, $city, $user_id);

        if ($stmt->execute()) {
            // 更新成功后，返回更新后的数据
            $response = [
                'success' => true,
                'message' => 'Personal information updated successfully.',
                'updatedData' => [
                    'firstname' => $firstname,
                    'lastname' => $lastname,
                    'email' => $email,
                    'contact' => $contact,
                    'country' => $country,
                    'city' => $city
                ]
            ];
            echo json_encode($response);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update personal information.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare SQL statement.']);
    }
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
}

