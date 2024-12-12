import { exec } from "child_process";
import path from "path";

const projects = [
  { name: "docs", path: "./docs" },
  { name: "js-demo", path: "./play/js-demo" },
  { name: "react-demo", path: "./play/react-demo" },
  { name: "vue-demo", path: "./play/vue-demo" },
  { name: "deploy", path: "./docs", run: "pnpm run deploy" },
];

const buildProject = (project: (typeof projects)[0]) => {
  return new Promise((resolve, reject) => {
    console.log(`Building ${project.name}...`);
    const projectPath = path.resolve(project.path);

    exec(
      project.run || "pnpm run build",
      { cwd: projectPath },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error building ${project.name}:`, stderr);
          reject(error);
        } else {
          console.log(`Successfully built ${project.name}:\n${stdout}`);
          resolve(null);
        }
      }
    );
  });
};

const buildAllProjects = async () => {
  try {
    for (const project of projects) {
      await buildProject(project);
    }
    console.log("All projects built successfully!");
  } catch (error) {
    console.error("Build process failed:", error);
  }
};

buildAllProjects();
