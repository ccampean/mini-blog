<?php

require_once "db.php";

class ArticlesModel extends DB {
    function getAll() {
        $sql = 'SELECT * FROM articles WHERE valid = 1';
        $sth = $this->dbh->prepare($sql);
        $sth->execute();
       
        return $sth->fetchAll(PDO::FETCH_ASSOC);   
    } 
    
    function addArticle($item) {
        $params = [':title' => $item["title"],
                    ':content' => $item["content"],
                    ':images' => $item["images"]];

        $sql = 'INSERT INTO articles(title, content, images, valid) 
                VALUES(:title , :content, :images, 1)';
        $sth = $this->dbh->prepare($sql);
        $sth->execute($params);
       
        return $this->dbh->lastInsertId();
    }
    
    function deleteArticle($id) {
        $params = [':id' => $id];

        $sql = 'DELETE from articles WHERE article_id=:id';
        $sth = $this->dbh->prepare($sql);
        $sth->execute($params);
        
        return $sth->rowCount();      
    }
    
    function getArticleById($id) {
        $params = [':id' => $id];
        $sql = 'SELECT * FROM articles WHERE article_id=:id';
        $sth = $this->dbh->prepare($sql);
        $sth->execute($params);
        
        return $sth->fetch(PDO::FETCH_ASSOC);
    }
    
    function updateArticle($data) {
        $params = [':id' => $data["article_id"],
                    ':title' => $data["title"],
                    ':content' => $data["content"]];
        
        $sql = 'UPDATE articles 
                SET title=:title, content=:content
                WHERE article_id=:id';
        $sth = $this->dbh->prepare($sql);
        $sth->execute($params);
        
        return $sth->rowCount(); 
    }
    
    function sectionToDisplay($page, $items) {
        $start = ((int)$page - 1) * (int)$items;
        $total_rows = (int)$items;
        $sql = "SELECT `article_id`, `title`, `content`, `images`
                FROM `articles`
                ORDER BY `creation_date`
                LIMIT :from, :total_rows";
        $sth = $this->dbh->prepare($sql);
        $sth->bindParam(':from', $start, PDO::PARAM_INT);
        $sth->bindParam(':total_rows', $total_rows, PDO::PARAM_INT);
        $sth->execute();
        return $sth->fetchAll(PDO::FETCH_ASSOC);
    }
    
    function amountRowsResultSet() {
        $sql = 'SELECT COUNT(`article_id`) AS `total_rows`
             FROM `articles`';
        $sth = $this->dbh->prepare($sql);
        $sth->execute();
        
        return $sth->fetch(PDO::FETCH_ASSOC);
    }
    
    function search($value) {
        $sql = 'SELECT * FROM articles WHERE valid = 1 
                AND (title LIKE :value OR content LIKE :value)';
        $sth = $this->dbh->prepare($sql);
        $sth->execute(array(":value" => "%$value%"));
        
        return $sth->fetchAll(PDO::FETCH_ASSOC);   
    }
}