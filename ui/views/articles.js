/*global $, Articles, location*/

$(window).ready(function() {
    
    // pagination is implemented following this tutorial, https://www.sitepoint.com/pagination-jquery-ajax-php/
    var articlesPerPageContainer = $('.js-rows');
    var moderatedArticlesPerPageContainer = $('.js-moderated-rows');
    var $pageNumbers = $('.page-numbers');
    var rows_per_page = 3;
    var total_rows;
    // var page_num = 1;
    var currentPageNum = 1;
    var targetPageNum = 1;
    var articlesPerPage = new Articles();
    var articlesPerPageDef = articlesPerPage.page(targetPageNum, rows_per_page);
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
                $pageNumbers.append('<li><a href="#" class="prev-page">&laquo;</a></li>');
                var template = '';
                for (var x = 0;  x < total_rows; x += rows_per_page) {
                    template += '<li><a class="js-current-page" data-page="' + count + '" data-items="' + rows_per_page + '" href=" " >' + count + '</a></li>';
                    count++;
                }
                $pageNumbers.append(template);
                $pageNumbers.append('<li><a href="#" class="next-page">&raquo;</a></li>');
                $($('.page-numbers .js-current-page')[0]).addClass('active');
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
                "><div class='container-img'><img src='" + "/uploads/" + articlesPerPageModels[i].images + 
                "' alt='reprezentative-picture' width='190' height='160' class='article-picture'></div><div class='container-body-article'><h3>" + 
                articlesPerPageModels[i].title + "</h3>"+
                "<div>"+articlesPerPageModels[i].content+"</div></div>"+
                "</li>" + "</a>";
            var moderatedArticleHTML = 
                "<li data-article-id=" + 
                articlesPerPageModels[i].article_id + "><div class='container-img'><img src='" + 
                "/uploads/" + articlesPerPageModels[i].images + 
                "' alt='reprezentative-picture' width='190' height='160' class='article-picture'></div><div class='container-body-article'><h3>" + 
                articlesPerPageModels[i].title + "</h3>" + "<div>" + 
                articlesPerPageModels[i].content+"</div></div><div class='container-article-buttons'>" + 
                "<a href='//simple-blog-ccampean.c9users.io/ui/pages/update-article.html?id=" + 
                articlesPerPageModels[i].article_id + "' target='_blank'>" +
                "<button type='submit' class='btn btn-default js-edit-article'>Editeaza</button></a>" +
                "<button type='submit' class='btn btn-default js-delete-article'>Sterge</button></div>";
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
    $pageNumbers.on('click', '.js-current-page', function(event) {
        event.preventDefault();
        articlesPerPageContainer.empty();
        moderatedArticlesPerPageContainer.empty();
        $('.page-numbers .js-current-page').removeClass('active');
        $(this).addClass('active');
        currentPageNum = $(this).attr('data-page');
        rows_per_page = $(this).attr('data-items');
        articlesPerPage = new Articles();
        articlesPerPageDef = articlesPerPage.page(currentPageNum, rows_per_page);
        articlesPerPageDef.done(listArticles);
    });
    
    function appendArticles(targetButton) {
        articlesPerPageContainer.empty();
        moderatedArticlesPerPageContainer.empty();
        currentPageNum = +$('.page-numbers .js-current-page.active').attr('data-page');
        targetPageNum = (targetButton == 'next') ? currentPageNum + 1 : currentPageNum - 1;
        $('.js-current-page[data-page="' + currentPageNum +'"]').removeClass('active');
        $('.js-current-page[data-page="' + targetPageNum +'"]').addClass('active');
        articlesPerPage = new Articles();
        articlesPerPageDef = articlesPerPage.page(targetPageNum, rows_per_page);
        articlesPerPageDef.done(listArticles);
    }
    
    $pageNumbers.on('click', '.next-page', function(event) {
        event.preventDefault();
        if ((+$('.page-numbers .js-current-page.active').attr('data-page')) <= Math.ceil(total_rows/rows_per_page) - 1) {
            appendArticles('next');
        }
    });
    
    $pageNumbers.on('click', '.prev-page', function(event) {
        event.preventDefault();
        if ((+$('.page-numbers .js-current-page.active').attr('data-page')) > Math.ceil(total_rows/total_rows)) {
            appendArticles('prev');
        }
    });
});