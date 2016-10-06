<?php
		require_once "config.php";

		//$sql = "SELECT * FROM `posts`, `users` where `posts`.`user_id`=`users`.`id` and `posts`.`user_id`=".$_GET['id'];
		//to show post of the current user only

		$sql = "SELECT * FROM `users` JOIN `posts` WHERE users.id=posts.user_id";
    	//var_dump($_GET);
		$result=$mysql->query($sql);

    	$posts=$result->fetch_all(MYSQLI_ASSOC);

    	echo json_encode($posts);

	?>