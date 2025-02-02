'use strict';
const fetch = require('node-fetch');
const yauzl = require('yauzl-promise');
const { sleep } = require('./sleep');

async function requestResultsToBeBuilt(token, dataCenter, surveyId, format) {
  const payload = {
    format,
    surveyId
  };
  const url = `https://${dataCenter}.qualtrics.com/API/v3/responseexports`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'x-api-token': token,
      'content-type': 'application/json'
    }
  });
  const data = await response.json();

  return data.result.id;
}

async function waitForBuildToComplete(token, dataCenter, progressId) {
  await sleep(1000); //wait for a second before making the request
  const url = `https://${dataCenter}.qualtrics.com/API/v3/responseexports/${progressId}`;
  const response = await fetch(url, {
    headers: {
      'x-api-token': token,
      'content-type': 'application/json'
    }
  });
  const data = await response.json();
  if (data.result.percentComplete === 100) {
    return data.result.file;
  }
  return waitForBuildToComplete(token, dataCenter, progressId);
}

async function writeFile(token, url, destinationStream) {
  const response = await fetch(url, {
    headers: {
      'x-api-token': token,
      'content-type': 'application/json'
    }
  });
  const buffer = await response.buffer();
  const zipFile = await yauzl.fromBuffer(buffer);
  const entry = await zipFile.readEntry();
  const readStream = await zipFile.openReadStream(entry);
  readStream.pipe(destinationStream);
  return new Promise(resolve => {
    destinationStream.on("finish", () => {
      resolve();
    });
  });
}

async function getSurveyResponses(token, dataCenter, surveyId, destinationStream, format) {
  const progressId = await requestResultsToBeBuilt(token, dataCenter, surveyId, format);
  const fileUrl = await waitForBuildToComplete(token, dataCenter, progressId);
  return await writeFile(token, fileUrl, destinationStream);
}

exports.getSurveyResponses = getSurveyResponses;
