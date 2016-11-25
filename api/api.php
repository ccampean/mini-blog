<?php

session_start();

// error_reporting(E_ALL);

ini_set('display_errors', 1);

// Include helpers functions
require "helpers/functions.php";

// APP routes (URI)
$routes = [];
$routes["/api/articles"] = array("controller" => "Articles",
                                "method" => "index");
$routes["/api/articles/get"] = array("controller" => "Articles",
                                "method" => "getArticle");                                
$routes["/api/articles/add"] = array("controller" => "Articles",
                                "method" => "addArticle");
$routes["/api/articles/delete"] = array("controller" => "Articles",
                                "method" => "deleteArticle");
$routes["/api/articles/update"] = array("controller" => "Articles",
                                "method" => "updateArticle");
$routes["/api/articles/pagination"] = array("controller" => "Articles",
                                "method" => "displaySection");
$routes["/api/articles/countrows"] = array("controller" => "Articles",
                                "method" => "countRows");   
$routes["/api/articles/search"] = array("controller" => "Articles",
                                "method" => "searchQuery");                                 
            
$routes["/api/comments"] = array("controller" => "Comments",
                                "method" => "index");                                
$routes["/api/comments/add"] = array("controller" => "Comments",
                                "method" => "addComment");
$routes["/api/contact"] = array("controller" => "Comments",
                            "method" => "contact");                                
                                
$routes["/api/login"] = array("controller" => "Login",
                            "method" => "index");
$routes["/api/logout"] = array("controller" => "Login",
                            "method" => "logout");
$routes["/api/session"] = array("controller" => "Login",
                            "method" => "checkSession");

if (isset($_SERVER["REDIRECT_URL"])) {
    $key = rtrim($_SERVER['REDIRECT_URL'], '/');
    if (array_key_exists($key, $routes)) {
        require "controllers/" . $routes[$key]["controller"] . ".php"; 
        $controller = new $routes[$key]["controller"]();
        $response = $controller->$routes[$key]["method"]();
   
        // Print response for XHR|AJAX JS
        api_response($response, http_response_code());
    } else {
        api_response(array("error"=>"Page not found"), 404);
    }
} else {
    api_response(array("error"=>"Access Forbidden"), 403);
}                               


