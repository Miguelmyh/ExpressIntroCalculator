const express = require("express");
const ExpressError = require("./expressError");

const app = express();

app.use(express.json());

app.get("/mean", function (req, res, next) {
  try {
    if (!req.query.nums) throw new ExpressError("nums must be specified", 400);
    let nums = makeNumsArr(req.query.nums);

    let value = mean(nums);
    res.json({
      operation: "mean",
      value,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/mode", function (req, res, next) {
  try {
    if (!req.query.nums) throw new ExpressError("nums must be specified", 400);
    let nums = makeNumsArr(req.query.nums);
    let value = mode(nums);
    res.json({
      operation: "mode",
      value,
    });
  } catch (err) {
    return next(err);
  }
});

app.get("/median", function (req, res, next) {
  try {
    if (!req.query.nums) throw new ExpressError("nums must be specified", 400);
    let nums = makeNumsArr(req.query.nums);
    let value = median(nums);
    console.log(value);
    return res.json(value);
  } catch (err) {
    next(err);
  }
});

function mean(arr) {
  let sum = 0;
  for (let num in arr) {
    sum += arr[num];
  }
  sum = sum / arr.length;

  return sum;
}

function mode(arr) {
  let numsObj = {};
  let count = 0;
  for (let num in arr) {
    debugger;
    if (numsObj[arr[num]]) {
      count = numsObj[arr[num]];
      count++;
      numsObj[arr[num]] = count;
    } else {
      numsObj[arr[num]] = 1;
    }
  }
  let values = Object.values(numsObj);
  let max = getMax(values);

  return Object.keys(numsObj).find((key) => numsObj[key] == max);
}

function median(arr) {
  let median;
  let midIdx = Math.floor(arr.length / 2);
  sortedArr = arr.sort();
  if (arr.length % 2 == 0) {
    median = (sortedArr[midIdx] + sortedArr[midIdx - 1]) / 2;
  } else {
    median = sortedArr[midIdx];
  }
  console.log(median);
  return median;
}

function getMax(values) {
  let max = values[0];
  for (let i = 0; i < values.length; i++) {
    if (max < values[i]) {
      max = values[i];
    }
  }
  return max;
}

function makeNumsArr(str) {
  let nums = str.split(",");
  let newNums = nums.map(function (element) {
    return Number(element);
  });

  for (let num in newNums) {
    if (Number.isNaN(newNums[num])) {
      throw new ExpressError(`BAD REQUEST: ${nums[num]}`, 400);
    }
  }
  return newNums;
}

app.use((req, res, next) => {
  return next(new ExpressError("BAD REQUEST", 400));
});

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let msg = err.msg;
  console.log(err);
  console.log(err.msg, err.status);
  return res.status(status).json({
    error: { msg, status },
  });
});

app.listen(3000, function () {
  console.log("listening 3000");
});
