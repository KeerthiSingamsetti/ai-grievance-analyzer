import { exec } from "child_process";

export function analyzeComplaint(text) {

  return new Promise((resolve, reject) => {

    console.log("Running Python AI with text:", text);

    exec(`py ai_model.py "${text}"`, (error, stdout, stderr) => {

      if (stderr) {
        console.log("PYTHON STDERR:", stderr);
      }

      if (error) {
        console.error("EXEC ERROR:", error);
        return reject(error);
      }

      console.log("PYTHON OUTPUT:", stdout);

      try {

        const result = JSON.parse(stdout);
        resolve(result);

      } catch (err) {

        console.error("JSON PARSE ERROR:", err);
        reject(err);

      }

    });

  });

}