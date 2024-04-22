import awsSecrets from "./secrets";

const awsExports = {
    aws_project_region: awsSecrets.aws_project_cogito_region,
    aws_cognito_region: awsSecrets.aws_project_cogito_region,
    aws_user_pools_id: awsSecrets.aws_user_pools_id,
    aws_user_pools_web_client_id: awsSecrets.aws_user_pools_web_client_id,
};

export default awsExports;