<?php 
header('Content-Type: application/json');
   include_once('connection.php');
   $client_id = $_POST["client_id"];
   $custom_id = $_POST["custom_id"];
 
   $data = $con->prepare("select daily_sales.transaction_date,daily_sales.service_invoice_number,daily_sales.branch_id,daily_sales_item.item_name,daily_sales_item.quantity,daily_sales_item.sub_total from tbl_daily_sales as daily_sales INNER JOIN tbl_client as clients on daily_sales.client_id = clients.client_id
   INNER JOIN tbl_daily_sales_item as daily_sales_item on daily_sales.daily_sales_id = daily_sales_item.daily_sales_id WHERE  clients.custom_client_id = :custom_id ORDER BY daily_sales.transaction_date DESC");
   $data->bindParam(':custom_id',$custom_id);
   $data->execute();
   $result = $data->fetchAll();


   echo json_encode($result);



?>