class MenuCard {
    constructor(src, alt, title, description, price, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.description = description;
        this.price = price;
        this.classes = classes;
        this.parent = document.querySelector(parentSelector);
        this.trasfer = 27;
        this.changeToUAH();
    }

    changeToUAH() {
        this.price = this.price * this.trasfer;
    }

    render() {
        const element = document.createElement('div');
        this.classes.forEach(className => element.classList.add(className));
        element.innerHTML = `
            <div class="menu__item">
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.description}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
        `;
        this.parent.append(element);
    }
}
const getResource = async (url) => {
    const res = await fetch(url)

    if(!res.ok) {
        throw new Error(`Не можемо отримати з ${url}, статус: ${res.status}`);
    }

    return await res.json();
};

// getResource('http://localhost:3000/menu')
// .then(data => {
//     data.forEach(({img, alting, title, descr, price}) => {
//         new MenuCard(img, alting, title, descr, price, '.menu .container').render();
//     });
// });

getResource('http://localhost:3000/menu')
.then(data => createCard(data));

function createCard(data) {
    data.forEach(({img, alting, title, descr, price}) => {
        const element = document.createElement('div');

        element.classList.add('menu__item');

        element.innerHTML = `
            <div class="menu__item">
            <img src=${img} alt=${alting}>
            <h3 class="menu__item-subtitle">${title}</h3>
            <div class="menu__item-descr">${descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${price}</span> грн/день</div>
            </div>
        `;

        document.querySelector('.menu .container').append(element);
    });
}

//MODAL

const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');


    function openModal () {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    };

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    }); 

function closeModal () {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    }


    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });
document.addEventListener('keydown', (e) => {
    if (e.code ==='Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

//MODAL-TIMER
function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
        openModal();
        window.removeEventListener('scroll', showModalByScroll);
    }
}

const modalTimerId = setTimeout(openModal, 5000);

window.addEventListener('scroll', showModalByScroll);

//FORMS

const forms = document.querySelectorAll('form');

const message = {
    loading: 'img/form/spinner.svg',
    success: "ДЯкую скоро все буде",
    failure: "Посипалось"
};

forms.forEach(item => {
    bindPostData(item);
});

const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });

    return await res.json();
};

function bindPostData(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
        `;
        form.insertAdjacentElement('afterend', statusMessage);

        const formData = new FormData(form);

        const json = JSON.stringify(Object.fromEntries(formData.entries()));

        // request.send(formData);

        postData('http://localhost:3000/requests', json)
        .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
        }).catch(() => {
                showThanksModal(message.failure);
        }).finally(() => {
            form.reset();
        })
    });
}


function showThanksModal (message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
        <div class="modal__content"> 
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
    }, 4000);
}

fetch('https://jsonplaceholder.typicode.com/posts', {
    method: "POST",
    body: JSON.stringify({name: "Alex"}),
    headers: {
        'Content-type': 'application/json'
    }
})
    .then(response => response.json())
    // .then(json => console.log(json));

fetch('http://localhost:3000/menu')
    .then(data => data.json())
    .then(res => console.log(res));