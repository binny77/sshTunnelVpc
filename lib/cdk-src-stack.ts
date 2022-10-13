import {Stack, StackProps, Tags} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {CustomVpc} from "./components/custom-vpc";

import {Tunnel} from "./tunnel/tunnel";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {Key} from "aws-cdk-lib/aws-kms";
import { AuroraDB } from './custom-constructs/AuroraDB';
import { DatabaseSecret } from 'aws-cdk-lib/aws-rds';

export class CdkSrcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new CustomVpc(this, 'example-vpc')
    //const vpc = new VpcConstruct(this, 'example-vpc_2')
    const key = new Key(this, 'example-key', {
      alias: 'ssh-kms-key'
    })

    const cluster = new Cluster(this, 'cluster', {
      vpc: vpc,
      containerInsights: false,
      clusterName: 'ssh-cluster2'
    })

    const tunnel = new Tunnel(this, 'ssh-tunnel', {
      vpc: vpc,
      env: props?.env!,
      cluster: cluster,
      key: key
    })

    key.grantEncryptDecrypt(tunnel.tunnelService.taskDefinition.taskRole);

     const dbSecretKey = new Key(this, 'dbSecretKMSKey', {
      enableKeyRotation: true,
      description: 'DB Secret Encryption Key2',
    });

    const dbSecretForUser = new DatabaseSecret(this, 'dbSecretForSSHTunneling', {
      secretName: 'dbSecretForSSHTunneling',
      username: 'userService',
      encryptionKey: dbSecretKey,
    });

    new AuroraDB(this, 'dbForSSHTunneling', {
      vpc,
      secret: dbSecretForUser,
      databaseName: 'dbForUsers',
    }); 
    
    Tags.of(this).add('context', 'ssh-example_with:mysql');
  }
}
