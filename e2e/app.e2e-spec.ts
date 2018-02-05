import { Neo2Page } from './app.po';

describe('neo2 App', () => {
  let page: Neo2Page;

  beforeEach(() => {
    page = new Neo2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
