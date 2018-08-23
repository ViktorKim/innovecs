<?php
/**
 * Created by Viktor Kim.
 * Date: 8/19/2018
 * Time: 18:27
 */

echo send_mail();

/**
 * Send mail and return response in JSON format
 *
 * @return string
 */
function send_mail(){

	$email = trim( $_POST['email'] );

	$response = array(
		'status' => 'false',
		'message' => '<div class="error">It was an error when trying to send mail. Mail is incorrect. Test data: test@test.com</div>'
	);
	if (is_valid_mail($email)){
		$response['status'] = 'true';
		$response['message'] = '<div class="success">Success!</div>';
	}

	return json_encode($response);
}

/**
 * Check if the email is valid
 *
 * @param $mail
 *
 * @return boolean
 */
function is_valid_mail( $mail ) {
	$valid_mails = array(
		'test@test.com',
		'test2test@test.com',
		'2test@test.com'
	);

	return in_array( strtolower( $mail ), $valid_mails, true );
}