import { cpus, totalmem, freemem } from "os";
import { exec } from "child_process";

export function shutdown() {
  exec("sudo shutdown -h now");
}

export function reboot() {
  exec("sudo reboot");
}

export function status() {
  const output = { cpus: cpus(), totalmem: totalmem(), freemem: freemem() };
  return JSON.stringify(output);
}
