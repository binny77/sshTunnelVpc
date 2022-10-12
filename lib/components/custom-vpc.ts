import {
  GatewayVpcEndpoint,
  GatewayVpcEndpointAwsService,
  InterfaceVpcEndpoint,
  InterfaceVpcEndpointAwsService,
  ISecurityGroup,
  SecurityGroup,
  SubnetType,
  Vpc
} from "aws-cdk-lib/aws-ec2";
import {Construct} from "constructs";

export class CustomVpc extends Vpc {
  vpcEndpointSg: ISecurityGroup

  ssmVpcEndpoint: InterfaceVpcEndpoint
  ecrVpcEndpoint: InterfaceVpcEndpoint
  dkrVpcEndpoint: InterfaceVpcEndpoint
  ssmMessageVpcEndpoint: InterfaceVpcEndpoint
  cwlVpcEndpoint: InterfaceVpcEndpoint
  kmsVpcEndpoint: InterfaceVpcEndpoint
  s3VpcEndpoint: GatewayVpcEndpoint
  RdsVpcEndpoint :InterfaceVpcEndpoint
  RdsDataEndpoint : InterfaceVpcEndpoint
  
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      maxAzs: 2,
      cidr: '10.10.42.0/24',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          subnetType: SubnetType.PRIVATE_ISOLATED,
          name: 'private subnet'
        }
      ]
    });

    this.vpcEndpointSg = new SecurityGroup(this, 'vpce-sg', {
      vpc: this,
      allowAllOutbound: true
    })

    this.ssmVpcEndpoint = this.addInterfaceEndpoint('ssmvpce', {
      service: InterfaceVpcEndpointAwsService.SSM,
      subnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [
        this.vpcEndpointSg
      ]
    })

    this.s3VpcEndpoint = this.addGatewayEndpoint('s3vpce', {
      service: GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnetType: SubnetType.PRIVATE_ISOLATED
        }
      ]
    })

    this.ecrVpcEndpoint = this.addInterfaceEndpoint('ecrvpce', {
      service: InterfaceVpcEndpointAwsService.ECR,
      subnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED
      },
      securityGroups: [
        this.vpcEndpointSg
      ]
    })

    this.dkrVpcEndpoint = this.addInterfaceEndpoint('dkr', {
      service: InterfaceVpcEndpointAwsService.ECR_DOCKER,
      subnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED
      },
      securityGroups: [
        this.vpcEndpointSg
      ]
    })

    this.ssmMessageVpcEndpoint = this.addInterfaceEndpoint('ssmmessages', {
      service: InterfaceVpcEndpointAwsService.SSM_MESSAGES,
      subnets: {  
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [
        this.vpcEndpointSg
      ]
    })

    this.cwlVpcEndpoint = this.addInterfaceEndpoint('cwl', {
      service: InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      subnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [
        this.vpcEndpointSg
      ]
    })

    this.kmsVpcEndpoint = this.addInterfaceEndpoint('kms', {
      service: InterfaceVpcEndpointAwsService.KMS,
      subnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [
        this.vpcEndpointSg
      ]
    })

    this.RdsVpcEndpoint = this.addInterfaceEndpoint('rds',{
      service: InterfaceVpcEndpointAwsService.RDS,
      subnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [
        this.vpcEndpointSg
      ]
    })
/*    this.vpc.addInterfaceEndpoint('RdsEndpoint', {
      service: InterfaceVpcEndpointAwsService.RDS,
      subnets: appsSubnets,
      });
*/
 
this.RdsDataEndpoint = this.addInterfaceEndpoint('rdsData',{
  service: InterfaceVpcEndpointAwsService.RDS_DATA,
  subnets: {
    subnetType: SubnetType.PRIVATE_ISOLATED,
  },
  securityGroups: [
    this.vpcEndpointSg
  ]

})
/*      this.vpc.addInterfaceEndpoint('RdsDataEndpoint', {
      service: InterfaceVpcEndpointAwsService.RDS_DATA,
      subnets: appsSubnets,
      });
       */
  }
 
}