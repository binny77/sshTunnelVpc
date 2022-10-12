import { ProxyProperties } from '@vw-sre/vws-cdk';

export class Config {
  public static readonly stackNames = {
    pipeline: 'DevSecOpsPipelineStack',
    frontend: 'DevSecOpsFrontendStack',
    photoBackend: 'DevSecOpsPhotoBackendStack',
    userBackend: 'DevSecOpsUserBackendStack',
  };

  public static readonly exportNames = {
    approvalTopicArn: 'ApprovalTopicArn',
    hostedZoneId: 'HostedZoneId',
    zoneName: 'ZoneName',
  };

  public static readonly region = 'eu-west-1';

  public static readonly accountIds: Record<string, string> = {
    DEV: '909861450833',
    TEST: '696141381541',
  };

  public static readonly scTestDbName = 'sorry-cypress';

  public static readonly appCpu = 1024;

  public static readonly loadbalancerSubnetName = 'alb';

  public static readonly appSubnetName = 'private subnet';

  public static readonly appMemory = 4096;

  public static readonly projectTagKey = 'project';

  public static readonly projectTagValue = 'DevSecOps';

  public static readonly proxyPropertiesPipeline: ProxyProperties = {
    allowedPorts: [443],
    allowedSuffixes: [
      'registry.npmjs.org',
      'registry.yarnpkg.com',
      'ecr.aws',
      'cloudfront.net',
      'amazonaws.com',
      'github.com',
      'pythonhosted.org',
      'pypi.org',
      'downloads.gradle-dn.com',
      'gradle.org',
      'bintray.com',
      'repo.maven.apache.org',
      'docker.io',
      'docker.com',
      'alpine.global.ssl.fastly.net',
      'dl-cdn.alpinelinux.org',
      'npmjs.org',
      'github-releases.githubusercontent.com',
      'raw.githubusercontent.com',
      'github-registry-files.githubusercontent.com',
      'database.clamav.net',
      'packages.cloudfoundry.org',
      'vws-ci-credentials-broker.sys.emea.vwapps.io',
      'cdn.emea.vwapps.io',
      'sys.emea.vwapps.io',
      'apps.emea.vwapps.io',
      'fonts.googleapis.com',
      'newrelic.com',
      'nr-data.net',
      'newrelic.eu',
      'slack.com',
      'hooks.slack.com',
    ],
    allowedCidrs: [],
  };

  public static readonly github = {
    owner: 'sdc-dev-xp',
    frontend: {
      branch: 'master',
      repository: 'ex-filter-frontend',
    },
    backend: {
      branch: 'master',
      repository: 'ex-filter-backend',
    },
    user: {
      branch: 'master',
      repository: 'ex-user-service',
    },
    pipeline: {
      branch: 'main',
      repository: 'devsecops_xaccount_pipeline',
    },
  };

  public static readonly ssmParameterStoreKeys = {
    vpcId: '/DevSecOps/shared/VpcId',
    domainName: '/DevSecOps/shared/DomainName',
    loadBalancerArn: '/DevSecOps/shared/LoadBalancerArn',
    domainCertificateArn: '/DevSecOps/shared/DomainCertificateArn',
    hostedZoneId: '/DevSecOps/shared/DomainHostedZoneId',
    listenerArn: '/DevSecOps/shared/ListenerArn',
    githubConnectionArn: '/DevSecOps/shared/GitHubConnectionArn',
    pipelineProxySecretsArn: '/DevSecOps/shared/PipelineProxySecretsArn',
    pipelineProxyDnsName: '/DevSecOps/shared/PipelineProxyDnsName',
    newrelicLicenseKey: 'NEW_RELIC_LICENSE_KEY_2',
    applicationProxyDnsName: '/DevSecOps/shared/ApplicationsProxyDnsName',
    applicationProxySecretsArn: '/DevSecOps/shared/ApplicationProxySecretsArn',
    fargateTaskCountAlarmArn: '/DevSecOps/shared/FargateTaskCountAlarmArn',
    slackWebhookSecretArn: '/DevSecOps/shared/SlackWebhookSecretArn',
    sorryCypressDomain: '/DevSecOps/shared/SorryCypressDomain',
    sorryCypressDomainCertificateArn:
      '/DevSecOps/shared/SorryCypressDomainCertificateArn',
    mongoDbSecretArn: '/DevSecOps/shared/MongoDbSecretArn',
    clusterSecGroupId: '/DevSecOps/shared/ClusterSecGropuId',
  };

  public static readonly Frontend = {
    appContainerPort: 80,
    appHostPort: 80,
    proxyProperties: Config.proxyPropertiesPipeline,
  };

  public static readonly PhotoBackend = {
    appContainerPort: 80,
    appHostPort: 80,
    proxyProperties: Config.proxyPropertiesPipeline,
  };

  public static readonly UserBackend = {
    appContainerPort: 80,
    appHostPort: 80,
    proxyProperties: Config.proxyPropertiesPipeline,
  };
}