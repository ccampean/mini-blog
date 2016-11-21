<?php
require_once "db.php";

class CommentsModel extends DB {
    
    function getArticleComments($id) {
        $params = [':id' => $id];
        $sql = 'SELECT * FROM comments WHERE article_id = :id';
        $sth = $this->dbh->prepare($sql);
        $sth->execute($params);
       
        return $sth->fetchAll(PDO::FETCH_ASSOC);   
    } 
    
    function addComment($item) {
        $params = [':article_id' => $item["article_id"],
                    ':commentator_name' => $item["commentator_name"],
                    ':commentator_msg' => $item["commentator_msg"]];

        $sql = 'INSERT INTO comments(article_id, commentator_name, commentator_msg) 
                VALUES(:article_id , :commentator_name, :commentator_msg)';
        $sth = $this->dbh->prepare($sql);
        $sth->execute($params);
    
        return $this->dbh->lastInsertId();
    }
    
    function sendMessage($msg) {
        $params = [':email' => $msg["message_email"],
                   ':msg' => $msg["message"]];
        $sql = 'INSERT INTO messages(message_email, message)
                VALUES(:email, :msg)';
        $sth = $this->dbh->prepare($sql);
        $sth->execute($params);
        
        return $this->dbh->lastInsertId();
    }
}