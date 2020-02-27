<?php 
include_once('connection.php');


$draw = $_POST['draw'];
$row = $_POST['start'];
$rowperpage = $_POST['length']; // Rows display per page
$columnIndex = $_POST['order'][0]['column']; // Column index
$columnName = $_POST['columns'][$columnIndex]['data']; // Column name
$columnSortOrder = $_POST['order'][0]['dir']; // asc or desc
$searchValue = $_POST['search']['value']; // Search value



$searchQuery = " ";
if($searchValue != ''){
   $searchQuery = " and (firstname like '%".$searchValue."%' or 
        lastname like '%".$searchValue."%' or 
        custom_client_id like'%".$searchValue."%' ) ";
}


$countClients = $con->query("select count(*) as allcount from tbl_client")->fetchColumn();

$totalRecords = $countClients;



$countClientsWithFilter = $con->query("select count(*) as allcount from tbl_client WHERE 1 ".$searchQuery)->fetchColumn();
$totalRecordwithFilter = $countClientsWithFilter;



$empQuery = $con->prepare("select * from tbl_client WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage);
$empQuery->execute();
$records = $empQuery->fetchAll();
$data = array();


foreach($records as $row) {
    $data[] = array( 
       "client_id"=>$row['client_id'],
       "custom_client_id"=>$row['custom_client_id'],
       "firstname"=>$row['firstname'],
       "lastname"=> $row['lastname'],
       "action" => '<button type="button" id="viewClientTransaction" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#exampleModal" data-id="'.$row['client_id'].'" data-custom-id="'.$row['custom_client_id'].'" data-backdrop="static" data-keyboard="false"><i class="glyphicon glyphicon-pencil">&nbsp;</i>VIEW TRANSACTION</button>'
    );
    

 }

$response = array(
    "draw" => intval($draw),
    "recordsTotal" => $totalRecords,
    "recordsFiltered" => $totalRecordwithFilter,
    "data" => $data
  );
  
  echo json_encode($response);

?>