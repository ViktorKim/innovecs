var form = document.querySelector('form');
var invalidFields = '';
form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var _form = this;

    var _validationMessages = _form.getElementsByClassName('validation-message');

    if(_validationMessages.length !== 0){
        for (var key in invalidFields) {
            removeValidationMessage(form.querySelector('[name="'+key+'"]'));
        }
    }
    invalidFields = validateForm(_form);



    if (isEmptyObject(invalidFields)) {
        sendMail(_form);
    } else {
        for (var key in invalidFields) {
            showValidationMessage(invalidFields[key], form.querySelector('[name="'+key+'"]'));
        }
    }
});

/**
 * Check is form valid.
 *
 * @param form
 * @returns {Array}
 */
function validateForm(form) {
    var _invalidFields = {};
    var _inputs = form.getElementsByClassName('validate');

    for (var i = 0; i < _inputs.length; ++i) {
        // check required fields
        if (_inputs[i].classList.contains('is-required') && _inputs[i].value === '') {
            _invalidFields[_inputs[i].getAttribute('name')] = '<div>This field is required</div>';
        }

        // check length
        var _minCharsCount = _inputs[i].getAttribute('min');
        if (_minCharsCount !== null && _inputs[i].value !== '' && _inputs[i].value.length < _minCharsCount) {
            _invalidFields[_inputs[i].getAttribute('name')] = (_invalidFields[_inputs[i].getAttribute('name')] === undefined) ? '' : _invalidFields[_inputs[i].getAttribute('name')];
            _invalidFields[_inputs[i].getAttribute('name')] += '<div>This field mast contains more than ' + _minCharsCount + ' symbols.</div>';
        }
    }
    // check mail
    var _regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var _emailInput = form.querySelector('[name="email"]');
    if (_emailInput.value !== '' && _regex.test(_emailInput.value) === false){
        _invalidFields['email'] = _invalidFields['email'] === undefined  ? '' : _invalidFields['email'];
        _invalidFields['email'] += '<div>Email is incorrect</div>'
    }

    // check phone
    var _phoneNumberCode = form.querySelector('[name="country_code"]');
    var _phoneNumber = form.querySelector('[name="phone_number"]');
    if ((_phoneNumber.value !== '' || _phoneNumberCode.value !== '') &&
        (/^\d+$/.test(_phoneNumber.value) === false||/^\+?\d+$/.test(_phoneNumberCode.value) === false)){
        _invalidFields['phone_number'] = _invalidFields['phone_number'] === undefined  ? '' : _invalidFields['phone_number'];
        _invalidFields['phone_number'] += '<div>Phone number should be only digits</div>'
    }

    return _invalidFields;
}

/**
 * Insert validation message to DOM
 *
 * @param mes
 * @param inp
 */
function showValidationMessage(mes, inp) {
    var _currentFormGroup = getParentByClass(inp, 'form-group');
    var _message = document.createElement('div');
    _message.classList.add('validation-message');
    _message.innerHTML = mes;
    _currentFormGroup.parentElement.insertBefore(_message, _currentFormGroup);
}

function removeValidationMessage(inp) {
    var _currentFormGroup = getParentByClass(inp, 'form-group');
    var _message = _currentFormGroup.parentElement.querySelector('.validation-message');
    _currentFormGroup.parentElement.removeChild(_message);
}

/**
 * Send form with Ajax request
 * @param form
 */
function sendMail(form) {
    var xhr = new XMLHttpRequest();

    var formData = new FormData(form);

    xhr.open('POST', 'mailsender.php', true);
    xhr.send(formData);

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
        } else {
            var _response = JSON.parse(xhr.responseText);
            if (_response.status === 'true') {
                form.innerHTML = _response.message;
            } else {
                var _mailInput = document.querySelector("[name='email']");
                _mailInput.focus();

                var _validationMessage = form.querySelector('.validation-message');
                if (typeof _validationMessage !== 'undefined' && _validationMessage !== null){
                    getParentByClass(_mailInput, 'form-group').parentElement.removeChild(_validationMessage);
                }
                showValidationMessage(_response.message, _mailInput);
            }
        }
    }
}

/**
 * Find parent element by className
 *
 * @param el
 * @param cls
 * @returns {HTMLElement}
 */
function getParentByClass(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls)) ;
    return el;
}

/**
 *
 * @param obj
 * @returns {boolean}
 */
function isEmptyObject(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}