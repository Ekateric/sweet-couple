/**
 * Main.js
 */
/**
 * Получаем данные с сервера
 * @param url {string} урл запроса
 * @param params {object} параметры запроса
 * @param ready {function} колбэк
 */
function getData(url, params, ready) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function() {
		if(this.readyState === 4 && this.status === 200) {
			ready(this.responseText);
		}
	};
	xhr.send(params);
}

/**
 * Создаем разметку ответа от сервера
 * @param params {object} параметры ответа
 */
function resultTmpl(params) {
	return '<section class="gift-result gift-result_success"> \
		<div class="gift-result__title">' + params.title + '</div> \
		<div class="gift-result__users"> \
			<div class="round-user round-user_w-136"> \
				<img src="../img/users/girl.jpg" width="182" height="182" alt="' + params.userName + '" class="round-user__img"> \
			</div> \
			<div class="gift-result__gift-wrap"> \
				<img src="' + params.giftImage + '" width="101" height="150" alt="Ваш подарок" class="gift-result__img"> \
			</div> \
			<div class="round-user round-user_w-136"> \
				<img src="' + params.myImg + '" width="150" height="150" alt="Я" class="round-user__img"> \
			</div> \
		</div> \
		<div class="gift-result__achieve">' + params.achieve + '</div> \
		<div class="gift-result__sub-title">' + params.subTitle + '</div> \
		<p class="gift-result__text">' + params.resultText + '</p> \
		<div class="gift-result__actions"> \
			<a href="#" class="btn btn_grey gift-result__ok">Отлично!</a> \
			<input type="checkbox" name="tell" id="tell" class="hide-checkbox" checked> \
			<label for="tell" class="checkbox-label gift-result__share-label">Рассказать друзьям</label> \
		</div> \
	</section>'
}

/**
 * Отправляем данные формы на сервер
 * @param e {object} объект события
 */
function sendEvent(e) {
	e.preventDefault();

	var sendBtn = this,
		form = document.forms.gift,
		formData = new FormData(form);

	formData.append('giftId', sendBtn.parentElement.getAttribute('data-gift-id'));

	getData(form.getAttribute('action'), formData, function(requestData) {
		requestData = JSON.parse(requestData);

		if(requestData.status) {
			//Если пользователь дарил пирожное
			if(requestData.alreadyTake) {
				var resultHtml = '',
					resultBlock = document.querySelector('.popup__result');

				requestData.userImg = form.querySelector('.round-user_gift .round-user__img').getAttribute('src');
				resultHtml = resultTmpl(requestData);
				resultBlock.innerHTML = resultHtml;
				resultBlock.classList.remove('popup__result_hidden');
				resultBlock.querySelector('.gift-result').classList.add('gift-result_animation');
			} else {
				//Если пользователь НЕ дарил пирожное - нет указаний в ТЗ
			}
		} else {
			//Если поле status==false - ошибка при запросе (например, этому пользователю нельзя дарить подарки и тд)
			alert('Запрос прошел с ошибкой')
		}
	});
}


(function() {
	//Кнопки "Отправить"
	var sendBtns = document.querySelectorAll('.gift-item__send');
	[].forEach.call(sendBtns, function(btn) {
		btn.addEventListener('click', sendEvent, false);
	});
})();


