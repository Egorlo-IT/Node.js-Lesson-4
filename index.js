"use strict";

/*
Практическое задание
Примените полученные знания к программе, которую вы написали на прошлом уроке.
Для этого превратите её в консольное приложение, по аналогии с разобранным примером, и добавьте следующие функции:
1. Возможность передавать путь к директории в программу. Это актуально, когда вы не хотите покидать текущую директорию, но надо просмотреть файл, находящийся в другом месте.
2. В директории переходить во вложенные каталоги.
3. Во время чтения файлов искать в них заданную строку или паттерн.
*/

import {
  lstatSync,
  readdirSync,
  existsSync,
  truncate,
  createReadStream,
  writeFile,
} from "fs";
import inquirer from "inquirer";
import { createInterface } from "readline";
import pkgColors from "colors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { blue } = pkgColors;

const reIp1 = /89.123.1.41/;
const reIp2 = /34.48.240.111/;

const isFile = (fileName) => {
  return lstatSync(fileName).isFile();
};
const list = readdirSync(__dirname).filter(isFile);

const readingAndWritingToFiles = () => {
  if (existsSync("./%89.123.1.41%_requests.log")) {
    truncate("./%89.123.1.41%_requests.log", (err) => {
      if (err) throw err;
    });
  }

  if (existsSync("./%34.48.240.111%_requests.log")) {
    truncate("./%34.48.240.111%_requests.log", (err) => {
      if (err) throw err;
    });
  }

  inquirer
    .prompt([
      {
        name: "fileName",
        type: "list",
        message: "Choose file:",
        choices: list,
      },
    ])
    .then((answer) => {
      const filePath = join(__dirname, answer.fileName);
      const readStream = createReadStream(filePath, "utf-8");
      const rl = createInterface({ input: readStream });
      rl.on("line", (line) => {
        if (line.match(reIp1)) {
          writeFile(
            "./%89.123.1.41%_requests.log",
            line + "\n",
            { flag: "a" },
            function (err) {
              if (err) {
                return console.log(err);
              }
            }
          );
        } else if (line.match(reIp2)) {
          writeFile(
            "./%34.48.240.111%_requests.log",
            line + "\n",
            { flag: "a" },
            function (err) {
              if (err) {
                return console.log(err);
              }
            }
          );
        }
      });

      rl.on("error", (error) => console.log(error.message));
      rl.on("close", () => {
        console.log(blue("Files read/write operation completed successfully"));
      });
    });
};

readingAndWritingToFiles();
