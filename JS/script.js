// src/js/main.js
import AOS from 'aos';
import 'aos/dist/aos.css';

// Init AOS animation
AOS.init({
    duration: 1000,
    offset: 100,
});


// helper to build menu cards
function createMenuCard(item) {
  const art = document.createElement('article');
  art.className = 'matcha-menu__card' + (item.active ? ' active-card':'');
  art.innerHTML = `
    <img class="matcha-menu__card-image" src="${item.img}" alt="${item.title}"/>
    <h4 class="matcha-menu__card-title">${item.title}</h4>
    <p class="matcha-menu__card-desc">${item.desc || ''}</p>
    <div class="matcha-menu__card-details flex-between">
      <div class="matcha-menu__card-rating">
        <img src="/assets/icons/star.svg" alt="star" />
        <p>${item.rating}</p>
      </div>
      <p class="matcha-menu__card-price">₹${item.price}</p>
    </div>
  `;
  return art;
}

async function loadMenu() {
  try {
    const res = await fetch('/api/menu');
    const data = await res.json();
    const container = document.querySelector('.matcha-menu__catalogue');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(item => container.appendChild(createMenuCard(item)));
  } catch (e) {
    console.error('Menu load error', e);
  }
}

// subscribe form handler (if your markup uses a form tag)
function initSubscribe() {
  const form = document.querySelector('.subscription__form');
  if (!form) return;
  // if it's not a <form>, handle button click:
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const email = (input && input.value) || '';
    if (!email) return alert('Please enter your email');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email })
      });
      const json = await res.json();
      if (json.success) {
        input.value = '';
        alert('Thanks! Check your inbox for matcha goodness ☕️');
      } else {
        alert('Could not subscribe — try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadMenu();
  initSubscribe();

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target){
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });
});
