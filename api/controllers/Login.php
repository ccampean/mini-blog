<?php

// echo crypt("web7", "$1$");
class Login {
    const USER = 'web7';
    const PASSWORD = '$1$$KUZtUfIBYu7qMMqzutvTe0';

    function index() {
        $errors = array();
        if (isset($_POST["user"]) && isset($_POST["password"])) {
            if ((crypt($_POST["password"], self::PASSWORD) == self::PASSWORD) && ($_POST["user"] == self::USER)) {
                $_SESSION["isLogged"] = TRUE;
                $_SESSION["user"] = 'user is admin now';
                return $_SESSION;
            } else {
                $errors["credentials"] = "wrong credentials!";
            }
        }
        return array("errors" => $errors);
    }
    
    function logout() {
        unset($_SESSION["isLogged"]);
        unset($_SESSION["user"]);
        session_destroy();
        return array("success"=>TRUE);
    }
    
    function checkSession() {
        if (isset($_SESSION["isLogged"]) && ($_SESSION["isLogged"] == TRUE)) {
            return array("logged"=>TRUE, "user" => $_SESSION["user"]);    
        } else {
            return array("logged"=>FALSE);  
        }
    }
}


