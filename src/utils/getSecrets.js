const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const { logger } = require("../utils/logger"); 

const ssmClient = new SSMClient({ region: "us-east-1" });

const getSecret = async (secretName) => {
  const params = {
    Name: secretName,
    WithDecryption: true,
  };

  try {
    const command = new GetParameterCommand(params);
    const response = await ssmClient.send(command);
    return response.Parameter?.Value;
  } catch (error) {
    logger.error(`Error fetching secret "${secretName}": ${error.message}`);
    return undefined;
  }
};

module.exports = { getSecret };