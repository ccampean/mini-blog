/*global $, Articles, location*/

$(window).ready(function() {
    
    // pagination is implemented following this tutorial, https://www.sitepoint.com/pagination-jquery-ajax-php/
    var articlesPerPageContainer = $('.js-rows');
    var moderatedArticlesPerPageContainer = $('.js-moderated-rows');
    var rows_per_page = 2;
    var total_rows;
    var page_num = 1;
    var articlesPerPage = new Articles();
    var articlesPerPageDef = articlesPerPage.page(page_num, rows_per_page);
    articlesPerPageDef.done(listArticles);
    
    (function initPageNumbers() {
        return $.ajax({
            url: "/api/articles/countrows",
            type: "GET",
            dataType: "json",
            success: function(resp) {
                total_rows = parseInt(resp.total_rows, 10);
                //Loop through every available page and output a page link
                var count = 1;
                $('.page-numbers').append('<li><a href="#">&laquo;</a></li>');
                for (var x = 0;  x < total_rows; x += rows_per_page) {
                    $('.page-numbers').append('<li><a class="js-current-page" data-page="' + count + '" data-items="' + rows_per_page + '" href=" " >' + count + '</a></li>');
                    count++;
                }
                $('.page-numbers').append('<li><a href="#">&raquo;</a></li>');
            },
            error: function(xhr, status, errorMessage) {
                console.log("Statusul erorii la GET ul numarului de articole din db: ", status);
            }
        });
    })();
    
    function listArticles() {
        var articlesPerPageModels = articlesPerPage.models;

        for (var i=0; i < articlesPerPageModels.length; i++){
            var articleHtml = 
                "<a href='//simple-blog-ccampean.c9users.io/ui/pages/one-article.html?id=" + 
                articlesPerPageModels[i].article_id + "' target='_blank'>" +
                "<li data-article-id=" + articlesPerPageModels[i].article_id + 
                "><h3>" + articlesPerPageModels[i].title + "</h3>"+
                "<div>"+articlesPerPageModels[i].content+"</div>"+
                "<div class='js-article-comments'></div>"+
                "<textarea class='comment-text'></textarea>" +
                "<button class=js-add-comment>Add Comment</button>" +
                "</li>" + "</a>";
            var moderatedArticleHTML = 
                "<li data-article-id=" + 
                articlesPerPageModels[i].article_id + "><h3>" + 
                articlesPerPageModels[i].title + "</h3>" + "<div>" + 
                articlesPerPageModels[i].content+"</div>" + 
                "<a href='//simple-blog-ccampean.c9users.io/ui/pages/update-article.html?id=" + 
                articlesPerPageModels[i].article_id + "' target='_blank'>" +
                "<button type='submit' class='btn btn-default js-edit-article'>Editeaza</button></a>" +
                "<button type='submit' class='btn btn-default js-delete-article'>Sterge</button>";
            articlesPerPageContainer.append(articleHtml);
            moderatedArticlesPerPageContainer.append(moderatedArticleHTML);
        }
    }
    
    $('.js-toggle-login-modal').on('click', function(){
        // insereaza modala din JS daca ai timp
        
        $('#myModalHorizontal').modal('show');
    });
    
    $('.js-login').on('click', function(event) {
        event.preventDefault();
        //ajax requests for login/logout should be done in User model
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
    
    $('.js-moderated-articles').on('click', 'button.js-delete-article', function() {
        var articleId = $(this).closest("li").attr('data-article-id');
        var deletedArticle = new Articles();
        deletedArticle.delete(articleId);
        //reomve the article from UI only when delete from DB is successful
        $(this).closest("li").remove();
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
    
    $('.js-input-search').on('keyup', function(event) {
        event.preventDefault();
        articlesPerPageContainer.empty();
        moderatedArticlesPerPageContainer.empty();
        $('.page-numbers').empty();
        
        var searchQuery = $('[name="searchQuery"]').val();
        articlesPerPage = new Articles();
        articlesPerPageDef = articlesPerPage.search(searchQuery);
        articlesPerPageDef.done(listArticles);
        
        if (!this.value) {
            location.reload();
        }
    });
    
    // eventListener pus pe fiecare numar de pagina, care incarca articolele corespunzatoare
    $('.page-numbers').on('click', '.js-current-page', function(event) {
        event.preventDefault();
        articlesPerPageContainer.empty();
        moderatedArticlesPerPageContainer.empty();
        // console.log('page is', $(this).attr('data-page'));
        page_num = $(this).attr('data-page');
        rows_per_page = $(this).attr('data-items');
        articlesPerPage = new Articles();
        articlesPerPageDef = articlesPerPage.page(page_num, rows_per_page);
        articlesPerPageDef.done(listArticles);
    });
});