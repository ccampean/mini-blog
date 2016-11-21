/* global $, Articles, location */

$(window).ready(function() {
    var articles = new Articles();
    var id = location.search.split('id=')[1];
    var articleDef = articles.oneArticle(id);
    articleDef.done(populateArticle);
    
    function populateArticle(){
        var articleModel = articles.models;
        $("[name='title']").val(articleModel[0].title);
        $("[name='content']").val(articleModel[0].content);
    }
    
    // eventListener pentru butonul "Salveaza-l" de pe pagina update-article.html
    $('.js-update-article').on('click', function(event) {
        event.preventDefault();
        var formData = new FormData();
        formData.append("article_id", id);
        formData.append("title", $("[name='title']").val());
        formData.append("content", $("[name='content']").val());
        articles.update(formData);
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
});