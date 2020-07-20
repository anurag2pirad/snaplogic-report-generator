require("dotenv").config();
const axios = require("axios");

const url = `${process.env.URL}/${process.env.ORG}`;
const slUser = process.env.SL_USER;
const slPass = process.env.SL_PASS;

const getSingleSnapLogicResponse = async (start, end, offset = 0, limit = 1000) => {
  try {
    const { data } = await axios.get(url, {
      auth: {
        username: slUser,
        password: slPass,
      },
      params: { start, end, limit, offset },
    });
    return data.response_map;
  } catch (error) {
    console.error("Error while getting response from SnapLogic:", error);
  }
};

const getSnapLogicResponse = async (start, end) => {
  const responseArray = [];
  try {
    const { entries: firstEntries, total, limit } = await getSingleSnapLogicResponse(start, end);
    responseArray.push(...firstEntries);
    if (total > limit) {
      for (let i = limit; i < total; i += limit) {
        const { entries } = await getSingleSnapLogicResponse(start, end, i);
        responseArray.push(...entries);
      }
    }
  } catch (error) {
    console.error("Error while getting response from SnapLogic:", error);
  }
  console.log("Obtained all responses from SnapLogic");
  return responseArray;
};

module.exports = { getSnapLogicResponse };
