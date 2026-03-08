import { spawn } from "child_process";

export function analyzeComplaint(text) {
  return new Promise((resolve, reject) => {

    console.log("Running Python AI with text:", text);

    const python = spawn("py", ["ai_model.py", text]);

    let output      = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.log("PYTHON DEBUG:", data.toString());
    });

    python.on("close", (code) => {

      if (code !== 0) {
        console.error("Python exited with code:", code);
        return reject(new Error("Python script failed"));
      }

      console.log("PYTHON OUTPUT:", output);

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (err) {
        console.error("JSON PARSE ERROR:", err);
        console.error("RAW OUTPUT WAS:", output);
        reject(err);
      }

    });

  });
}