## 🪴 Installation

```bash
git clone https://github.com/vianneychin/nodejs-assessment.git vianneychin-nodejs-assessment
cd vianneychin-nodejs-assessment
npm i && npm run start
chmod +x .husky/pre-commit # optional
```

---

## 🧪 Testing
```bash
npm run test
```

---

## 📓 Notes

- The focus of the assessment was to improve scalability as well as the developer experience for implementing future Models and Controllers for routes. This was done by removing obvious code smells and lack of using traditional design patterns most importantly, **MVC** (Model View Controller).

- The routes were refactored into `src/api/controllers/UserController.ts`. This was a bit opinionated, but I also added the routes to the controller so it was a bit more modularized. I could have added them to their own `Router`, but any feedback there would be greatly appreciated.

- To handle the fake database, I built a separate class utilizing the Builder design pattern. This makes future "queries" very easy to build and easy to grab the values at the speed of thought. You can find the Model builder in `src/services/UserCollectionBuilder.ts`.

- Testing was focused on the most important part of the application which were the non-negotiables, the API routes. To test, I make a copy of the fake database to make sure the original is pristine. You can find the tests in `src/api/controllers/__tests__/UserController.test.ts`.

- Other notable features added that were sort of non-negotiables to me was, pagination, middlewares for validation, prettier, eslint, and self-documenting code.

- Original: [https://github.com/dynogg/nodejs-assessment](https://github.com/dynogg/nodejs-assessment)
