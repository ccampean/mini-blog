
/*global $, Articles, Comments, location*/

$(window).ready(function(){
    
    var articlesContainer = $(".js-articles");
    var moderatedArticlesContainer = $(".js-moderated-articles");
    var articles = new Articles();
    var articlesDef = articles.getArticles();
    articlesDef.done(listComments);
    
    function listComments(){
        var articleModels = articles.models;

        for (var i=0; i < articleModels.length; i++){
            var articleHtml = 
                "<a href='//simple-blog-ccampean.c9users.io/ui/pages/one-article.html?id=" + 
                articleModels[i].article_id + "' target='_blank'>" +
                "<li data-article-id=" + articleModels[i].article_id + 
                "><h3>" + articleModels[i].title + "</h3>"+
                "<div>"+articleModels[i].content+"</div>"+
                "<div class='js-article-comments'></div>"+
                "<textarea class='comment-text'></textarea>" +
                "<button class=js-add-comment>Add Comment</button>" +
                "</li>" + "</a>";
            var moderatedArticleHTML = 
                "<li data-article-id=" + 
                articleModels[i].article_id + "><h3>" + 
                articleModels[i].title + "</h3>" + "<div>" + 
                articleModels[i].content+"</div>" + 
                "<a href='//simple-blog-ccampean.c9users.io/ui/pages/update-article.html?id=" + 
                articleModels[i].article_id + "' target='_blank'>" +
                "<button type='submit' class='btn btn-default js-edit-article'>Editeaza</button></a>" +
                "<button type='submit' class='btn btn-default js-delete-article'>Sterge</button>";
            articlesContainer.append(articleHtml);
            moderatedArticlesContainer.append(moderatedArticleHTML);
        }
    }
    
    $('.js-toggle-login-modal').on('click', function(){
        // insereaza modala din JS daca ai timp
        
        $('#myModalHorizontal').modal('show');
    });
    
    $('.js-login').on('click', function(event) {
        event.preventDefault();
        // console.log("logat");
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
                console.log("Eroare la login: ", status);
            },
            complete:function(){
                console.log("AJAX Req has completed");
            }
        });
    });
    
    $('.js-send-message').on('click', function(event) {
        event.preventDefault();
        return $.ajax({
            url: "/api/contact",
            type: "POST",
            dataType: "json",
            data: {
                message_email: $('[name="message_email"]').val(),
                message: $('[name="message"]').val()
            },
            success: function(resp) {
                console.log('id ul mesajul trimis este', resp.id);
                console.log('tot', resp);
                
            },
            error: function(xhr, status, errorMessage) {
                console.log('Eroare la trimiterea mesajului: ', status);
            }
        });
    });
    
    $('.js-moderated-articles').on('click','button.js-delete-article', function() {
        var articleId = $(this).closest("li").attr('data-article-id');
        var deletedArticle = new Articles();
        deletedArticle.delete(articleId);
        $(this).closest("li").remove();
        // console.log($(this).parents("li:first").attr('data-article-id'));
        // console.log($(this).closest("li").attr('data-article-id'));
    });
    
    // eventListener pentru butonul "Iesire" 
    $('.js-logOut').on("click", function(event) {
        return $.ajax({
            url: "/api/logout",
            type: "GET",
            success: function(resp) {
                var jsonToObj = JSON.parse(resp);
                if (jsonToObj.success) {
                    window.location.href = "//simple-blog-ccampean.c9users.io";
                }
            },
            error: function(xhr, status, errorMessage) {
                console.log("Error status when trying to logout: ", status);
            }
        });
    });
    
    // eventListener pentru butonul "Articole" de pe toate paginile
    $(".js-articles-btn").on("click", function(event) {
        event.preventDefault();
        window.location.href = "dashboard.html";
    });
    
    // eventListener pentru butonul "Salveaza-l" de pe pagina create-article.html
    $('.js-save-article').on('click', function(event) {
        event.preventDefault();
        var formData = new FormData();
        formData.append("images", $('.images-input')[0].files[0]);
        formData.append("title", $('.title-input').val());
        formData.append("content", $('.content-input').val());
        
        console.log('articleData', formData);
        var prepareArticle = new Articles();
        prepareArticle.add(formData);
    });
    
    // var rows_per_page = 2;
    // var total_rows;
    
    // function initPageNumbers() {
    //     //Get total rows number
    //     $.get('/api/articles/countrows', function(data){
    //         total_rows = parseInt(data.total_rows);
    
    //         //Loop through every available page and output a page link
    //         var count = 1;
    //         for (var x = 0;  x < total_rows; x += rows_per_page) {
    //             $('#page-numbers').append('<li><a href="#'+count+'" onclick="getPage('+count+');">'+count+'</a></li>');
    //             count++;
    //         }
    //     });
    // }
});