const fs = require("fs");
const { formatDate } = require("./utils");

const responseWriter = (startTime, endTime, pipelineArray) => {
  const start = {
    date: formatDate(new Date(startTime).toDateString()),
    time: new Date(startTime).toTimeString().split(" ")[0],
  };

  const end = {
    date: formatDate(new Date(endTime).toDateString()),
    time: new Date(endTime).toTimeString().split(" ")[0],
  };

  let filename = "pipelineDetails.txt";

  if (start.date === end.date) {
    filename = `${start.date}-${start.time}-to-${end.time}.txt`;
  } else {
    filename = `${start.date}-${start.time}-to-${end.date}-${end.time}.txt`;
  }

  let writeStream = fs.createWriteStream(filename);

  writeStream.write(`${start.date} ${start.time} to ${end.date} ${end.time}\n`);

  writeStream.write(`------------------------------\n`);
  writeStream.write(`Total Runs: ${pipelineArray.length}\n`);

  writeStream.write(
    `Interface Runs: ${pipelineArray.filter((p) => p.parent_ruuid === null).length}\n`,
  );
  writeStream.write(
    `Pipeline Runs: ${pipelineArray.filter((p) => p.parent_ruuid !== null).length}\n`,
  );

  writeStream.write(`------------------------------\n`);

  const interfaceMap = new Map();
  const childPipelineMap = new Map();

  pipelineArray.forEach((p) => {
    if (p.parent_ruuid === null) {
      if (interfaceMap.has(p.label)) {
        const value = interfaceMap.get(p.label);
        interfaceMap.set(p.label, value + 1);
      } else {
        interfaceMap.set(p.label, 1);
      }
    } else {
      if (childPipelineMap.has(p.label)) {
        const value = childPipelineMap.get(p.label);
        childPipelineMap.set(p.label, value + 1);
      } else {
        childPipelineMap.set(p.label, 1);
      }
    }
  });

  writeStream.write("Interface Details\n\n");
  interfaceMap.forEach((key, value) => {
    writeStream.write(`${value} : ${key}\n`);
  });

  writeStream.write(`------------------------------\n`);

  writeStream.write("Child Pipeline Details\n\n");
  childPipelineMap.forEach((key, value) => {
    writeStream.write(`${value}: ${key}\n`);
  });

  writeStream.on("finish", () => {
    console.log("Wrote all data to file");
  });

  writeStream.end();
};

module.exports = { responseWriter };
