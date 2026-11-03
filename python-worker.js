const pyodideUrl = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";
let pyodideScriptLoaded = false;
let pyodidePromise;

self.onmessage = async event => {
  const { id, code } = event.data;
  try {
    self.postMessage({ id, status: "loading" });
    if (!pyodideScriptLoaded) {
      importScripts(`${pyodideUrl}pyodide.js`);
      pyodideScriptLoaded = true;
    }
    if (!pyodidePromise) {
      pyodidePromise = loadPyodide({ indexURL: pyodideUrl });
    }
    const pyodide = await pyodidePromise;
    let output = "";
    pyodide.setStdout({
      batched: text => {
        output += `${text}\n`;
      }
    });
    self.postMessage({ id, status: "ready" });
    await pyodide.runPythonAsync(code);
    self.postMessage({ id, output: output.trimEnd(), ok: true });
  } catch (error) {
    pyodidePromise = undefined;
    const details = String(error.message || error).trim();
    const concise = details.match(/([\w]+(?:Error|Exception):[^\r\n]*)/);
    const lines = details.split(/\r?\n/);
    self.postMessage({ id, error: concise?.[1] || lines.slice(-4).join("\n"), ok: false });
  }
};
