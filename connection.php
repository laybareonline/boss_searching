<?php
$servername = "35.247.145.97";
$username = "lbov1_user";
$password = "lbov1_user";

try {
    $con = new PDO("mysql:host=$servername;dbname=laybare_boss_2017", $username, $password);
    // set the PDO error mode to exception
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $con->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }
?>