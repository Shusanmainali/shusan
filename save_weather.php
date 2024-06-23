<?php
$servername = "";
$username = "";
$password = "";
$dbname = "weather_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

$city = $data['city'];
$temp = $data['temp'];
$description = $data['description'];
$humidity = $data['humidity'];
$date = $data['date'];

$sql = "INSERT INTO weather_data (city, temperature, description, humidity, date) VALUES ('$city', '$temp', '$description', '$humidity', '$date')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
