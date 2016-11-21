
/*global $, Articles, Comments location*/

$(window).ready(function(){
    
    var articlesContainer = $(".js-articles");
    var moderatedArticlesContainer = $(".js-moderated-articles");
    var articleById = new Articles();
    var commentsForArticle = new Comments();
    var articleId = parseInt(location.search.split('id=')[1], 10);
    var articleByIdDef = articleById.oneArticle(articleId);
    articleByIdDef.done(listArticle);
    
    function listArticle() {
        var articleByIdModel = articleById.models;
        // console.log('articleByIdModel', articleByIdModel);
        var articleByIdHTML =
            "<li class='article' data-article-id=" + articleByIdModel[0].article_id + 
            "><h3>" + articleByIdModel[0].title + "</h3>"+
            "<div>"+articleByIdModel[0].content+"</div>"+
            "<img class='img-article' src='../../uploads/" + articleByIdModel[0].images + "' >" +
            "<div class='js-article-comments'></div>" +
            "<input class='commentator-name' type='text' placeholder='Nume'></input>"+
            "<textarea class='commentator-msg' placeholder='Comentariu'></textarea>" +
            "<button class=js-add-comment>Adauga comentariu</button>" +
            "</li>";
        var moderatedArticleByIdHTML = 
            "<li data-article-id=" + 
            articleByIdModel[0].article_id + "><h3>" + 
            articleByIdModel[0].title + "</h3>" + "<div>" + 
            articleByIdModel[0].content+"</div>" + 
            "<button type='submit' class='btn btn-default js-edit-article'>Editeaza</button>" +
            "<button type='submit' class='btn btn-default js-delete-article'>Sterge</button>" +
            "</li>";
        articlesContainer.append(articleByIdHTML);
        moderatedArticlesContainer.append(moderatedArticleByIdHTML);
        var commentsForArticleDef = commentsForArticle.getComments(articleId);
        commentsForArticleDef.done(listComments);
        // console.log('articleByIdModel.article_id', articleByIdModel.article_id);
        
        $('.js-add-comment').on('click', function() {
            captureComment();
        });
    }
    
    function stackComments(commentsForArticle) {
        var commentsContainer = $(".one-article .js-article-comments");
        var commentForArticleHTML = 
            "<div data-comment-id='" + commentsForArticle.comment_id + "'><p>" + 
            commentsForArticle.commentator_name + "</p>" +
            "<p>" + commentsForArticle.commentator_msg + "</p>" +
            "</div>";
        commentsContainer.append(commentForArticleHTML);
    }
    
    function listComments() {
        var commentsForArticleModel = commentsForArticle.models;
        for (var i = 0; i < commentsForArticleModel.length; i++) {
            stackComments(commentsForArticleModel[i]);
        }
    }
    
    function captureComment() {
        var comment = {
            article_id: $('.article').attr('data-article-id'),
            commentator_name: $('.commentator-name').val(),
            commentator_msg: $('.commentator-msg').val()
        };
        commentsForArticle.addComment(comment);
        stackComments(comment);
    }
    
    $('.js-toggle-login-modal').on('click', function(){
        // insereaza modala din JS daca ai timp
        
        $('#myModalHorizontal').modal('show');
    });
    
    $('.js-login').on('click', function(event) {
        event.preventDefault();
        return $.ajax({
            url: "/api/login",
            type: "POST",
            dataType: "json",
            data: {
                user: $('[name="user"]').val(),
                password: $('[name="password"]').val()
            },
            success: function(resp) {
                // console.log(resp);
                if (resp.isLogged) {
                    window.location.href = "//simple-blog-ccampean.c9users.io/ui/pages/dashboard.html";
                }
            },
            error: function(xhr, status, errorMessage) {
                console.log("Error status @login: ", status);
            },
            complete:function(){
                console.log("AJAX Req has completed");
            }
        });
    });
});