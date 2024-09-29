import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region:  process.env.AWS_S3_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID  as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string
    }
}) 

async function uploadFileToS3(buffer: Buffer, fileName: string ,folderName: string) {

    const fileBuffer = buffer

    const fileNameWithPrefix = `${Date.now()}--${fileName}`

    const params = {
        Bucket : process.env.AWS_S3_BUCKET_NAME as string,
        Key : `${folderName}/${fileNameWithPrefix}`,
        Body : fileBuffer,
        ContentType :  'image/jpg',
    }   

    const command = new PutObjectCommand(params)

    await s3Client.send(command)
    

    return  fileNameWithPrefix

}


async function deleteFileFromS3(fileName: string ,folderName: string) {
    
    const params = {
        Bucket : process.env.AWS_S3_BUCKET_NAME as string,
        Key : `${folderName}/${fileName}`,
    }
    const command = new DeleteObjectCommand(params)

    await s3Client.send(command)

}


export { s3Client  , uploadFileToS3  ,deleteFileFromS3}