/*global $, Comment*/

function Comments() {
    this.models = [];
}

Comments.prototype.getComments = function(articleId) {
    var that = this;
    return $.ajax({
        url: "/api/comments?article_id=" + articleId,
        type: "GET",
        dataType: "json",
        data: {
            article_id: articleId
        },
        success: function(resp) {
            for(var i = 0; i <resp.length; i++){
               var comment = new Comment(resp[i]);
               that.models.push(comment);
            }
        },
        error:function(xhr, status, errorMessage){
            console.log("Statusul erorii la GET ul de comentari pentru un anumit articol: ", status);
        }
    });
};

Comments.prototype.addComment = function(commentObject) {
    var that = this;
    return $.ajax({
        url: "/api/comments/add",
        type: "POST",
        datatype: "json",
        data: commentObject,
        success: function(resp) {
            // push the new model to this.models
            console.log('comentariul', resp);
        },
        error:function(xhr, status, errorMessage){
            console.log("Statusul erorii la POST ul comentariului: ", status);
        }
    });
}