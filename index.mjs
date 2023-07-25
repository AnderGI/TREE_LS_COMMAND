import { readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import picocolors from "picocolors";

async function tree(path = ".", indentation = "-") {
  try {
    const elements = await readdir(path);
    for (const element of elements) {
      const elementPath = join(path, element); // Create the absolute path
      const elementStat = await stat(elementPath);
      const elementSymbol = elementStat.isDirectory() ? "D : " : "F : ";
      const lastTimeModified = elementStat.mtime.toLocaleString();
      const size = elementStat.size;
      let infoMssg =
        (elementSymbol === "D : "
          ? picocolors.yellow(elementSymbol)
          : picocolors.magenta(elementSymbol)) + " ";
      infoMssg += picocolors.red(element).padEnd(20) + " ";
      infoMssg += picocolors.green(size).padEnd(10) + " ";
      infoMssg +=
        "Última modificación : ".padStart(30) +
        picocolors.cyan(lastTimeModified);

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

tree();
