<?php
require 'db.php';

$action = $_GET['action'] ?? '';

switch($action) {
    case 'register':
        require 'api/register.php';
        break;
    case 'login':
        require 'api/login.php';
        break;
    case 'start-exam':
        require 'api/start_exam.php';
        break;
    case 'save-answer':
        require 'api/save_answer.php';
        break;
    case 'log-anomaly':
        require 'api/log_anomaly.php';
        break;
    case 'end-exam':
        require 'api/end_exam.php';
        break;
    case 'report':
        require 'api/generate_report.php';
        break;
    default:
        echo json_encode(['error' => 'Action inconnue']);
}
?>
