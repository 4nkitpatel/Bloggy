const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("when logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  describe("And using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "My Title Test");
      await page.type(".content input", "My content Test");
      await page.click("form button");
    });

    test("submitting then saving adds blogs to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");

      const title = await page.getContentOf(".card-title");
      const content = await page.getContentOf("p");

      expect(title).toEqual("My Title Test");
      expect(content).toEqual("My content Test");
    });
  });
});

describe("When user is not logged in", async () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs",
    },
    {
      method: "post",
      path: "/api/blogs",
      data: {
        title: "T",
        content: "C",
      },
    },
  ];

  test("Blog realted actions are prohibited", async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: "You must log in!" });
    }
  });
});
