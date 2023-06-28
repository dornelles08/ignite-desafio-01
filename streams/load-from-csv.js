import { parse } from "csv-parse";
import fs from "fs";

const csvPath = new URL("./tasks.csv", import.meta.url);

fs.createReadStream(csvPath)
  .pipe(parse())
  .on("data", async (data) => {
    if (data.includes("title")) {
      return;
    }
    const [title, description] = data;
    console.log({
      title,
      description,
    });

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  });
