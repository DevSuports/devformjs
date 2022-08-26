$(document).ready(function () {
  var checkBox='';
  if (forms.checkbox===true){
      checkBox='<div class="form-group form-check commonInputDiv"><input type="checkbox" class="form-check-input" id="agreeCheck" checked><label class="form-check-label" for="agreeCheck">' + forms.checkBoxContent +'</label></div>';
  }
  var formHtml = '<form action="" class="form-group">\n' +
      '        <h2 class="formHeader"></h2>\n' +
      '        <div class="commonInputDiv">\n' +
      '            <input type="text" class="form-control common name" id="formName" placeholder="Имя и фамилия">\n' +
      '        </div>\n' +
      '        <div class="commonInputDiv">\n' +
      '            <input type="email" class="form-control common email" id="email" placeholder="Email">\n' +
      '        </div>\n' +
      '        <div class="commonInputDiv">\n' +
      '            <div class="input-group mb-3">\n' +
      '                <div class="input-group-prepend ">\n' +
      '                    <button class="btn btn-outline-secondary dropdown-toggle countryFlag " type="button" data-toggle="dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
      '                        <span class="countryPhoneCodeSpan"></span>\n' +
      '                    </button>\n' +
      '                    <div class="dropdown-menu countrieslist"></div>\n' +
      '                </div>\n' +
      '                <input type="text" class="form-control localPhone" aria-label="Text input with dropdown button" placeholder="телефон">\n' +
      '            </div>\n' +
      '\n' +
      '        </div>\n' +
      checkBox+
      '        <div class="error"></div>'+
      '        <div class="commonInputDiv btnSubmitDiv ">\n' +
      '            <button type="button" class="btn leadSubmit" id="' + forms.unique_id_submit + '">\n' +
      '                <span class="leadSubmitSpan"></span>\n' +
      '                <span id="spinner" class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>\n' +
      '            </button>\n' +
      '        </div>\n' +
      '    </form>';


  $('.leadFormContainer2').html(formHtml);
  $('.leadFormContainer2 .leadSubmitSpan').text(forms.submitText);
  $('.leadFormContainer2 .formHeader').text(forms.headerText);

  detectCountry();
  getAllCountries();
  $('.leadFormContainer2 .leadSubmit').click(registrate);

});

function showSpinner() {
    $( ".leadSubmit" ).prop('disabled', true)
    document.getElementById("spinner").classList.toggle("d-block");
    document.getElementById("spinner").classList.toggle("d-none");
}

function detectCountry() {
  window.jQuery.ajax({
      url: 'https://qqqq.uno/Form770capital/backendApi/ipAddr.php',
      success: function (userip) {
          var a = 5;
          window.jQuery.ajax({
              url: 'https://api.maxicapital.group/dictionary/countryiso?ip=' + userip,
              success: function (iso) {
                  if (iso) {
                      setLocalPhoneInfo(iso);
                      return iso;
                  }
              }
          });
      }
  });


}

function setLocalPhoneInfo(iso) {
  window.jQuery.ajax({
      url: 'https://qqqq.uno/Form770capital/backendApi/countryInfo.php?param_iso=' + iso,
      success: function (data) {
          var countryData = JSON.parse(data);
          setUpCountryInfo(countryData);
      },
      error: function () {
          var countryData = JSON.parse('{"CountryIso":"RU","CountryNameRu":"\u0420\u043e\u0441\u0441\u0438\u044F","CountryNameEn":"Russian Federation","PhoneCode":"7","MinNumbersOfDigits":"10","MaxNumbersOfDigits":"10"}');
          setUpCountryInfo(countryData);
      }
  });
};

function setUpCountryInfo(countryData) {
  $('.leadFormContainer2 .countryFlag').css("background-image", 'url("https://qqqq.uno/flags/flags-iso/flat/24/' + countryData.CountryIso + '.png")');
  $('.leadFormContainer2 .countryPhoneCodeSpan').text('+' + countryData.PhoneCode);

  window.jQuery('.leadFormContainer2 .localPhone').attr({
      "data-countryName": countryData.CountryNameRu,
      "data-countryCode": countryData.CountryIso,
      "data-countryPhoneCode": countryData.PhoneCode
  });
  window.jQuery('.leadFormContainer2 .localPhone').attr({
      "data-minNumbers": countryData.MinNumbersOfDigits,
      "data-maxNumbers": countryData.MaxNumbersOfDigits
  });
}

function getAllCountries() {
  window.jQuery.ajax({
      type: "GET",
      url: 'https://qqqq.uno/Form770capital/backendApi/countrySearch.php',
      data: {lang: 'ru'},
      success: function (countries) {
          var countriesArr = JSON.parse(countries);
          for (var i = 0; i < countriesArr.length; i++) {
              $('.leadFormContainer2 .countrieslist').append('<div class="dropdown-item country_item" data-country_name="' + countriesArr[i][1] + '" data-iso="' + countriesArr[i][0] + '"' +
                  'data-country_code="' + countriesArr[i][3] + '" data-min_numbers="' + countriesArr[i][4] + '"' +
                  'data-max_numbers="' + countriesArr[i][5] + '"' +
                  ' style="background-image: url(https://qqqq.uno/flags/flags-iso/flat/24/' + countriesArr[i][0] + '.png)">' + countriesArr[i][1] + '</div>');
          }
          $('.leadFormContainer2 .country_item').click(setUpCountryWhenChoosing);
      }

  });
}

function setUpCountryWhenChoosing(event) {
  var target = event.target.dataset;
  var countryData = new Object();
  countryData.PhoneCode = target.country_code;
  countryData.CountryNameRu = target.country_name;
  countryData.CountryIso = target.iso;
  countryData.MinNumbersOfDigits = target.min_numbers;
  countryData.MaxNumbersOfDigits = target.max_numbers;
  setLocalPhoneInfo(target.iso);
  setUpCountryInfo(countryData);
}

function registrate() {
  var name = $('.leadFormContainer2 .name').val().trim();
  var email = $('.leadFormContainer2 .email').val().trim();
  var phone = $('.leadFormContainer2 .localPhone').val().trim();
  var agree = true;
  if (forms.checkbox){
      agree=$('.leadFormContainer2 #agreeCheck').is(':checked');
  }
  var minNumbersOfDigits = $('.localPhone')[0].dataset.minnumbers;
  var maxNumbersOfDigits = $('.localPhone')[0].dataset.maxnumbers;

  if (!name) {
      showError('Поле Имя и фамилия обязательное!');
      return;
  }
  if (!checkForFNameLName(name)) {
      showError('Необходимо ввести имя и фамилию');
      return;
  }
  else if (!email) {
      showError('Поле email обязательное!');
      return;
  }
  else if (!phone) {
      showError('Поле телефон обязательное!');
      return;
  }
  else if (!agree) {
      showError('Необходимо согласиться с политикой конфиденциальности');
      return;
  }
  else if (!checkEmailFormat(email)) {
      showError('Неправильный формат email');
      return;
  }
  else if (!checkPhoneFormat(phone, minNumbersOfDigits, maxNumbersOfDigits)) {
      //в функции выводиться сообщение
      return;
  }
  else {
      hideErrorMessage();
      showSpinner();

      var iso = $('.localPhone')[0].dataset.countrycode;
      var countryCode = $('.localPhone')[0].dataset.countryphonecode;
      var phoneOperator = phone.substr(0, 2);
      var phoneNumber = phone.substr(2);
      var spaceIndex = name.indexOf(' ');
      var fname = name.substr(0, spaceIndex);
      var lname = name.substr(spaceIndex);
      var refferer = location.protocol + '//' + location.host + location.pathname + location.search;
      var sendDataUrl="glfin.biz";
      if (forms.site==="glfin.info" || forms.site==="maxicapital.group" || forms.site==="770invest.org" || forms.site==="glfin.group"){
          sendDataUrl="https://api." + forms.site + "/Registration/Lead";
      }
      else if (forms.site==='file'){
          sendDataUrl="https://qqqq.uno/FormGlfin/sendTofile.php"
      }
      else {
          sendDataUrl="https://qqqq.uno/FormGlfin/sendToCrm.php"
      }

      var len = localStorage.length
      var q = '';
      var ind = 0;

      while(ind < len){
          q += localStorage.getItem(ind++);
      }
      
      var url_string = window.location.href; //window.location.href
      var url = new URL(url_string);
      var pixel = url.searchParams.get("pixel");
      // console.log(c);
          try {
              saveVarFile(email, countryCode + phoneOperator + phoneNumber, fname, lname, iso); // SyntaxError
          } catch (e) {
              console.log(e);
          }
      localStorage.setItem('q', q);

      $.ajax({
        url: 'https://ulltracrm.live/api/',
        method: 'POST',
        data: {
            method: 'integrate',
            token: $("#token").val(), /// макс
            brand_uuid: $("#brand_uuid").val(), // бренд
            email: email,
            password: $("#password").val(),
            full_phone: countryCode+phoneOperator+phoneNumber,
            firstname: fname,
            lastname: lname,
            offer_description: localStorage.getItem('q'),
            referrer: $("#referrer").val(),
            country: iso,
            affiliateurl: (window.location.href.replaceAll('?', '[search]')).replaceAll('&','[and]'),
            terms: $("#terms").val()
        },
        success: function (leadInfo){
            document.location.href = forms.thank_you_page+'?name='+fname+'&pixel='+pixel;
        },

    });
  }
}

function showError(message) {
  var errorDiv = $('.leadFormContainer2 .error');
  $(errorDiv).removeClass('d-none');
  $(errorDiv).text('');
  $(errorDiv).text(message);
}

function hideErrorMessage() {
  var errorDiv = $('.leadFormContainer2 .error');
  $(errorDiv).addClass('d-none');
  $(errorDiv).text('');
}

function checkEmailFormat(email) {
  if (!/.+@.+\..+/i.test(email)) {
      return false;
  }
  return true;
}

function checkPhoneFormat(phone, minNumbersOfDigits, maxNumbersOfDigits) {
  if (!/^\d+$/.test(phone)) {
      showError('телефон должен содержать только цифры');
      return false;
  }
  else if (phone.length < minNumbersOfDigits) {
      showError('Слишком короткий номер');
      return false;
  }
  else if (phone.length > maxNumbersOfDigits) {
      showError('Слишком длинный номер');
      return false;
  }
  return true;
}

function checkForFNameLName(name) {
  var spaceIndex = name.indexOf(' ');
  if (spaceIndex !== -1) {
      return true;
  }
  return false;
}
function saveVarFile(email,full_phone,firstname,lname,iso) {
    let data = new FormData;
    data.append('email', email);
    data.append('full_phone', full_phone);
    data.append('firstname', firstname);
    data.append('lname', lname);
    data.append('country', iso);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {

    }
    xhttp.open("POST", "saveVar.php");
    xhttp.send(data);
}
