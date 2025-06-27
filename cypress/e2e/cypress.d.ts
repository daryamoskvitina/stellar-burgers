export {}

declare global {
  namespace Cypress {
    interface Chainable {
      checkElementExists(selector: string, text?: string): Chainable<JQuery<HTMLElement>>;
      checkModalVisible(callback: () => Chainable<JQuery<HTMLElement>>): Chainable<JQuery<HTMLElement>>;
      checkModalNotExist(callback: () => Chainable<JQuery<HTMLElement>>): Chainable<JQuery<HTMLElement>>;
      buttonClick(selector: string, text: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
