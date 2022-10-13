import { Construct } from 'constructs';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import {
  Credentials,
  DatabaseClusterEngine,
  ParameterGroup,
  ServerlessCluster,
  AuroraMysqlEngineVersion,
} from 'aws-cdk-lib/aws-rds';

import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Config } from '../config/config';

export interface AuroraDBProbs {
  readonly vpc: IVpc;
  readonly secret: ISecret;
  readonly databaseName: string;
}

export class AuroraDB extends Construct {
  public readonly serverlessCluster: ServerlessCluster;

  constructor(scope: Construct, id: string, props: AuroraDBProbs) {
    super(scope, id);

    const dataEncryptionKey = new Key(this, 'DataEncryptionKey', {
      enableKeyRotation: true,
      description: 'Key for DB Cluster encryption',
    });

    this.serverlessCluster = new ServerlessCluster(this, id, {
      defaultDatabaseName: props.databaseName,
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc: props.vpc,
      vpcSubnets: { subnetGroupName: Config.appSubnetName },
      enableDataApi: true,
      credentials: Credentials.fromSecret(props.secret),
      storageEncryptionKey: dataEncryptionKey,
    });
    this.serverlessCluster.connections.allowDefaultPortFromAnyIpv4();
  }
}
