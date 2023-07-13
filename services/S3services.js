const Aws = require("aws-sdk");

exports.uploadToS3 = (file, filename) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new Aws.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: file,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3respons) => {
      if (err) {
        console.log("somthing went wrong", err);
        reject(err);
      } else {
        console.log("sucess", s3respons);
        resolve(s3respons.Location);
      }
    });
  });
};
