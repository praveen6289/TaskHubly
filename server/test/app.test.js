import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";

test("GET /api/health should return 200", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "OK");
  assert.equal(response.body.message, "Taskhubly api is running");
});

test("Unknown route should return 404", async () => {
  const response = await request(app).get("/api/unknown");

  assert.equal(response.status, 404);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Route not found");
});

test("Response should include a unique request ID", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.ok(response.headers["x-request-id"]);
  assert.equal(typeof response.headers["x-request-id"], "string");

  const secondResponse = await request(app).get("/api/health");

  assert.notEqual(
    response.headers["x-request-id"],
    secondResponse.headers["x-request-id"],
  );
});

test("Malformed JSON should return 400", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .set("Content-Type", "application/json")
    .send('{"title":');

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
});

test("POST task without title should return 400", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({ completed: false });

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Task title is required");
});

test("Empty and whitespace-only title should return 400", async () => {
  const response = await request(app).post("/api/tasks").send({ title: " " });

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Task title is required");
});

test("Empty and whitespace-only titles should return 400", async () => {
  const invalidTitles = ["", "   ", "\t"];

  for (const title of invalidTitles) {
    const response = await request(app).post("/api/tasks").send({ title });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, "Task title is required");
  }
});

test("Non-string task titles should return 400", async () => {
  const invalidTitles = [123, null, {}, []];

  for (const title of invalidTitles) {
    const response = await request(app).post("/api/tasks").send({ title });

    assert.equal(response.status, 400);
    assert.equal(response.body.status, "error");
    assert.equal(response.body.message, "Task title is required");
  }
});

test("PATCH with empty body should return 400", async () => {
  const response = await request(app).patch("/api/tasks/test-task-id").send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Invalid or missing update fields");
});

test("PATCH with unsupported fields should return 400", async () => {
  const invalidUpdates = [
    { id: "new-id" },
    { createdAt: "2026-01-01" },
    { updatedAt: "2026-01-01" },
    { admin: true },
  ];

  for (const updates of invalidUpdates) {
    const response = await request(app)
      .patch("/api/tasks/test-task-id")
      .send(updates);

    assert.equal(response.status, 400);
    assert.equal(response.body.status, "error");
    assert.equal(response.body.message, "Invalid or missing update fields");
  }
});

test("PATCH with invalid field values should return 400", async () => {
  const invalidUpdates = [
    { title: "" },
    { title: "   " },
    { title: 123 },
    { completed: "true" },
    { completed: 1 },
  ];

  for (const updates of invalidUpdates) {
    const response = await request(app)
      .patch("/api/tasks/test-task-id")
      .send(updates);

    assert.equal(response.status, 400);
    assert.equal(response.body.status, "error");
  }
});

test("PATCH with an empty title should return 400", async () => {
  const response = await request(app)
    .patch("/api/tasks/test-task-id")
    .send({ title: "   " });

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Title must be a non-empty string");
});

test("PATCH with an empty title should return 400", async () => {
  const response = await request(app)
    .patch("/api/tasks/test-task-id")
    .send({ title: "   " });

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Title must be a non-empty string");
});

test("Unsupported HTTP method should return 404", async () => {
  const response = await request(app).put("/api/tasks");

  assert.equal(response.status, 404);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Route not found");
});

test("PATCH with null body should return 400", async () => {
  const response = await request(app)
    .patch("/api/tasks/test-task-id")
    .send(null);

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Invalid request body");
});

test("PATCH with array body should return 400", async () => {
  const response = await request(app)
    .patch("/api/tasks/test-task-id")
    .send(["invalid"]);

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Invalid request body");
});

test("PATCH without request body should return 400", async () => {
  const response = await request(app).patch("/api/tasks/test-task-id");

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Invalid request body");
});

test("PATCH with numeric title should return 400", async () => {
  const response = await request(app)
    .patch("/api/tasks/test-task-id")
    .send({ title: 123 });

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.message, "Title must be a non-empty string");
});

test("PATCH with null title should return 400", async () => {
  const response = await request(app)
    .patch("/api/tasks/test-task-id")
    .send({ title: null });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Title must be a non-empty string");
});

test("PATCH with string completed value should return 400", async () => {
  const response = await request(app)
    .patch("/api/tasks/test-task-id")
    .send({ completed: "true" });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Completed must be a boolean");
});

test("PATCH with null completed value should return 400", async () => {
  const response = await request(app)
    .patch("/api/tasks/test-task-id")
    .send({ completed: null });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Completed must be a boolean");
});

test("PATCH with createdAt field should return 400", async () => {
  const response = await request(app)
    .patch("/api/tasks/test-task-id")
    .send({ createdAt: "2026-01-01" });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid or missing update fields");
});

test("GET unknown route should return 404", async () => {
  const response = await request(app).get("/api/unknown");

  assert.equal(response.status, 404);
  assert.equal(response.body.message, "Route not found");
});

test("POST with empty object should return 400", async () => {
  const response = await request(app).post("/api/tasks").send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Task title is required");
});

test("POST with numeric title should return 400", async () => {
  const response = await request(app).post("/api/tasks").send({ title: 123 });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Task title is required");
});

test("PATCH with object title should return 400", async () => {
  const response = await request(app)
    .patch("/api/tasks/test-task-id")
    .send({ title: { value: "Task" } });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Title must be a non-empty string");
});

test("Response should contain request ID header", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.ok(response.headers["x-request-id"]);
});

test("Separate requests should have unique request IDs", async () => {
  const firstResponse = await request(app).get("/api/health");
  const secondResponse = await request(app).get("/api/health");

  assert.notEqual(
    firstResponse.headers["x-request-id"],
    secondResponse.headers["x-request-id"],
  );
});
