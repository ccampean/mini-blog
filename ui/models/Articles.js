/*global $, Article*/


function Articles() {
    this.models = [];
}

Articles.prototype.getArticles = function(){
    var that = this;
    return $.ajax({
        url: "/api/articles",
        type: "GET",
        dataType:"json",
        success:function(resp){
            for(var i = 0; i<resp.length; i++){
               var article = new Article(resp[i]);
               that.models.push(article);
            }
        },
        error:function(xhr,status,errorMessage){
            console.log("Statusul erorii la GEt ul de articole: ", status);
        }
    });
};

Articles.prototype.oneArticle = function(articleId) {
    var that = this;
    return $.ajax({
        url: "/api/articles/get?id=" + articleId,
        type: "GET",
        dataType: "json",
        data: {
            id: articleId
        },
        success: function(resp) {
            console.log('raspunsul de la GET ul pentru articol in functie de id', resp);
            var specificArticle = new Article(resp);
            that.models.push(specificArticle);
        },
        error: function(xhr, status, errorMessage) {
            console.log("Error status when trying to load one article: ", status);
        }
    });
};

Articles.prototype.search = function(searchQuery) {
    var that = this;
    return $.ajax({
        url: "/api/articles/search?searchQuery=" + searchQuery,
        type: "GET",
        dataType: "json",
        data: {
            searchQuery: searchQuery
        },
        success: function(resp) {
            // console.log('toate cautarile', resp);
            for (var i = 0; i < resp.length; i++) {
               var article = new Article(resp[i]);
               that.models.push(article);
            //   console.log('models', that.models);
            }
        },
        error: function(xhr, status, errorMessage) {
            console.log('Eroare la cautare: ', status);
        }
    });
}

Articles.prototype.delete = function(articleId) {
    return $.ajax({
        url: "/api/articles/delete?id=" + articleId,
        type: "GET",
        dataType: "json",
        data: {
            id: articleId
        },
        success: function(resp) {
            console.log(resp);
        },
        error:function(xhr, status, errorMessage){
            console.log("Error status when trying to delete an article: " + status);
        }
    });
};

Articles.prototype.add = function(formData){
    return $.ajax({
        url: "/api/articles/add",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(resp) {
            if (JSON.parse(resp).hasOwnProperty('id')) {
                $('.response-to-save-article').append('<p class="append-response">Articolul a fost creat cu succes</p>');
            }
        },
        error: function(xhr, status, errorMessage){
            console.log("Error status when trying to create an article: ", status);
        }
    });
};

Articles.prototype.update = function(formData){
    return $.ajax({
        url: "/api/articles/update",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(resp) {
            if (JSON.parse(resp)["success"]) {
                window.location.href = "dashboard.html";
            }
        },
        error: function(xhr, status, errorMessage) {
            console.log('Statusul erorii la update de articol: ', status);
        }
    });
};

Articles.prototype.page = function(page_num, rows_per_page) {
    var that = this;
    return $.ajax({
        url: "/api/articles/pagination",
        type: "POST",
        dataType: "json",
        data: {
            page: page_num,
            items: rows_per_page
        },
        success: function(resp) {
            for (var i = 0; i < resp.length; i++) {
                var article = new Article(resp[i]);
                that.models.push(article);
            }
        },
        error: function(xhr, status, errorMessage) {
            console.log('Statusul erorii la POST ul de paginare: ', status);
        }
    });
};

