<?php

require "models/ArticlesModel.php";

class Articles {
    function index() {
        $articlesModel = new ArticlesModel();
        return $articlesModel->getAll();
    } 
    
    function addArticle() {
        $response = validate_request();
        if ($response['error']) return $response;
     
        $_POST["images"] = "";
        if (isset($_FILES["images"])) {
            $file = $_FILES["images"];
            move_uploaded_file($file["tmp_name"], "../uploads/".$file["name"]);
            $_POST["images"] = $file["name"];
        }
        
        if (isset($_POST["title"])) {
            $articlesModel = new ArticlesModel();
            $id = $articlesModel->addArticle($_POST);
            return array("id" => $id);
        } 
    }
    
    function deleteArticle() {
        validate_request();
        
        if (isset($_GET["id"]) && is_numeric($_GET["id"])) {
            $articlesModel = new ArticlesModel();
            $id = $articlesModel->deleteArticle($_GET["id"]);
            
            if ($id == 0) {
                $response = array("error"=>"Article not found");    
            }
            else {
                $response = array("success"=>TRUE);         
            }
            return $response;
        }
    }
    
    function getArticle() {
        if (isset($_GET["id"])) {
            $articlesModel = new ArticlesModel();
            $response = $articlesModel->getArticleById($_GET["id"]);
            return $response;
        } 
    }
    
    function updateArticle() {
        if (isset($_POST["article_id"])) {
            if (isset($_POST["title"]) || isset($_POST["content"])) {
                $articlesModel = new ArticlesModel();
                $row = $articlesModel->updateArticle($_POST);
                if ($row) {
                    $response = array("success"=>TRUE);  
                } else {
                   $response = array("error"=>"error");        
                }
                return $response;
            } 
        } 
    }

    //function displaySection() {
    //    $articlesModel = new ArticlesModel();
    //    return $articlesModel->sectionToDisplay($page_num, $rows_per_page);
    //}
    
    //function countRows() {
    //    $articlesModel = new ArticlesModel();
    //    return $articlesModel->amountRowsResultSet();
    //}
}