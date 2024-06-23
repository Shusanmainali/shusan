<?php
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "weather_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT date, city, temperature, description, humidity FROM weather_data ORDER BY date DESC";
$result = $conn->query($sql);

$weather_data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $weather_data[] = $row;
    }
}

echo json_encode($weather_data);

$conn->close();
?>
