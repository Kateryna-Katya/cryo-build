
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Скрипт для мобильного меню (Header)
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.nav__link');

  const toggleMenu = () => {
      headerNav.classList.toggle('is-open');
      // Обновление иконки
      const iconElement = menuToggle.querySelector('svg');
      if (headerNav.classList.contains('is-open')) {
          iconElement.setAttribute('data-lucide', 'x');
      } else {
          iconElement.setAttribute('data-lucide', 'menu');
      }
      // Переинициализация иконок после смены data-lucide
      lucide.createIcons();
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Закрытие меню при клике на якорную ссылку (только для мобильной версии)
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (window.innerWidth < 992) {
              // Добавляем небольшую задержку для плавности скролла
              setTimeout(() => {
                  if (headerNav.classList.contains('is-open')) {
                      toggleMenu();
                  }
              }, 200);
          }
      });
  });

  // ==========================================================================
  // 2. Скрипт для Dropdown Menu (Правила)
  // ==========================================================================
  const dropdownToggle = document.querySelector('.nav__dropdown-toggle');
  const dropdownMenu = document.querySelector('.nav__dropdown-menu');

  if (dropdownToggle) {
      dropdownToggle.addEventListener('click', () => {
          const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
          const targetMaxHeight = dropdownMenu.scrollHeight + 10; // +10px запаса

          if (isExpanded) {
              // Закрываем
              dropdownMenu.style.maxHeight = null;
              dropdownToggle.setAttribute('aria-expanded', 'false');
          } else {
              // Открываем
              dropdownMenu.style.maxHeight = targetMaxHeight + 'px';
              dropdownToggle.setAttribute('aria-expanded', 'true');
          }
      });

      // Закрытие меню при клике вне его (только на десктопе)
      document.addEventListener('click', (event) => {
           const dropdown = dropdownToggle.closest('.nav__item--dropdown');
           if (!dropdown.contains(event.target) && window.innerWidth >= 992) {
              dropdownMenu.style.maxHeight = null;
              dropdownToggle.setAttribute('aria-expanded', 'false');
           }
      });
  }


  // ==========================================================================
  // 3. Скрипт для Cookie Pop-up (Этап 5)
  // ==========================================================================
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptCookiesButton = document.getElementById('acceptCookies');
  const cookieAccepted = localStorage.getItem('cryobuild_cookies_accepted');

  // Функция показа/скрытия
  const showCookiePopup = () => {
      if (!cookieAccepted) {
          cookiePopup.classList.remove('is-hidden');
      }
  }

  const hideCookiePopup = () => {
      cookiePopup.classList.add('is-hidden');
      localStorage.setItem('cryobuild_cookies_accepted', 'true');
  }

  // Показываем, если не было принято
  showCookiePopup();

  // Обработчик кнопки "Принять"
  acceptCookiesButton.addEventListener('click', hideCookiePopup);
});

// ==========================================================================
    // 4. JS Логика Mouse Spotlight (Подсветка курсора)
    // ==========================================================================
    const spotlight = document.getElementById('mouse-spotlight');

    if (spotlight && window.innerWidth > 768) { // Включаем только на десктопе
        document.addEventListener('mousemove', (e) => {
            // Обновляем положение пятна на основе позиции курсора
            // Используем requestAnimationFrame для более плавной анимации
            requestAnimationFrame(() => {
                spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            });
        });
    }
    // ==========================================================================
    // Конец Mouse Spotlight
    // ==========================================================================

// ==========================================================================
    // 4. Three.js Анимация для Hero-секции (Этап 3)
    // ==========================================================================
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        // Подключение Three.js (если не подключен глобально)
        // Мы предполагаем, что Three.js будет подключен через CDN в HTML
        // <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true }); // alpha: true для прозрачности

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Массив для хранения частиц
        const particles = [];
        const numParticles = 200; // Количество частиц

        // Цвета частиц
        const particleColor1 = new THREE.Color(0x00BCD4); // var(--color-primary)
        const particleColor2 = new THREE.Color(0xFF9800); // var(--color-secondary)

        for (let i = 0; i < numParticles; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8); // Маленькие сферы
            const material = new THREE.MeshBasicMaterial({
                color: (i % 2 === 0) ? particleColor1 : particleColor2, // Чередование цветов
                transparent: true,
                opacity: 0.6 + Math.random() * 0.4 // Разная прозрачность
            });
            const particle = new THREE.Mesh(geometry, material);

            // Случайное позиционирование
            particle.position.x = (Math.random() - 0.5) * 20;
            particle.position.y = (Math.random() - 0.5) * 20;
            particle.position.z = (Math.random() - 0.5) * 20;

            // Дополнительные свойства для анимации
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005
            );
            particles.push(particle);
            scene.add(particle);
        }

        camera.position.z = 5;

        // Анимация частиц
        const animate = () => {
            requestAnimationFrame(animate);

            particles.forEach(particle => {
                particle.position.add(particle.velocity);

                // Если частица уходит за границы, перемещаем ее обратно
                if (Math.abs(particle.position.x) > 10) particle.position.x *= -1;
                if (Math.abs(particle.position.y) > 10) particle.position.y *= -1;
                if (Math.abs(particle.position.z) > 10) particle.position.z *= -1;

                // Небольшое вращение
                particle.rotation.x += 0.01;
                particle.rotation.y += 0.01;
            });

            renderer.render(scene, camera);
        };
        animate();

        // Реакция на изменение размера окна
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Реакция на движение мыши (небольшое вращение сцены)
        document.addEventListener('mousemove', (event) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            scene.rotation.y = mouseX * 0.1;
            scene.rotation.x = mouseY * 0.1;
        });
    }

    // ==========================================================================
    // 5. JS Анимация Секции "О нас" (Выезд контента)
    // ==========================================================================
    const animatedElements = document.querySelectorAll('.content-animate');

    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% элемента должно быть видно
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Остановить наблюдение после появления
                }
            });
        };

        const contentObserver = new IntersectionObserver(observerCallback, observerOptions);

        animatedElements.forEach(el => {
            contentObserver.observe(el);
        });
    }
    // ==========================================================================
    // Конец JS Анимации Секции "О нас"
    // ==========================================================================

    // ==========================================================================
    // 6. Скрипт для Слайдера Отзывов (Этап 3.6)
    // ==========================================================================
    const testimonialTrack = document.getElementById('testimonialTrack');
    const prevButton = document.getElementById('prevTestimonial');
    const nextButton = document.getElementById('nextTestimonial');
    const testimonialDots = document.getElementById('testimonialDots');

    if (testimonialTrack) {
        const testimonialCards = Array.from(testimonialTrack.children);
        let currentIndex = 0;
        const totalCards = testimonialCards.length;

        // Генерация точек
        const createDots = () => {
            testimonialDots.innerHTML = '';
            testimonialCards.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('testimonial-slider__dot');
                if (index === currentIndex) {
                    dot.classList.add('is-active');
                }
                dot.addEventListener('click', () => moveToSlide(index));
                testimonialDots.appendChild(dot);
            });
        };

        // Обновление слайда
        const moveToSlide = (index) => {
            if (index < 0) {
                index = totalCards - 1; // Зацикливание назад
            } else if (index >= totalCards) {
                index = 0; // Зацикливание вперед
            }
            currentIndex = index;
            const offset = -currentIndex * 100; // Процент смещения
            testimonialTrack.style.transform = `translateX(${offset}%)`;

            // Обновление активного класса для карточек и точек
            testimonialCards.forEach((card, i) => {
                if (i === currentIndex) {
                    card.classList.add('is-active');
                } else {
                    card.classList.remove('is-active');
                }
            });
            createDots(); // Перерисовываем точки
        };

        // Переключение вперед/назад
        prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));
        nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));

        // Инициализация
        createDots();
        moveToSlide(0); // Показываем первый слайд

        // Автоматическая смена слайдов (опционально)
        // setInterval(() => moveToSlide(currentIndex + 1), 7000);
    }
    // ==========================================================================
    // Конец Скрипта для Слайдера Отзывов
    // ==========================================================================
    // ==========================================================================
    // 7. JS Логика Формы Контактов и CAPTCHA (Этап 4)
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const captchaDisplay = document.getElementById('captchaDisplay');
    const captchaInput = document.getElementById('captchaInput');
    const captchaMessage = document.getElementById('captchaMessage');
    const submissionMessage = document.getElementById('submissionMessage');
    const policyAccept = document.getElementById('policyAccept');

    let correctAnswer = 0;

    /**
     * Генерирует простой математический пример (CAPTCHA).
     */
    function generateCaptcha() {
        const operator = Math.random() < 0.5 ? '+' : '-';
        let num1 = Math.floor(Math.random() * 15) + 5;
        let num2 = Math.floor(Math.random() * 10) + 1;

        if (operator === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }

        correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
        captchaDisplay.textContent = `${num1} ${operator} ${num2} = ?`;
        captchaMessage.textContent = '';
        captchaInput.value = '';
    }

    /**
     * Валидирует ответ CAPTCHA.
     * @returns {boolean} True, если ответ верный.
     */
    function validateCaptcha() {
        if (!captchaInput.value.trim()) {
            captchaMessage.textContent = 'Пожалуйста, решите пример.';
            captchaMessage.style.color = '#FF4545';
            return false;
        }

        const userAnswer = parseInt(captchaInput.value.trim());
        if (userAnswer === correctAnswer) {
            captchaMessage.textContent = 'Капча успешно пройдена!';
            captchaMessage.style.color = 'var(--color-primary)';
            return true;
        } else {
            captchaMessage.textContent = 'Неверный ответ. Попробуйте еще раз.';
            captchaMessage.style.color = '#FF4545';
            generateCaptcha();
            return false;
        }
    }

    // Инициализация CAPTCHA при загрузке страницы
    generateCaptcha();

    // Обработчик отправки формы
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submissionMessage.style.display = 'none';

        const isCaptchaValid = validateCaptcha();
        const isPolicyAccepted = policyAccept.checked;

        if (isCaptchaValid && isPolicyAccepted) {

            // Имитация успешной отправки данных
            console.log('Form Submitted and Validated:', {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
                policy: isPolicyAccepted
            });

            // Показываем сообщение об успехе ТОЛЬКО после успешной валидации
            submissionMessage.style.display = 'block';

            // Сброс формы и генерация новой капчи
            contactForm.reset();
            generateCaptcha();

            // Автоматически скрываем сообщение через 5 секунд
            setTimeout(() => {
                submissionMessage.style.display = 'none';
            }, 5000);

        } else if (!isPolicyAccepted) {
            alert('Пожалуйста, примите условия использования и политику конфиденциальности.');
            policyAccept.focus();
        }
    });

    // ==========================================================================
    // Конец JS Логики Формы Контактов
    // ==========================================================================