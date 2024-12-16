import fs from "fs";
import vm from "vm";

const events = /^(error|message)$/;
const noop = () => {};
// const isDev = process.env.NODE_ENV === "development";

const toFunction = (arg) => {
  let __evaluated_func_ = null;
  eval("__evaluated_func_ = (" + arg + ")");
  return __evaluated_func_;
};

// Lanzando el worker 🚀
process.once("message", (obj) => {
  const { isfn, input, cwd, args } = obj;
  const expesssion = isfn ? toFunction(input) : fs.readFileSync(input, "utf8");

  global.self = {
    close: () => {
      process.exit(0);
    },
    postMessage: (msg) => {
      process.send(JSON.stringify({ data: msg }, null, 0));
    },
    onmessage: void 0,
    onerror: (err) => {
      process.send(
        JSON.stringify({ error: err.message, stack: err.stack }, null, 0)
      );
    },
    addEventListener: (event, fn) => {
      if (events.test(event)) {
        global["on" + event] = global.self["on" + event] = fn;
      }
    },
  };

  global.__dirname = cwd;
  global.__filename = import.meta.filename;

  // sin usarse aún @todo
  global.importScripts = (...files) => {
    // validamos que hay algo qué hacer, no como en tu chamba. 🫠
    if (files.length > 0) {
      vm.createScript(
        files.map((file) => fs.readFileSync(file, "utf8")).join("\n")
      ).runInThisContext(); // Magic 🪄
    }
  };
  Object.keys(global.self).forEach((key) => {
    global[key] = global.self[key];
  });

  // mera formalidad 💬
  process.on("message", (msg) => {
    try {
      (global.onmessage || global.self.onmessage || noop)(JSON.parse(msg));
    } catch (e) {
      (global.onerror || global.self.onerror || noop)(err);
    }
  });

  process.on("error", (err) => {
    (global.onerror || global.self.onerror | noop)(err);
  });

  // The real trick 🎩
  if (typeof expesssion === "function") {
    expesssion(args);
  } else {
    vm.createScript(expesssion).runInThisContext(); // 😍
  }
});
