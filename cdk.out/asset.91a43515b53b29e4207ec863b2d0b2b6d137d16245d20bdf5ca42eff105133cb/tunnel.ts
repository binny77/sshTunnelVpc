import * as path from 'path';
import {Environment, RemovalPolicy} from 'aws-cdk-lib';
import {Peer, Port, SecurityGroup, SubnetType} from 'aws-cdk-lib/aws-ec2';
import {DockerImageAsset} from 'aws-cdk-lib/aws-ecr-assets';
import {ContainerImage, FargateService, FargateTaskDefinition, ICluster, LogDriver} from 'aws-cdk-lib/aws-ecs';
import {Effect, PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {Construct} from 'constructs';
import {LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {CustomVpc} from "../components/custom-vpc";
import {IKey} from "aws-cdk-lib/aws-kms";

export interface TunnelProps {
  vpc: CustomVpc
  cluster: ICluster
  env: Environment
  key: IKey
}

export class Tunnel extends Construct {

  tunnelService: FargateService

  constructor(scope: Construct, id: string, props: TunnelProps) {
    super(scope, id);

    const taskDefinition = new FargateTaskDefinition(this, 'TunnelTaskDefinition', {
      cpu: 512,
      memoryLimitMiB: 1024,
    });

    taskDefinition.addToTaskRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'ssm:PutParameter',
      ],
      resources: [
        `arn:aws:ssm:${props.env.region}:${props.env.account}:parameter/*`,
      ],
    }));

    taskDefinition.addToTaskRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'kms:ListAliases',
      ],
      resources: [
        '*',
      ],
    }));

    taskDefinition.addContainer('TunnelContainer', {
      containerName: 'ssh-tunnel',
      image: ContainerImage.fromDockerImageAsset(new DockerImageAsset(this, 'TunnelImage', {
        directory: path.join(__dirname),
      })),
      environment: {
        KEY_ID: props.key.keyId
      },
      logging: LogDriver.awsLogs({
        streamPrefix: "ecs-ssh-tunnel",
        logGroup: new LogGroup(scope, 'ecs-log-group', {
          logGroupName: 'ssh-example-tunnel-lg',
          removalPolicy: RemovalPolicy.DESTROY,
          retention: RetentionDays.ONE_DAY
        })
      })
    });

    const sg = new SecurityGroup(this, 'tunnel-sg', {
      vpc: props.vpc,
      allowAllOutbound: false
    })

    sg.addEgressRule(props.vpc.vpcEndpointSg, Port.tcp(443), 'allow communication with vpcendpoints')
    sg.addEgressRule(Peer.prefixList('pl-6da54004'), Port.tcp(443), 'allow communication with s3 over prefix list')

    this.tunnelService = new FargateService(this, 'WebService', {
      serviceName: 'ssh-tunnel',
      cluster: props.cluster,
      taskDefinition: taskDefinition,
      securityGroups: [sg],
      desiredCount: 1,
      enableExecuteCommand: true,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED
      },
    });

    this.tunnelService.node.addDependency(props.vpc.ecrVpcEndpoint, props.vpc.s3VpcEndpoint, props.vpc.dkrVpcEndpoint,
      props.vpc.cwlVpcEndpoint, props.vpc.ssmMessageVpcEndpoint, props.vpc.ssmVpcEndpoint, props.vpc.kmsVpcEndpoint);

  }
}