import { readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import picocolors from "picocolors";

async function tree(path = ".", indentation = "-") {
  try {
    //get all the elements of the path
    const elements = await readdir(path);
    for (const element of elements) {
      //create the path of each element
      const elementPath = join(path, element);
      const elementStat = await stat(elementPath);

      //create a custom ls command info message
      const infoMssg = createInfoMssg({
        element,
        stats: elementStat,
      });

      //recursive function
      if (elementStat.isDirectory()) {
        console.log(indentation + infoMssg);
        await tree(elementPath, (indentation += "-"));
      } else {
        console.log(indentation + infoMssg);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function createInfoMssg({ element, stats }) {
  const elementSymbol = stats.isDirectory() ? "D : " : "F : ";
  const lastTimeModified = stats.mtime.toLocaleString();
  const size = stats.size;
  let infoMssg =
    (elementSymbol === "D : "
      ? picocolors.yellow(elementSymbol)
      : picocolors.magenta(elementSymbol)) + " ";
  infoMssg += picocolors.red(element).padEnd(20) + " ";
  infoMssg += picocolors.green(size).padEnd(10) + " ";
  infoMssg +=
    "Última modificación : ".padStart(30) + picocolors.cyan(lastTimeModified);
  return infoMssg;
}

tree(process.argv[2]);
