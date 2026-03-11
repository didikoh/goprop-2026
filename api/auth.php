<?php
include './connect.php'; // 数据库连接
include './antibot.php'; // Bot 检测

// 设置 session cookie 7天后过期（单位：秒）
session_set_cookie_params([
  'lifetime' => 60 * 60 * 24 * 7, // 7天
  'path' => '/',
  'domain' => '', // 当前域名
  'secure' => false, // 如有 https 可设为 true
  'httponly' => true,
  'samesite' => 'Lax'
]);
session_start();
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

date_default_timezone_set('Asia/Kuala_Lumpur'); // 设置为 GMT+8

$dotenv = Dotenv::createImmutable(__DIR__);

$dotenv->load();

$baseUrl = $_ENV['BASE_URL'];

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true);

function sendEmail($to, $subject, $body)
{
  $mail = new PHPMailer(true);
  try {
    $mail->isSMTP();
    $mail->Host = 'mail.goprop.ai';
    $mail->SMTPAuth = true;
    $mail->Username = 'no-reply@goprop.ai';
    $mail->Password = 'gpadmin@Team2727';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    $mail->setFrom('no-reply@goprop.ai', 'GoProp No-Reply');
    $mail->addAddress($to);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $body;

    $mail->send();
  } catch (Exception $e) {
    error_log("Mail sending failed: {$mail->ErrorInfo}");
  }
}

switch ($action) {
  // 注册账号
  case 'register':
    $firstname = $data['firstname'];
    $lastname = $data['lastname'];
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
    $email = $data['email'];
    $contact = $data['contact'];
    $type = $data['type'];
    $occupation = $data['occupation'] ?? null;
    $company = $data['company'] ?? null;
    $token = bin2hex(random_bytes(16));
    $tokenExpiresAt = date('Y-m-d H:i:s', strtotime('+30 minutes'));

    $stmt = $conn->prepare('SELECT id FROM users_data WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if ($result) {
      http_response_code(409);
      echo json_encode(['error' => 'Email already registered']);
    } else {
      $stmt = $conn->prepare('INSERT INTO users_data (email, firstName, lastName, contactNumber, type, occupation, company, password, token, token_expires_at, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)');
      $stmt->bind_param('ssssssssss', $email, $firstname, $lastname, $contact, $type, $occupation, $company, $password, $token, $tokenExpiresAt);
      $stmt->execute();

      sendEmail($email, 'Email Verification', "Please click the link to verify your account: <a href='$baseUrl/api/goprop/auth.php?action=verify&token=$token'>Verify</a>");

      echo json_encode(['success' => true]);
    }
    break;

  // 验证邮箱
  case 'verify':
    $token = $_GET['token'];
    $stmt = $conn->prepare('SELECT token_expires_at FROM users_data WHERE token = ?');
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result || strtotime($result['token_expires_at']) < time()) {
      http_response_code(400);
      echo json_encode(['error' => 'Token expired']);
      exit;
    }

    $stmt = $conn->prepare('UPDATE users_data SET verified = 1, token = NULL, token_expires_at = NULL WHERE token = ?');
    $stmt->bind_param('s', $token);
    $stmt->execute();

    echo 'Verification successful!';
    break;

  // 重新发送验证邮件
  case 'resend_verification':
    $email = $data['email'];
    $token = bin2hex(random_bytes(16));
    $tokenExpiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

    $stmt = $conn->prepare('UPDATE users_data SET token = ?, token_expires_at = ? WHERE email = ? AND verified = 0');
    $stmt->bind_param('sss', $token, $tokenExpiresAt, $email);
    $stmt->execute();

    sendEmail($email, 'Resend Verification', "Please click the link to verify your account: <a href='$baseUrl/api/goprop/auth.php?action=verify&token=$token'>Verify</a>");

    echo json_encode(['success' => true]);
    break;

  // 登录
  case 'login':
    $email = $data['email'];
    $password = $data['password'];
    $sessionId = $data['sessionId'];
    $stmt = $conn->prepare('SELECT * FROM users_data WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if ($result) {
      if (password_verify($password, $result['password'])) {
        if ($result['verified']) {
          $_SESSION['user_id'] = $result['id'];
          unset($result['password']);

          // Update analytics_visitors if session_id is provided
          if (!empty($_SESSION['user_id'])) {
            $session_id = $sessionId;
            $user_id = $result['id'];
            $user_type = $result['type'];
            $user_email = $result['email'];
            $stmt2 = $conn->prepare('UPDATE analytics_visitors SET user_id = ?, user_type = ?, user_email = ? WHERE session_id = ?');
            $stmt2->bind_param('ssss', $user_id, $user_type, $user_email, $session_id);
            $stmt2->execute();
          }

          echo json_encode(['user' => $result]);
        } else {
          http_response_code(403);
          echo json_encode(['error' => 'Email not verified']);
        }
      } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
      }
    } else {
      $stmt = $conn->prepare('SELECT id FROM users_data WHERE email = ?');
      $stmt->bind_param('s', $email);
      $stmt->execute();
      $userExists = $stmt->get_result()->fetch_assoc();

      if ($userExists) {
        http_response_code(403);
        echo json_encode(['error' => 'Email not verified']);
      } else {
        http_response_code(404);
        echo json_encode(['error' => 'Email not registered']);
      }
    }
    break;

  // 请求重置密码
  case 'reset_password':
    $email = $data['email'];
    $token = bin2hex(random_bytes(16));
    $tokenExpiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

    $stmt = $conn->prepare('UPDATE users_data SET token = ?, token_expires_at = ? WHERE email = ?');
    $stmt->bind_param('sss', $token, $tokenExpiresAt, $email);
    $stmt->execute();

    sendEmail($email, 'Reset Password', "Please click the link to reset your password: <a href='$baseUrl/api/goprop/auth.php?action=reset_form&token=$token'>Reset</a>");

    echo json_encode(['success' => true]);
    break;

  // 重置密码表单
  case 'reset_form':
    $token = $_GET['token'];
    echo '<form method="POST" action="auth.php?action=reset_confirm">
            <input type="hidden" name="token" value="' . $token . '">
            <input type="password" name="new_password" placeholder="New Password">
            <button type="submit">Reset Password</button>
          </form>';
    break;

  // 确认重置密码
  case 'reset_confirm':
    $token = $_POST['token'];
    $newPassword = password_hash($_POST['new_password'], PASSWORD_BCRYPT);

    $stmt = $conn->prepare('SELECT token_expires_at FROM users_data WHERE token = ?');
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result || strtotime($result['token_expires_at']) < time()) {
      http_response_code(400);
      echo json_encode(['error' => 'Token expired']);
      exit;
    }

    $stmt = $conn->prepare('UPDATE users_data SET password = ?, token = NULL, token_expires_at = NULL WHERE token = ?');
    $stmt->bind_param('ss', $newPassword, $token);
    $stmt->execute();

    echo 'Password reset successful!';
    break;

  // 修改密码
  case 'change_password':
    if (!isset($_SESSION['user_id'])) {
      http_response_code(401);
      echo json_encode(['error' => 'Unauthorized']);
      exit;
    }

    $userId = $_SESSION['user_id'];
    $currentPassword = $data['currentPassword'];
    $newPassword = $data['newPassword'];
    $confirmPassword = $data['confirmPassword'];

    if ($newPassword !== $confirmPassword) {
      http_response_code(400);
      echo json_encode(['error' => 'New passwords do not match']);
      exit;
    }

    $stmt = $conn->prepare('SELECT password FROM users_data WHERE id = ?');
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result || !password_verify($currentPassword, $result['password'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Incorrect current password']);
      exit;
    }

    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
    $stmt = $conn->prepare('UPDATE users_data SET password = ? WHERE id = ?');
    $stmt->bind_param('si', $hashedPassword, $userId);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
    break;

  // 退出登录
  case 'logout':
    session_destroy();
    echo json_encode(['success' => true]);
    break;

  // 检查用户状态
  case 'check':
    if (isset($_SESSION['user_id'])) {
      $stmt = $conn->prepare('SELECT * FROM users_data WHERE id = ?');
      $stmt->bind_param('i', $_SESSION['user_id']);
      $stmt->execute();
      $user = $stmt->get_result()->fetch_assoc();

      if ($user) {
        unset($user['password']);
        echo json_encode(['user' => $user, 'success' => true]);
      } else if ($user['verified'] == 0) {
        http_response_code(403);
        echo json_encode(['error' => 'Email not verified']);
      } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
      }

    }
    break;

  // 更新用户资料
  case 'update_profile':
    $userId = $_SESSION['user_id'];
    $firstname = $data['firstName'];
    $lastname = $data['lastName'];
    $email = $data['email'];
    $contact = $data['contactNumber'];
    $company = $data['company'];
    $occupation = $data['occupation'];
    $country = $data['country'];
    $city = $data['city'];

    $stmt = $conn->prepare('UPDATE users_data SET firstName = ?, lastName = ?, email = ?, contactNumber = ?, company = ?, occupation = ?, country = ?, city = ? WHERE id = ?');
    $stmt->bind_param('ssssssssi', $firstname, $lastname, $email, $contact, $company, $occupation, $country, $city, $userId);
    $stmt->execute();

    echo json_encode(['success' => true]);
    break;
}
?>