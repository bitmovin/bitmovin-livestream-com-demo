<?php

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

//=======================================================================================
//REPLACE THOSE VALUES WITH YOUR OWN (available at https://livestream.com/developers/api)
$api_key = 'YOUR-LIVESTREAM-API-KEY';
$client_id = 123;
//=======================================================================================

$baseURL = "https://livestreamapis.com/v2/";
$scope = 'all';
$separator = ':';
$timestamp = round(microtime(true) * 1000);

$token = hash_hmac("md5", $api_key . $separator . $scope . $separator . $timestamp, $api_key);
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];

if (strcasecmp("GET", $method) == 0 && strcmp("/token", $path) == 0)
{
    $response = [
        'token' => $token,
        'timestamp' => $timestamp,
        'client_id' => intval($client_id)
    ];
    echo json_encode($response);
} else
{
    http_response_code(404);
}
