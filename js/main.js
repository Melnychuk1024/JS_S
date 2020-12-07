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
// SERVER 1
// getResource('http://localhost:3000/menu')
// .then(data => {
//     data.forEach(({img, alting, title, descr, price}) => {
//         new MenuCard(img, alting, title, descr, price, '.menu .container').render();
//     });
// });

axios.get('http://localhost:3000/menu')
    .then(data => {
        data.data.forEach(({img, alting, title, descr, price}) => {
            new MenuCard(img, alting, title, descr, price, '.menu .container').render();
        });
    });

//SERVER 2
// getResource('http://localhost:3000/menu')
// .then(data => createCard(data));

// function createCard(data) {
//     data.forEach(({img, alting, title, descr, price}) => {
//         const element = document.createElement('div');

//         element.classList.add('menu__item');

//         element.innerHTML = `
//             <div class="menu__item">
//             <img src=${img} alt=${alting}>
//             <h3 class="menu__item-subtitle">${title}</h3>
//             <div class="menu__item-descr">${descr}</div>
//             <div class="menu__item-divider"></div>
//             <div class="menu__item-price">
//                 <div class="menu__item-cost">Цена:</div>
//                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
//             </div>
//         `;

//         document.querySelector('.menu .container').append(element);
//     });
// }

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

//SLIDER

const slides = document.querySelectorAll('.offer__slide'),
    slider = document.querySelector('.offer__slider'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    sllidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width;

let slideIndex = 1;
let offset = 0;


if(slides < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
} else {
    total.textContent = slides.length;
    current.textContent = slideIndex;
}

sllidesField.style.width = 100 * slides.length + '%';
sllidesField.style.display = 'flex';
sllidesField.style.transition = '0.5s all'

slidesWrapper.style.overflow = 'hidden';

slides.forEach(slide => {
    slide.style.width = width;
});

slider.style.position = 'relative';
const indicators = document.createElement('ol');
    dots =[];

indicators.classList.add('carousel-indicators');
indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
`;
slider.append(indicators);

for(let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
    `;
    if(i == 0) {
        dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
}

function deleteNotDigits(str) {
    return +str.replace(/\D/g, '');
}

next.addEventListener('click', () => {
    if(offset == deleteNotDigits(width) * (slides.length - 1)) {
        offset = 0;
    } else {
        offset += deleteNotDigits(width);
    }
    sllidesField.style.transform = `translateX(-${offset}px)`;

    if(slideIndex == slides.length) {
        slideIndex = 1;
    }else {
        slideIndex++;
    }

    if(slides.length < 10) {
        current.textContent = `0${slideIndex}`;
    }else {
        current.textContent = slideIndex;
    }
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = 1;
});

prev.addEventListener('click', () => {
    if(offset == 0) {
        offset = deleteNotDigits(width) * (slides.length - 1)
    } else {
        offset -= deleteNotDigits(width);
    }
    sllidesField.style.transform = `translateX(-${offset}px)`;

    if(slideIndex = 1) {
        slideIndex == slides.length;
    }else {
        slideIndex--;
    }

    if(slides.length < 10) {
        current.textContent = `0${slideIndex}`;
    }else {
        current.textContent = slideIndex;
    }
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = 1;
});

dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        const slideTo = e.target.getAttribute('data-slide-to');
        slideIndex = slideTo;
        offset = deleteNotDigits(width) * (slideTo - 1);
        
        sllidesField.style.transform = `translateX(-${offset}px)`;
        
        if(slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        }else {
            current.textContent = slideIndex;
        }
        
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;


    })
});

//SLIDER_1

// if(slides < 10) {
//     total.textContent = `0${slides.length}`
// } else {
//     total.textContent = slides.length;
// }

// showSlides(slideIndex);

// function showSlides(n) {
//     if(n > slides.length) {
//         slideIndex = 1;
//     }

//     if(n < 1) {
//         slideIndex = slides.length;
//     }

//     slides.forEach(item => item.style.display = 'none');
//     slides[slideIndex - 1].style.display = 'block';

//     if(slides < 10) {
//         current.textContent = `0${slideIndex}`
//     } else {
//         current.textContent = slideIndex;
//     }
// } 

// function plussSlides(n) {
//     showSlides(slideIndex += n);
// }

// prev.addEventListener('click', () => {
//     plussSlides(-1);
// });

// next.addEventListener('click', () => {
//     plussSlides(1);
// });