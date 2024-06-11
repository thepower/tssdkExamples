import * as fs from "fs";
import { exec } from "child_process";
import readline from "readline";
import chalk from "chalk";

const srcFolderPath = "./src"; // Path to the folder with your scripts

// Function to get the list of scripts in the src folder
async function listScripts(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(srcFolderPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(
        files.filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
      ); // Filter only scripts
    });
  });
}

// Function to select and run a script
async function selectAndRunScript() {
  try {
    const files = await listScripts();
    console.log(chalk.yellow("Available scripts:"));
    files.forEach((file, index) => {
      console.log(chalk.cyan(`${index + 1}. ${file}`));
    });
    const selectedScriptIndex = await getUserInput(
      chalk.green("Enter the script number to run: ")
    );
    const selectedScript = files[selectedScriptIndex - 1];
    if (!selectedScript) {
      console.log(chalk.red("Invalid script selection."));
      return;
    }
    runScript(selectedScript);
  } catch (err) {
    console.error(chalk.red("Error:", err));
  }
}

// Function to run the selected script
function runScript(scriptName: string) {
  const scriptPath = `${srcFolderPath}/${scriptName}`;
  exec(`tsx ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red(`Script execution error: ${error}`));
      return;
    }
    console.log(chalk.green(`Result of script ${scriptName}:`));
    console.log(stdout);
    if (stderr) {
      console.error(chalk.red(`stderr error: ${stderr}`));
    }
  });
}

// Function to get user input
function getUserInput(question: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(parseInt(answer));
    });
  });
}

// Start the program
selectAndRunScript();
