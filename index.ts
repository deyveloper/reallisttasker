import TaskService from "./src";

const tasks = new TaskService();

(async () => {
    await tasks.startup();
})();