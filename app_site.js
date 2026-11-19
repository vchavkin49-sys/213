import http from 'k6/http';
import { check, sleep } from 'k6';
import { parseHTML } from 'k6/html';

// ⚠️ ВАЖНО: Сюда потом вставишь ссылку на свой GitHub Pages!
// Пока для локального теста оставь localhost (если запустишь сервер) 
// или временно поставь ссылку на любой живой сайт, чтобы проверить работу.
const URL = 'https://vchavkin49-sys.github.io/213/index.html'; 

export const options = {
  vus: 5,            // 5 виртуальных пользователей
  duration: '5s',    // 5 секунд
  thresholds: {
    checks: ['rate>0.99'], // 99% проверок должны быть успешны
  },
};

export default function () {
  const res = http.get(URL);
  const doc = parseHTML(res.body);

  check(res, {
    // 1. Статус
    '1. Статус 200 OK': (r) => r.status === 200,
    
    // 2. Тип контента
    '2. Content-Type: text/html': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('text/html'),

    // 3. Скорость
    '3. Быстрее 500 мс': (r) => r.timings.duration < 500,

    // 4. Заголовок h1
    '4. Заголовок h1 — EduPortal': () => doc.find('h1').text().includes('EduPortal'),

    // 5. Title
    '5. В title есть 2024': () => doc.find('title').text().includes('2024'),

    // 6. Количество карточек (их 3)
    '6. Ровно 3 карточки курсов': () => doc.find('.course-card').size() === 3,

    // 7. Статус сервера
    '7. Статус сервера ONLINE': () => doc.find('#server-status').text().includes('ONLINE'),

    // 8. Проверка цены (математика)
    '8. Цена Python равна 3000': () => parseInt(doc.find('#price-prog').text(), 10) === 3000,

    // 9. Проверка инпута
    '9. Поле email имеет type="email"': () => doc.find('#user-email').attr('type') === 'email',

    // 10. Проверка подвала (footer)
    '10. Год в подвале — 2024': () => doc.find('#footer-year').text().trim() === '2024',
  });

  sleep(1);
}
