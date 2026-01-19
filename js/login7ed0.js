$(document).ready(function (e) {
    ES6Promise.polyfill();
    let captchaExist = "";
    let is2FA = false;
    let checkBoxState = 1;
    
    let progressStart = function () {
        $("#process").css("display", "block");
    };
    let progressStop = function () {
        $("#process").css("display", "none");
    };

    $('#img').click(function () {
        $('#img').attr('src', 'simpleCaptcha.png?rand=' + Math.random());
    });

    $('#refresh').click(function () {
        $('#img').attr('src', 'simpleCaptcha.png?rand=' + Math.random());
    });

    $('#login-input').on(
        "keypress",
        function (e) {
            if (e.which === 13) {
                // Focus next textfield
                $('#pass-input').focus();
                e.preventDefault();
            }
            // TODO: For last TextField, do nothing
        });
    $('#pass-input').on(
        "keypress",
        function (e) {
            if (e.which === 13) {
                if (is2FA) {
                    // Focus next textfield
                    $('#keyauth-input').focus();
                    e.preventDefault();
                } else if ($('#code_captcha')[0].style.display !== "none") {
                    // Focus next textfield
                    $('#captcha').focus();
                    e.preventDefault();
                } else {
                    $('#login_btn').click();
                    e.preventDefault();
                }

            }
            // TODO: For last TextField, do nothing
        });
    $('#captcha').on(
        "keypress",
        function (e) {
            if (e.which === 13) {
                $('#login_btn').click();
                e.preventDefault();
            }
            // TODO: For last TextField, do nothing
        });
    $('#keyauth-input').on(
        "keypress",
        function (e) {
            if (e.which === 13) {
                $('#login_btn').click();
                e.preventDefault();
            }
            // TODO: For last TextField, do nothing
        });
    if (sessionStorage.getItem('isCaptcha')) {
        $('#code_captcha')[0].style.display = "";
    }
    $('#err-autorize').html(sessionStorage.getItem("ERLOGIN"));
    $('#err-captcha').html(sessionStorage.getItem("CAPTCHA"));
    $('#err-login').html(sessionStorage.getItem("LOGIN"));
    $('#err-pass').html(sessionStorage.getItem("PASSWORD"));
    sessionStorage.removeItem("ERLOGIN");
    sessionStorage.removeItem("CAPTCHA");
    sessionStorage.removeItem("LOGIN");
    sessionStorage.removeItem("PASSWORD");


    $('#login_btn').click(function () {
        let params = {
            login: $('#login-input').val(),
            password: $('#pass-input').val(),
            captchaExist: captchaExist === 'true' ? 1 : 0,
            response: $('#captcha').val()
        };
        progressStart();
        if (is2FA) {
            $.ajax({
                url: "/client/login?operation=login&username=" + params.login + "&password=" + encodeURIComponent(params.password) + "&keyauth=" + $('#keyauth-input')
                    .val().trim() + "&showmodal=" + checkBoxState,
                type: 'POST',
                success: function (response) {
                    try {
                        if ((typeof response) === 'string' && response.indexOf('login_form') !== -1) {
                            progressStop();
                            swal("Ваша сессия просрочена! Пожалуйста перезайдите в Интернет-банк");
                            location.reload();
                            return;
                        }
                        progressStop();
                        response = JSON.parse(response);
                        if (response.status == "ERROR") {
                            swal(response.description).then(function () {
                                location.reload();
                            });
                        }
                    } catch (e) {
                        sessionStorage.setItem('initBankMessages', "Y");
                        //console.error("error", e);
                        location.reload();
                    }
                },
                error: function (x, e) {
                    //console.error("error", x);
                    progressStop();
                    swal("При обработке запроса возникла ошибка. Попробуйте еще раз.");
                    location.reload();
                }
            });
        } else {
            $.ajax({
                url: "/client/login?operation=check&username=" + params.login + "&password=" + encodeURIComponent(params.password) + "&response=" + params.response,
                type: 'POST',
                success: function (response) {
                    try {
                        if ((typeof response) === 'string' && response.indexOf('login_form') !== -1) {
                            progressStop();
                            swal("Ваша сессия просрочена! Пожалуйста перезайдите в Интернет-банк");
                            location.reload();
                            return;
                        }
                        response = JSON.parse(response);
                        progressStop();
                        if (response.status == "OK") {
                            sessionStorage.clear();

                            sessionStorage.setItem('initBankMessages', "Y");

                            if (response.json.map.is2FA == 1) {
                                $('#login-input').attr('disabled', 'disabled');
                                $('#login-input').addClass('login_disabled_input');
                                $('#pass-input').attr('disabled', 'disabled');
                                $('#pass-input').addClass('login_disabled_input');
                                $('#forgot-pass').removeAttr('href');
                                $('#forgot-pass').css({
                                    'color': '#C8C8C8',
                                    'text-decoration': 'underline',
                                    'cursor': 'default'
                                });
                                if (+response.json.map.show2FAModal == 1) {
                                    $('#code_captcha')[0].style.display = "none";
                                    $('#err-autorize').html(response.json.map.ERLOGIN);
                                    $('#err-captcha').html(response.json.map.CAPTCHA);
                                    $('#err-login').html(response.json.map.LOGIN);
                                    $('#err-pass').html(response.json.map.PASSWORD);
                                    progressStop();
                                    swal({
                                            type: 'warning',
                                            input: 'checkbox',
                                            inputPlaceholder: 'Больше не показывать',
                                            html: '<div class="modal-login-containeer">' +
                                                '<p>В целях защиты персональных данных от мошеннических действий установлена двухфакторная аутентификация при входе в систему «Интернет-Банк» с использованием одноразовых паролей. </br>' + '</p>' +
                                                '<p class="modal-login-text-block">При двухфакторной аутентификации недостаточно знания постоянного логина и пароля для входа в систему «Интернет-Банк». Вы будете дополнительно получать автоматически сгенерированный Банком одноразовый пароль в момент каждого входа в систему «Интернет-Банк». </br>' + '</p>' +
                                                '<p>Одноразовые пароли исключают возможность использования мошенниками похищенных данных для входа в систему «Интернет-Банк» и защищают Вас от введения ваших личных данных на фишинговых (поддельных) сайтах. </br>' + '</p>' +
                                                '<p class="modal-login-subtitle">Отключить двухфакторную аутентификацию можно в системе «Интернет-Банк» \n' +
                                                'в разделе «Персональные настройки». Для перехода в раздел нажмите на Ваше Имя. </br>' + '</p>' +
                                                '</div>',
                                            confirmButtonText: 'Ознакомлен',
                                            confirmButtonClass: 'modal-login-button',
                                            // showLoaderOnConfirm: true,
                                            preConfirm: function (cbox) {
                                                return new Promise(function (resolve, reject) {
                                                    setTimeout(function () {
                                                        resolve();
                                                    }, 100);
                                                });
                                            },
                                            allowOutsideClick: false
                                        }
                                    ).then(function (checkbox) {
                                        checkBoxState = +checkbox ? 0 : 1;
                                        is2FA = true;
                                        $('#keyauth-block')[0].style.display = "";
                                        $('#keyauth-span').text($('#keyauth-span').text() + response.json.map.key_num);
                                        $('#keyauth-type').text(response.json.map.auth);
                                        $('#login_btn span').text('Подтвердить');
                                        $('#login_btn').css({
                                            'background': 'url(https://ibank.bankexim.com/client/images/login-btn.png) no-repeat',
                                            'width': '125px',
                                            'padding-left': '0',
                                            'text-align': 'center'
                                        });
                                        $('#keyauth-input').focus();

                                    });
                                } else {
                                    $('#code_captcha')[0].style.display = "none";
                                    $('#err-autorize').html(response.json.map.ERLOGIN);
                                    $('#err-captcha').html(response.json.map.CAPTCHA);
                                    $('#err-login').html(response.json.map.LOGIN);
                                    $('#err-pass').html(response.json.map.PASSWORD);
                                    is2FA = true;
                                    $('#keyauth-block')[0].style.display = "";
                                    $('#keyauth-span').text($('#keyauth-span').text() + response.json.map.key_num);
                                    $('#keyauth-type').text(response.json.map.auth);
                                    $('#login_btn span').text('Подтвердить');
                                    $('#login_btn').css({
                                        'background': 'url(https://ibank.bankexim.com/client/images/login-btn.png) no-repeat',
                                        'width': '125px',
                                        'padding-left': '0',
                                        'text-align': 'center'
                                    });
                                    $('#keyauth-input').focus();
                                }
                            } else {
                                // что-то если нет двуфактора
                                progressStart();
                                $.ajax({
                                    url: "/client/login?operation=login&username=" + params.login + "&password=" + encodeURIComponent(params.password),
                                    type: 'POST',
                                    success: function (response) {
                                        progressStop();
                                        try {
                                            if ((typeof response) === 'string' && response.indexOf('login_form') !== -1) {
                                                progressStop();
                                                swal("Ваша сессия просрочена! Пожалуйста перезайдите в Интернет-банк");
                                                location.reload();
                                                return;
                                            }
                                            response = JSON.parse(response);
                                            if (response.status == "ERROR") {
                                                swal(response.description).then(function () {
                                                    location.reload();
                                                });
                                            }
                                        } catch (e) {
                                            sessionStorage.setItem('initBankMessages', "Y");
                                            location.reload();
                                        }
                                    },
                                    error: function (x, e) {
                                        //console.log("error", x);
                                        progressStop();
                                        swal("При обработке запроса возникла ошибка. Попробуйте еще раз.");
                                        location.reload();
                                    }
                                });
                            }

                        } else {
                            if (response.json.map.CAPTCHABLOCK === 1) {
                                $('#code_captcha')[0].style.display = "";
                            }
                            sessionStorage.setItem("ERLOGIN", response.json.map.ERLOGIN)
                            sessionStorage.setItem("CAPTCHA", response.json.map.CAPTCHA)
                            sessionStorage.setItem("LOGIN", response.json.map.LOGIN)
                            sessionStorage.setItem("PASSWORD", response.json.map.PASSWORD)
                            sessionStorage.setItem('isCaptcha', response.json.map.CAPTCHABLOCK);
                            $('#refresh').click();
                            $('#captcha').val("");
                            $('#pass-input').val("");
                            location.reload();
                        }
                    } catch (e) {
                        //console.error("error", e);
                        location.reload();
                    }
                },
                error: function (x, e) {
                    //console.log("error", x);
                    progressStop();
                    swal("При обработке запроса возникла ошибка. Попробуйте еще раз.");
                    location.reload();
                }
            });
        }
    });


});
