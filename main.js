const { getSnapLogicResponse } = require("./dataFetcher");
const { responseWriter } = require("./fileWriter");

(async () => {
  const startTime = 1595097000000;
  const endTime = 1595097000000;

  // Default interval set to 1 hour
  const interval = 3600000;

  for (let i = startTime; i < endTime; i = i + interval) {
    const pipelineArray = await getSnapLogicResponse(i, i + interval);
    responseWriter(i, i + interval, pipelineArray);
  }
})();
