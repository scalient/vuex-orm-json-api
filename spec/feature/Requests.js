import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {describe, it, beforeEach, afterEach, expect} from "@jest/globals";
import {createStore} from "spec/support/spec_helper";
import ModelFactory from "../models/ModelFactory";
import Utils from "../../src/Utils";

describe("Feature - Requests", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  // This isn't actually testing vuex-orm-json-api, but it's demonstrating how validation errors might be handled.
  it("throws an Axios request error with JSON:API error objects", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
    const {users: User} = store.$db().models();

    const payload = {
      user: {}
    };

    const response = {
      errors: [
        {id: 1, detail: "Validation failed: Name can't be blank"}
      ]
    };

    mock.onPost("/api/users", payload).reply(422, response);

    await expect(User.jsonApi().create(payload)).rejects.toThrow(new Error("Request failed with status code 422"));

    try {
      await User.jsonApi().create(payload);
    } catch (axiosError) {
      expect(axiosError.response.status).toBe(422);
      expect(axiosError.response.data).toEqual(response);
    }
  });

  it("throws a `JsonApiError` when a model can't be found", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
    const {users: User} = store.$db().models();

    const payload = {
      user: {}
    };

    mock.onGet("/api/users").reply(200, {
      data: {
        id: 1,
        type: "things"
      }
    });

    await expect(User.jsonApi().index()).rejects.toThrow(
      Utils.error("Couldn't find the model for entity type `things`")
    );
  });
});
