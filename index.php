<?php 
 include('connection.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BOSS Searching of Transaction</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="dataTables.min.css">
</head>
<body>

<div class="container-fluid">
<h3 class="text-center">BOSS Searching of Transactions</h3>
<table class="table table-hover" id="myTable">
    <thead>
        <tr>
            <th>Client ID</th>
            <th>Custom Client ID </th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Action</th>
        </tr>    
    </thead>
</table>
</div>

<?php 
    include_once('modal.php');
?>

<?php 
 include('footer.php');
?>