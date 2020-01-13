$(function(){
    const URL_API = "http://greenvelvet.alwaysdata.net/kwick/api/";

    function getApiPing(){
        $.ajax({
            url: `${URL_API}ping`,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            let data = JSON.stringify(response);
            console.log(data);
        })
        .fail(function(error){
            console.log("Echec" + JSON.stringify(error));
        })
    }
    // getApiPing();

    function signUp(evt){
        evt.preventDefault();

        let signUpUser = $('#username-signUp').val(),
            signUpPw = $('#password-signUp').val();
        
        const SIGNUP_API = `${URL_API}/signup/${signUpUser}/${signUpPw}`;
        console.log(SIGNUP_API);

        $.ajax({
            url: SIGNUP_API,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            console.log("Inscription réussie")
            let data = JSON.stringify(response);
            console.log(data);
        })
        .fail(function(error){
            console.log("Echec" + JSON.stringify(error));
        });
    }

    function logIn(evt){
        evt.preventDefault();

        let loginUser = $('#username-login').val(),
            loginPw = $('#password-login').val();
        
        const LOGIN_API = `${URL_API}/login/${loginUser}/${loginPw}`;
        console.log(LOGIN_API);
    
        $.ajax({
            url: LOGIN_API,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            console.log("Connexion réussie")
            let data = JSON.stringify(response);
            console.log(data);
        })
        .fail(function(error){
            console.log("Echec" + JSON.stringify(error));
        });
    }

    $('.form-signup').on('submit', signUp);
    $('.form-login').on('submit', logIn);

});