document.addEventListener('DOMContentLoaded', function () {
  Promise.all([
    fetch('/include/header.html').then((response) => response.text()),
    fetch('/include/footer.html').then((response) => response.text()),
  ])
    .then((data) => {
      document.querySelector('header').innerHTML = data[0];
      document.querySelector('footer').innerHTML = data[1];
    })
    .catch((error) => console.error('Error fetching HTML:', error))
    .finally(() => {
      infiniteCarousel({
        trigger: '.box-carousel',
        duration: 7,
        reverse: true,
        pauseOnHover: false,
      });
      footerUp();
      carouselUp();
      Splitting();
      cursorAnim();
    });
  // --------------------- header --------------------
  //  ---------------------- footer -------------------

  //  --------------------- common --------------------
  Splitting();
  introAnim();
  introTitFadeOut();
  //  --------------------- main ----------------------
  if (document.querySelector('main-page')) {
  }

  // ------------------------- functions -----------------------
  function cursorAnim() {
    let x = 0,
      y = 0,
      currX = 0,
      currY = 0;

    const cursor = document.querySelector('.pointer');

    document.addEventListener(
      'mousemove',
      (event) => {
        let e = event.touches ? event.touches[0] : event;
        x = e.clientX;
        y = e.clientY;

        expandCursor(event);
      },
      { passive: true }
    );

    const mouseMove = () => {
      requestAnimationFrame(() => {
        currX = currX + (x - currX);
        currY = currY + (y - currY);

        if (!cursor.classList.contains('is-nav')) {
          cursor.style.transform = `translate(${currX}px, ${currY}px)`;
        } else {
          cursor.style.transform = `translate(${currX}px, 55px)`;
        }

        mouseMove();
      });
    };

    mouseMove();

    const expandCursor = (event) => {
      const cursorTarget = event.target;

      if (cursorTarget.dataset.expand === '') {
        cursor.classList.add('is-pointer');
      } else {
        cursor.classList.remove('is-pointer');
      }
    };

    const nav = document.querySelector('.header nav');
    const navChilren = nav.querySelectorAll('a');
    navChilren.forEach((ele, idx) => {
      ele.addEventListener(
        'mousemove',
        () => {
          const anchorWidth = parseInt(ele.offsetWidth);
          let anchorLeft;

          if (idx === 0) {
            anchorLeft = 0;
          } else {
            anchorLeft = [...navChilren]
              .splice(0, idx) // -1
              .reduce((prev, current) => {
                const currentWidth = current.offsetWidth;
                return prev + currentWidth;
              }, 0);
          }

          document.documentElement.style.setProperty('--anchorWidth', `${anchorWidth}px`);
          document.documentElement.style.setProperty('--anchorLeft', `${anchorLeft}px`);
          document.documentElement.style.setProperty('--anchorIdx', idx);
        },
        { passive: true }
      );
    });
  }

  function introAnim() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.main-intro',
          // markers: true,
          start: '0%, 100%',
        },
      })
      .add(() => {
        document.querySelector('.blur-it').classList.remove('active');
      }, 2.5);
  }
  function introTitFadeOut() {
    gsap.fromTo(
      '.main-tit',
      {
        opacity: 1,
      },
      {
        scrollTrigger: {
          trigger: '.main-tit',
          start: '0%, 50%',
          end: '+=100%',
          // markers: true,
          scrub: 1,
        },
        opacity: 0,
      }
    );
  }

  function carouselUp() {
    gsap.fromTo(
      '.box-carousel',
      {
        opacity: 0,
        y: 100,
      },
      {
        scrollTrigger: {
          trigger: '.box-carousel',
          start: '0%, 100%',
          end: '0%, bottom',
          // markers: true,
          toggleActions: 'play play play reverse',
        },
        opacity: 1,
        y: 0,
        duration: 2,
      }
    );
  }
  function footerUp() {
    gsap.utils.toArray('.footer-info').forEach((ele) => {
      gsap.fromTo(
        ele.querySelectorAll('.footer-ele'),
        {
          opacity: 0,
          y: 50,
        },
        {
          scrollTrigger: {
            // markers: true,
            trigger: '.footer',
            start: '0%, 80%',
            end: '0%, 0%',
          },
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
        }
      );
    });
  }
  function infiniteCarousel({ trigger, duration, reverse, pauseOnHover }) {
    trigger = document.querySelectorAll(trigger);

    trigger.forEach((trigger) => {
      trigger.style.overflow = 'hidden';
      trigger.style.visibility = 'visible';

      const items = trigger.querySelector('.carousel-items');
      const item = trigger.querySelectorAll('.carousel-item');
      const itemWidthArr = [...item].map((item) => {
        item.style.position = 'absolute';
        return item.clientWidth;
      });
      let totalWidth = 0;

      itemWidthArr.map((width, idx, arr) => {
        if (idx === 0) {
          totalWidth = itemWidthArr[arr.length - 1];
        } else if (arr[idx - 1]) {
          totalWidth = totalWidth + arr[idx - 1];
        }
        gsap.set(item[idx], {
          x: totalWidth,
        });
      });

      items.style.position = 'relative';
      items.style.height = `${item[0].offsetHeight}px`;
      items.style.left = `-${Math.max(...itemWidthArr)}px`;

      const tl = gsap.timeline();
      tl.to(item, duration * item.length, {
        x: () => {
          return reverse ? `-=${totalWidth}` : `+=${totalWidth}`;
        },
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => {
            return reverse ? (x < 0 ? (parseFloat(x) % totalWidth) + totalWidth : x) : parseFloat(x) % totalWidth;
          }),
        },
      });

      if (pauseOnHover) {
        trigger.addEventListener('mouseover', () => {
          tl.pause();
        });

        trigger.addEventListener('mouseleave', () => {
          tl.play();
        });
      }
    });
  }
});
