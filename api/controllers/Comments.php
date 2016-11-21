<?php

require "models/CommentsModel.php";

class Comments {
    
    function index() {
        $commentsModel = new CommentsModel();
        return $commentsModel->getArticleComments($_GET["article_id"]);
    } 

    function addComment() {
        if (isset($_POST["article_id"])) {
            $commentsModel = new CommentsModel();
            $id = $commentsModel->addComment($_POST);
            return array("id" => $id);
        } 
    }
    
    function contact() {
        if (isset($_POST["message_email"])) {
            $messageModel = new CommentsModel();
            $id = $messageModel->sendMessage($_POST);
            return array("id" => $id);
        }
    }
}