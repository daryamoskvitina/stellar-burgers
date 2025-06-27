import * as order from '../fixtures/order.json';

describe('Конструктор бургеров', () => {
  const baseUrl = 'http://localhost:4000';
  const getModal = () => cy.get('[data-cy="modal"]');

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(baseUrl);
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('user');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('order');

    cy.setCookie('accessToken', 'example');
    window.localStorage.setItem('refreshToken', 'example');
    cy.visit(baseUrl);

    cy.get('[data-ingredient="bun"]').as('bunIngredient');
    cy.get('[data-ingredient="sauce"]').as('sauceIngredient');
    cy.get('[data-ingredient="main"]').as('mainIngredient');
    cy.get('[data-cy="constructor-topping"]').as('topping');
  });

  it('Страница должна быть доступна', () => {
    cy.visit(baseUrl);
  });

  it('Основные компоненты интерфейса должны отображаться', () => {
    cy.checkElementExists('[data-cy="app-header"]');
    cy.checkElementExists('[data-cy="burger-constructor"]');
    cy.checkElementExists('[data-cy="burger-ingredients"]');
  });

  it('Ингредиенты должны загружаться из API', () => {
    cy.get('@bunIngredient').should('have.length.at.least', 1);
    cy.get('@sauceIngredient').should('have.length.at.least', 1);
    cy.get('@mainIngredient').should('have.length.at.least', 1);
  });

  describe('Работа модальных окон', () => {
    const cardItem = () => cy.get('[data-ingid="643d69a5c3f7b9001cfa093c"]');

    it('Должно открываться и закрываться модальное окно с деталями ингредиента', () => {
      cardItem().click();
      cy.checkModalVisible(getModal);
      getModal().contains('Краторная булка N-200i');
      cy.get('[data-cy="modal-close"]').click();
      cy.checkModalNotExist(getModal);
    });

    it('Должно закрываться модальное окно при клике на оверлей', () => {
      cardItem().click();
      cy.checkModalVisible(getModal);
      cy.get('[data-cy="modal-overlay"]').click(0, 0, { force: true });
      cy.checkModalNotExist(getModal);
    });

    it('Должно закрываться модальное окно по нажатию ESC', () => {
      cardItem().click();
      cy.checkModalVisible(getModal);
      cy.get('body').type('{esc}');
      cy.checkModalNotExist(getModal);
    });
  });

  describe('Работа конструктора', () => {
    it('Должна корректно отображаться начальная сумма заказа', () => {
      cy.checkElementExists('[data-cy="total-price"]', '0');
    });

    it('Должна добавляться булка в конструктор', () => {
      cy.buttonClick('@bunIngredient', 'Добавить');
      cy.checkElementExists('[data-cy="bun-top"]', 'Краторная булка N-200i');
      cy.checkElementExists('[data-cy="bun-bottom"]', 'Краторная булка N-200i');
    });

    it('Должен добавляться соус в конструктор', () => {
      cy.buttonClick('@sauceIngredient', 'Добавить');
      cy.checkElementExists('@topping', 'Соус Spicy-X');
    });

    it('Должна добавляться начинка в конструктор', () => {
      cy.buttonClick('@mainIngredient', 'Добавить');
      cy.checkElementExists('@topping', 'Биокотлета из марсианской Магнолии');
    });

    it('Должна корректно рассчитываться сумма заказа', () => {
      cy.buttonClick('@bunIngredient', 'Добавить');
      cy.buttonClick('@sauceIngredient', 'Добавить');
      cy.buttonClick('@mainIngredient', 'Добавить');
      cy.checkElementExists('[data-cy="total-price"]', order.order.price.toString());
    });

    it('Должно работать перемещение ингредиентов в конструкторе', () => {
      cy.buttonClick('@sauceIngredient', 'Добавить');
      cy.buttonClick('@mainIngredient', 'Добавить');

      // Проверяем начальный порядок
      cy.get('@topping')
        .find('li')
        .first()
        .contains('Соус Spicy-X');
      cy.get('@topping')
        .find('li')
        .last()
        .contains('Биокотлета из марсианской Магнолии');

      // Перемещаем первый ингредиент (соус) вниз
      cy.get('[data-cy="constructor-li"]')
        .find('button')
        .filter(':not(:disabled)')
        .first()
        .click();
      
      // Проверяем новый порядок
      cy.get('@topping')
        .find('li')
        .last()
        .contains('Соус Spicy-X');

      // Перемещаем последний ингредиент (соус) вверх
      cy.get('[data-cy="constructor-li"]')
        .find('button')
        .filter(':not(:disabled)')
        .last()
        .click();
      
      // Проверяем восстановленный порядок
      cy.get('@topping')
        .find('li')
        .last()
        .contains('Биокотлета из марсианской Магнолии');
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      cy.buttonClick('@bunIngredient', 'Добавить');
      cy.buttonClick('@sauceIngredient', 'Добавить');
      cy.buttonClick('@mainIngredient', 'Добавить');
      cy.buttonClick('[data-cy="total-price"]>div', 'Оформить заказ');
    });

    it('Должно открываться модальное окно с номером заказа', () => {
      cy.checkModalVisible(getModal);
      getModal().contains(order.order.number);
    });

    it('Должен очищаться конструктор после закрытия модального окна', () => {
      cy.get('[data-cy="modal-close"]').click();
      cy.checkModalNotExist(getModal);
      cy.get('[data-cy="bun-top"]').should('not.exist');
      cy.get('[data-cy="bun-bottom"]').should('not.exist');
      cy.get('@topping').find('li').should('not.exist');
    });
  });
});

describe('Авторизация пользователя', () => {
  const baseUrl = 'http://localhost:4000';

  before(() => {
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
    cy.visit(baseUrl);
    cy.intercept('POST', '/api/auth/login', { fixture: 'user.json' }).as('login');
  });

  it('Должна происходить переадресация на страницу логина и успешная авторизация', () => {
    cy.get('[data-cy="profile-link"]').click();
    cy.url().should('include', '/login');

    cy.get('[type="email"]')
      .type('test-profile@yandex.ru')
      .should('have.value', 'test-profile@yandex.ru');
    cy.get('[type="password"]')
      .type('password123')
      .should('have.value', 'password123');
    cy.get('[type="submit"]').contains('Войти').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.setCookie('accessToken', 'token test accessToken');
    window.localStorage.setItem('refreshToken', 'refresh token');
  });
});
