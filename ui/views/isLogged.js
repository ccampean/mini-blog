/*global $*/

$(window).ready(function() {
    (function checkSession() {
        $.ajax({
            url:"/api/session",
            type:"GET",
            success:function(resp) {
                resp = JSON.parse(resp);
                if (resp.logged ===  false){
                    window.location.href = "//simple-blog-ccampean.c9users.io";
                } else {
                    console.log("sesiunea de logare exista");
                }
            }
        });
    })();
});