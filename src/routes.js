import { randomUUID } from "crypto";

import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return res.writeHead(400).end({
          message: "The field title is required",
        });
      }
      if (!description) {
        return res.writeHead(400).end({
          message: "The field description is required",
        });
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        update_at: new Date(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
            }
          : null
      );

      res.setHeader("count", tasks.length);

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const taskExists = database.getById("tasks", id);
      if (!taskExists) {
        return res.writeHead(404).end();
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title) {
        return res.writeHead(400).end({
          message: "The field title is required",
        });
      }
      if (!description) {
        return res.writeHead(400).end({
          message: "The field description is required",
        });
      }

      const taskExists = database.getById("tasks", id);
      if (!taskExists) {
        return res.writeHead(404).end();
      }

      database.update("tasks", id, {
        title,
        description,
        update_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const taskExists = database.getById("tasks", id);
      if (!taskExists) {
        return res.writeHead(404).end();
      }

      if (taskExists.completed_at) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task already completed" }));
      }

      database.update("tasks", id, {
        completed_at: new Date(),
        update_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
];
