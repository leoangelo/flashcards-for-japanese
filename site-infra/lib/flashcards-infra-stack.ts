import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as path from "path";
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

export class FlashcardsInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'flashcards-for-nihonggo', {
      accessControl: s3.BucketAccessControl.PRIVATE,
    });

    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    bucket.grantRead(originAccessIdentity);

    const distribution = new Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(bucket, {originAccessIdentity}),
      },
      errorResponses: [{
          httpStatus: 404,
          responsePagePath: '/index.html',
          responseHttpStatus: 200,
          ttl: cdk.Duration.seconds(0)
      }]
    })

    new BucketDeployment(this, 'BucketDeployment', {
      distribution: distribution,
      destinationBucket: bucket,
      distributionPaths: ['/*'],
      sources: [Source.asset(path.resolve(__dirname, '../../website/dist'))]
    })
  }
}
