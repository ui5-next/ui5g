var fetch = require("node-fetch");
var { maxBy, groupBy } = require("lodash");
var versionAPIURI = type => `https://${type}.hana.ondemand.com/neo-app.json`;
var maintainAPIURI = type => `https://${type}.hana.ondemand.com/versionoverview.json`;
var S_OPEN_UI_5 = "openui5";
var S_SAP_UI_5 = "sapui5";

const fallbackVersions = [
  "1.75.0",
  "1.71.12",
  "1.65.12"
];

const parseVersion = (s = "") => {
  const parts = s.split(".");
  if (parts.length == 3) {
    return {
      mainVersion: parts.slice(0, 2).join("."),
      patch: parseInt(parts[2], 10),
      fullVersion: s
    };
  } else {
    throw new Error(`not valid version format ${s}`);
  }

};

/**
 * get in maintenance latest patch versions
 *
 * @param {string} type openui5/sapui5
 */
const getAvailableVersions = async(type = S_OPEN_UI_5) => {
  const availableVersions = [];
  try {

    if (type != S_OPEN_UI_5 && type != S_SAP_UI_5) {
      type = S_OPEN_UI_5; // force valid
    }

    const [versionInfo, maintainInfo] = await Promise.all(
      [
        fetch(versionAPIURI(type)).then(res => res.json()),
        fetch(maintainAPIURI(type)).then(res => res.json())
      ]
    );

    const versionMap = groupBy(versionInfo.routes.map(({ target: { version } }) => parseVersion(version)), "mainVersion");


    maintainInfo.versions.forEach(v => {

      if (v.support == "Maintenance") {
        const currentMaintainVersion = parseVersion(v.version);

        const maxPatchVersion = maxBy(versionMap[currentMaintainVersion.mainVersion], "patch");
        availableVersions.push(maxPatchVersion.fullVersion);
      }

    });

    return availableVersions;

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

  }
  if (availableVersions.length > 0) {
    return availableVersions;
  }
  return fallbackVersions;

};

module.exports = { getAvailableVersions };
