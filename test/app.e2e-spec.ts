import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import * as argon2 from "argon2";
describe("AppController (e2e)", () => {
  let app: INestApplication;
  let userModel: Model<any>;
  let postModel: Model<any>;

  async function login(): Promise<string> {
    const mutation = `mutation Login($loginInput: LoginInput!) {
      login(loginInput: $loginInput) {
        token
        name
      }
    }`;

    const variables = {
      loginInput: {
        phoneNumber: "+989133036426",
        password: "password",
      },
    };

    const response = await request(app.getHttpServer()).post("/graphql").send({
      query: mutation,
      variables,
    });

    return response.body.data.login.token;
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = app.get<Model<any>>(getModelToken("users"));
    postModel = app.get<Model<any>>(getModelToken("posts"));
    await userModel.deleteMany({});
    await postModel.deleteMany({});

    await userModel.create({
      phoneNumber: "+989133036426",
      name: "john smith",
      password: await argon2.hash("password"),
    });

    await postModel.insertMany([
      {
        title: "Test Post 1",
        description: "Test Description 1",
        category: "Test Category 1",
        price: 100,
        location: "Test Location 1",
        imagesUrl: ["test-image-url-1"],
        authorId: "test-author-id-1",
      },
      {
        title: "Test Post 2",
        description: "Test Description 2",
        category: "Test Category 2",
        price: 200,
        location: "Test Location 2",
        imagesUrl: ["test-image-url-2"],
        authorId: "test-author-id-2",
      },
    ]);
    await app.init();
  });

  afterAll(async () => {
    await userModel.deleteMany({});
    await postModel.deleteMany({});
    await app.close();
  });

  describe("auth", () => {
    it("must signup", async () => {
      const mutation = `mutation Signup($signupInput: SignupInput!) {
        signup(signupInput: $signupInput) {
          token
          name
        }
      }`;
      const variables = {
        signupInput: {
          phoneNumber: "+989133036436",
          name: "john smith",
          password: "password",
        },
      };

      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: mutation,
          variables,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.signup.name).toBe(variables.signupInput.name);
    });

    it("must login", async () => {
      const mutation = `mutation Login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
          token
          name
        }
      }`;

      const variables = {
        loginInput: {
          phoneNumber: "+989133036426",
          password: "password",
        },
      };

      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: mutation,
          variables,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.login.name).toBe("john smith");
    });
  });

  describe("post", () => {
    it("must create post", async () => {
      const token = await login();
      const mutation = `mutation CreatePost($createPostInput: CreatePostInput!) {
        createPost(createPostInput: $createPostInput) {
          title
          description
          price
          location
          imagesUrl
          _id
          authorId
        }
      }`;

      const variables = {
        createPostInput: {
          title: "why",
          description: "why is more important over then how",
          price: 1212311131300,
          location: "kerman",
          imagesUrl: ["google.come/photos", "faceBook.come/photos"],
          category: "m",
        },
      };

      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("Authorization", token)
        .send({
          query: mutation,
          variables,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.createPost.title).toBe(
        variables.createPostInput.title
      );
    });

    it("must search to posts", async () => {
      const mutation = `query SearchByKeyword($keyword: String!) {
        searchByKeyword(keyword: $keyword) {
          _id
          title
          description
          imagesUrl
          category
          authorId
          price
          location
        }
      }`;

      const variables = {
        keyword: "1",
      };

      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: mutation,
          variables,
        });

      console.log(response.body.data);

      expect(response.status).toBe(200);
      expect(response.body.data.searchByKeyword[0].title).toBe("Test Post 1");
    });
  });
});
