import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { Message } from '@aws-sdk/client-sqs'

import { SesService } from './ses.service'
import { S3Service } from './s3/s3.service'

describe('SesService', () => {
  let service: SesService
  let s3Service: S3Service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        SesService,
        S3Service
      ],
    }).compile()

    service = module.get<SesService>(SesService)
    s3Service = module.get<S3Service>(S3Service)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('parseMessage', () => {
    it('should returns with valid input', async () => {
      const getObjectAsStringMock = jest.spyOn(s3Service, 'getObjectAsString')
      getObjectAsStringMock.mockReturnValue(Promise.resolve(validMailAsString))

      const parsedMessage = await service.parseMessage(validMessage)

      expect(parsedMessage).not.toBeUndefined()
      expect(parsedMessage).toStrictEqual(validParsedMessage)

      expect(getObjectAsStringMock).toBeCalled()
    })
  })

  describe('parseMessageBody', () => {
    it('should returns with valid input', async () => {
      const getObjectAsStringMock = jest.spyOn(s3Service, 'getObjectAsString')
      getObjectAsStringMock.mockReturnValue(Promise.resolve(validMailAsString))

      const parsedMessageBody = await service.parseMessageBody(validMessageBodyAsString)

      expect(parsedMessageBody).not.toBeUndefined()
      expect(parsedMessageBody).toStrictEqual(validParsedMessage)

      expect(getObjectAsStringMock).toBeCalled()
    })
  })

  describe('parseMail', () => {
    it('should returns with valid input', async () => {
      const parsedMail = await service.parseMail(validMailAsString)
      expect(parsedMail).not.toBeUndefined()
    })

    it('should returns undefined with invalid input', async () => {
      const parsedMail = await service.parseMail('')
      expect(parsedMail).toBeUndefined()
    })
  })
})

const validMessage: Message = {
  'MessageId': 'bdc1a1bb-8bcb-4573-a74e-8601f9205189',
  'ReceiptHandle': 'AQEBsawLHkCfL2f2unhTCc7usmKLms8VDOS8teeMEO2BeoMZ0tWJlQKUWAkVKqOAGfdIXDtgIgG5wt14K/AzLw36ycaDuRj6aY4nzetdExxsM03Ug6cB5ClymnyHvks5nKcyaPRFVIQpySJwi5QScwkAahiJnYNdnPrW1v8fJ+hg9pH3miB2C3sCP62pCu7XWNiHwqZGMp05ruatKHqRBs7Po3eZa5bCZTmukbQHcXB5uvugfY/amVJiOFxDE9Q8+jOATrlSbUm3icS/PRkoRDPstwn3b5CU4HFCJGeOheK4p97VIL3hwtx0wSlHwGJMk6zqY7gcr2FGqaCEb0p++o/z2fBbSwD+c8A0A8wkhsTcU1zhQ5fuosjBJWPb/2JvywSD8EPfpvebPfNHXBgex45rNTM3eDwde5rMp679s3Pyrro=',
  'MD5OfBody': 'a345b6fe6cd2fdfd85073c1be56f8854',
  'Body': '{\n  "Type" : "Notification",\n  "MessageId" : "5b21e87d-5109-569a-8d8b-b44d0608a8f7",\n  "TopicArn" : "arn:aws:sns:us-east-1:693359360369:kanzanburo-emailDelivered-withTest",\n  "Subject" : "Amazon SES Email Receipt Notification",\n  "Message" : "{\\"notificationType\\":\\"Received\\",\\"mail\\":{\\"timestamp\\":\\"2023-01-05T04:40:32.611Z\\",\\"source\\":\\"01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com\\",\\"messageId\\":\\"gs8mnjh238kkct0cjqucmm2l6f96mp4kiip207g1\\",\\"destination\\":[\\"jane.doe@huffymail.dev\\"],\\"headersTruncated\\":false,\\"headers\\":[{\\"name\\":\\"Return-Path\\",\\"value\\":\\"<01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com>\\"},{\\"name\\":\\"Received\\",\\"value\\":\\"from a48-106.smtp-out.amazonses.com (a48-106.smtp-out.amazonses.com [54.240.48.106]) by inbound-smtp.us-east-1.amazonaws.com with SMTP id gs8mnjh238kkct0cjqucmm2l6f96mp4kiip207g1 for jane.doe@huffymail.dev; Thu, 05 Jan 2023 04:40:32 +0000 (UTC)\\"},{\\"name\\":\\"X-SES-Spam-Verdict\\",\\"value\\":\\"PASS\\"},{\\"name\\":\\"X-SES-Virus-Verdict\\",\\"value\\":\\"PASS\\"},{\\"name\\":\\"Received-SPF\\",\\"value\\":\\"pass (spfCheck: domain of amazonses.com designates 54.240.48.106 as permitted sender) client-ip=54.240.48.106; envelope-from=01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com; helo=a48-106.smtp-out.amazonses.com;\\"},{\\"name\\":\\"Authentication-Results\\",\\"value\\":\\"amazonses.com; spf=pass (spfCheck: domain of amazonses.com designates 54.240.48.106 as permitted sender) client-ip=54.240.48.106; envelope-from=01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com; helo=a48-106.smtp-out.amazonses.com; dkim=pass header.i=@huffymail.dev; dkim=pass header.i=@amazonses.com; dmarc=none header.from=huffymail.dev;\\"},{\\"name\\":\\"X-SES-RECEIPT\\",\\"value\\":\\"AEFBQUFBQUFBQUFIRmNpK2U1czdTKytpUUdnODZKZU90L0lSN2Uva2lHcGdIOE1GWTJaU2dmUUNjMzlla3paS2tiUUEyVVBOeGtySU5yRG5TRTlvN2FVUEVSZkx4NXAwSEVucjBkaVRrN3A1Nk1VV005UHlhSy9pN2NDZ2t5WHhBcTIwSUQ1UTJnenFGeXJsTDRpZElxaWZKVlcvT1hIRW5UaHhzUFRpNkRjV3VxVTZWYjFkekgrL21FdjhjUkJJT3NsZzBIUU1kWitxdC85YUNGYzJiVVprUk9rMlFaeDRoekhoSHRKRVZDZDJxeEduTjJyYlNGZjM0bDVYRERRK2VrbzBVVEhFS2NFWXF1OTRnd1N0dXp5L2tCL0EzNDljZFI2QlBmWmRPQ1pOaXBHcW9kVXpxZFlEQy94aFdaRGFIc2xHV2NRMFdsUFlXa3djYi9zN3BPMDVNZ253cmRndkVITFZlRlo4dXdmQVpTNVB4SWdRQkdBPT0=\\"},{\\"name\\":\\"X-SES-DKIM-SIGNATURE\\",\\"value\\":\\"a=rsa-sha256; q=dns/txt; b=D4pAIFaJdBJBVuQvPDDKEnP1T2uDNjSn/OFlRasPyaq5RQMZT6q789NFDE1J8TBrbghWBh0Vg2dQ6TX+SIbfnBNwetP+9tEe3xuMp9Xf9sGNMu9gGF0n2ZPSf2XdjDPlaBJPch0oFvkT1948os3k7pEGtbJqsR9wBxDcLo9N1iI=; c=relaxed/simple; s=6gbrjpgwjskckoa6a5zn6fwqkn67xbtw; d=amazonses.com; t=1672893633; v=1; bh=Oo6rDhRu76NrY4mKA359Uk8/Q6/obY4v0Q1k64nQV3k=; h=From:To:Cc:Bcc:Subject:Date:Message-ID:MIME-Version:Content-Type:X-SES-RECEIPT;\\"},{\\"name\\":\\"DKIM-Signature\\",\\"value\\":\\"v=1; a=rsa-sha256; q=dns/txt; c=relaxed/simple; s=n45shiwornr7llmrgcsom52qnaxlnu4b; d=huffymail.dev; t=1672893632; h=From:To:Subject:MIME-Version:Content-Type:Message-ID:Date; bh=Oo6rDhRu76NrY4mKA359Uk8/Q6/obY4v0Q1k64nQV3k=; b=C6FtBXBGW0CgfYUwSL8R7C144LFURhh8C28sAwnq0vq7dVk2TFRdbmaEHBz+OWhGUDXBkfdDtYzKCdbD7vDzf6VTfrdJXU/IZshc0P6kbQ99K+nZIi4CiM5px6MvTCBu+cawKJM/EVi/nTC6P/85FPN13dTQXmwwNqhzTn8ELPZkrxcNVD+uBo8dAJCMizedryyMpwomykefB9Qld+Ncxi5v9fvvil9sqi/QvmlDzNC5oByk9tUYNkt0K2leWh8091tJJqXOdJ+Gbp8o+4jQ6AgxU9QIZrWcyZQ4JAjvoHZNQMgATURU50Hfxf8w74Kawh+ReVyhVocth+JaC1zZSw==\\"},{\\"name\\":\\"DKIM-Signature\\",\\"value\\":\\"v=1; a=rsa-sha256; q=dns/txt; c=relaxed/simple; s=6gbrjpgwjskckoa6a5zn6fwqkn67xbtw; d=amazonses.com; t=1672893632; h=From:To:Subject:MIME-Version:Content-Type:Message-ID:Date:Feedback-ID; bh=Oo6rDhRu76NrY4mKA359Uk8/Q6/obY4v0Q1k64nQV3k=; b=TbaN1/6/JXTKDpU7Uo40WVq8VB3eIiWa2FtYj1sMInsPTFzIrqOSpzGMDgpOaf4Tb+C2QkmpgcvgPis6xoYv49rigQiU0mM4S3lmD4dL8K+g94kURTiGUpo8dCSbA6DKrvWx+z9DZoXoC9AFwBkruujaB4DSDFAZULGEwMy4SAs=\\"},{\\"name\\":\\"From\\",\\"value\\":\\"john.doe@huffymail.dev\\"},{\\"name\\":\\"To\\",\\"value\\":\\"jane.doe@huffymail.dev\\"},{\\"name\\":\\"Subject\\",\\"value\\":\\"Lorem ipsum dolor sit amet\\"},{\\"name\\":\\"MIME-Version\\",\\"value\\":\\"1.0\\"},{\\"name\\":\\"Content-Type\\",\\"value\\":\\"multipart/alternative;  boundary=\\\\\\"----=_Part_1838766_1986062955.1672893632000\\\\\\"\\"},{\\"name\\":\\"Message-ID\\",\\"value\\":\\"<01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@email.amazonses.com>\\"},{\\"name\\":\\"Date\\",\\"value\\":\\"Thu, 5 Jan 2023 04:40:32 +0000\\"},{\\"name\\":\\"Feedback-ID\\",\\"value\\":\\"1.us-east-1.f/5ArB7rZ3ysnxKpYTa4qYbo2oxRGmxayGXPc/+5wvA=:AmazonSES\\"},{\\"name\\":\\"X-SES-Outgoing\\",\\"value\\":\\"2023.01.05-54.240.48.106\\"}],\\"commonHeaders\\":{\\"returnPath\\":\\"01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com\\",\\"from\\":[\\"john.doe@huffymail.dev\\"],\\"date\\":\\"Thu, 5 Jan 2023 04:40:32 +0000\\",\\"to\\":[\\"jane.doe@huffymail.dev\\"],\\"messageId\\":\\"<01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@email.amazonses.com>\\",\\"subject\\":\\"Lorem ipsum dolor sit amet\\"}},\\"receipt\\":{\\"timestamp\\":\\"2023-01-05T04:40:32.611Z\\",\\"processingTimeMillis\\":744,\\"recipients\\":[\\"jane.doe@huffymail.dev\\"],\\"spamVerdict\\":{\\"status\\":\\"PASS\\"},\\"virusVerdict\\":{\\"status\\":\\"PASS\\"},\\"spfVerdict\\":{\\"status\\":\\"PASS\\"},\\"dkimVerdict\\":{\\"status\\":\\"PASS\\"},\\"dmarcVerdict\\":{\\"status\\":\\"GRAY\\"},\\"action\\":{\\"type\\":\\"S3\\",\\"topicArn\\":\\"arn:aws:sns:us-east-1:693359360369:kanzanburo-emailDelivered-withTest\\",\\"bucketName\\":\\"kanzanburo.emails.with-test\\",\\"objectKey\\":\\"gs8mnjh238kkct0cjqucmm2l6f96mp4kiip207g1\\"}}}",\n  "Timestamp" : "2023-01-05T04:40:33.377Z",\n  "SignatureVersion" : "1",\n  "Signature" : "XAf1TzxmA53xJSXhk63LjmfSt4iLTLSntWDuqHtVBzNXZe0Q7zzWktEwYqTpB8uVuRWcPYU8B3HeApKsPn2/F2Q7sEefeygZmzDf2dH093JWgPD0napgVJ8MOfZlvC4D53ZHc8I6Xo4/C4GOjD3j6k5ZlSeP/Gn+Xcr4hC3LlRho8Uji+gU4A6sqFg5GqzSgCoq4ESFXXtcEMRU0FLAA2M+HizZy1KQpRbIQX8/J2ERpU+bfOaxF/Voql+bt24H/jaEw8raAQLgtavLAwS35A2L3au89l+dd5QjCwak3BNs4WP8Q42xmA9/LVfnFt7A4Hf69Ya5S8DE5V87DN4SGEQ==",\n  "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",\n  "UnsubscribeURL" : "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:693359360369:kanzanburo-emailDelivered-withTest:5bdf1289-753c-42d8-b33f-badf99a28563"\n}'
}

const validMessageBodyAsString = `
{
  "Type" : "Notification",
  "MessageId" : "5b21e87d-5109-569a-8d8b-b44d0608a8f7",
  "TopicArn" : "arn:aws:sns:us-east-1:693359360369:kanzanburo-emailDelivered-withTest",
  "Subject" : "Amazon SES Email Receipt Notification",
  "Message" : "{\\"notificationType\\":\\"Received\\",\\"mail\\":{\\"timestamp\\":\\"2023-01-05T04:40:32.611Z\\",\\"source\\":\\"01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com\\",\\"messageId\\":\\"gs8mnjh238kkct0cjqucmm2l6f96mp4kiip207g1\\",\\"destination\\":[\\"jane.doe@huffymail.dev\\"],\\"headersTruncated\\":false,\\"headers\\":[{\\"name\\":\\"Return-Path\\",\\"value\\":\\"<01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com>\\"},{\\"name\\":\\"Received\\",\\"value\\":\\"from a48-106.smtp-out.amazonses.com (a48-106.smtp-out.amazonses.com [54.240.48.106]) by inbound-smtp.us-east-1.amazonaws.com with SMTP id gs8mnjh238kkct0cjqucmm2l6f96mp4kiip207g1 for jane.doe@huffymail.dev; Thu, 05 Jan 2023 04:40:32 +0000 (UTC)\\"},{\\"name\\":\\"X-SES-Spam-Verdict\\",\\"value\\":\\"PASS\\"},{\\"name\\":\\"X-SES-Virus-Verdict\\",\\"value\\":\\"PASS\\"},{\\"name\\":\\"Received-SPF\\",\\"value\\":\\"pass (spfCheck: domain of amazonses.com designates 54.240.48.106 as permitted sender) client-ip=54.240.48.106; envelope-from=01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com; helo=a48-106.smtp-out.amazonses.com;\\"},{\\"name\\":\\"Authentication-Results\\",\\"value\\":\\"amazonses.com; spf=pass (spfCheck: domain of amazonses.com designates 54.240.48.106 as permitted sender) client-ip=54.240.48.106; envelope-from=01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com; helo=a48-106.smtp-out.amazonses.com; dkim=pass header.i=@huffymail.dev; dkim=pass header.i=@amazonses.com; dmarc=none header.from=huffymail.dev;\\"},{\\"name\\":\\"X-SES-RECEIPT\\",\\"value\\":\\"AEFBQUFBQUFBQUFIRmNpK2U1czdTKytpUUdnODZKZU90L0lSN2Uva2lHcGdIOE1GWTJaU2dmUUNjMzlla3paS2tiUUEyVVBOeGtySU5yRG5TRTlvN2FVUEVSZkx4NXAwSEVucjBkaVRrN3A1Nk1VV005UHlhSy9pN2NDZ2t5WHhBcTIwSUQ1UTJnenFGeXJsTDRpZElxaWZKVlcvT1hIRW5UaHhzUFRpNkRjV3VxVTZWYjFkekgrL21FdjhjUkJJT3NsZzBIUU1kWitxdC85YUNGYzJiVVprUk9rMlFaeDRoekhoSHRKRVZDZDJxeEduTjJyYlNGZjM0bDVYRERRK2VrbzBVVEhFS2NFWXF1OTRnd1N0dXp5L2tCL0EzNDljZFI2QlBmWmRPQ1pOaXBHcW9kVXpxZFlEQy94aFdaRGFIc2xHV2NRMFdsUFlXa3djYi9zN3BPMDVNZ253cmRndkVITFZlRlo4dXdmQVpTNVB4SWdRQkdBPT0=\\"},{\\"name\\":\\"X-SES-DKIM-SIGNATURE\\",\\"value\\":\\"a=rsa-sha256; q=dns/txt; b=D4pAIFaJdBJBVuQvPDDKEnP1T2uDNjSn/OFlRasPyaq5RQMZT6q789NFDE1J8TBrbghWBh0Vg2dQ6TX+SIbfnBNwetP+9tEe3xuMp9Xf9sGNMu9gGF0n2ZPSf2XdjDPlaBJPch0oFvkT1948os3k7pEGtbJqsR9wBxDcLo9N1iI=; c=relaxed/simple; s=6gbrjpgwjskckoa6a5zn6fwqkn67xbtw; d=amazonses.com; t=1672893633; v=1; bh=Oo6rDhRu76NrY4mKA359Uk8/Q6/obY4v0Q1k64nQV3k=; h=From:To:Cc:Bcc:Subject:Date:Message-ID:MIME-Version:Content-Type:X-SES-RECEIPT;\\"},{\\"name\\":\\"DKIM-Signature\\",\\"value\\":\\"v=1; a=rsa-sha256; q=dns/txt; c=relaxed/simple; s=n45shiwornr7llmrgcsom52qnaxlnu4b; d=huffymail.dev; t=1672893632; h=From:To:Subject:MIME-Version:Content-Type:Message-ID:Date; bh=Oo6rDhRu76NrY4mKA359Uk8/Q6/obY4v0Q1k64nQV3k=; b=C6FtBXBGW0CgfYUwSL8R7C144LFURhh8C28sAwnq0vq7dVk2TFRdbmaEHBz+OWhGUDXBkfdDtYzKCdbD7vDzf6VTfrdJXU/IZshc0P6kbQ99K+nZIi4CiM5px6MvTCBu+cawKJM/EVi/nTC6P/85FPN13dTQXmwwNqhzTn8ELPZkrxcNVD+uBo8dAJCMizedryyMpwomykefB9Qld+Ncxi5v9fvvil9sqi/QvmlDzNC5oByk9tUYNkt0K2leWh8091tJJqXOdJ+Gbp8o+4jQ6AgxU9QIZrWcyZQ4JAjvoHZNQMgATURU50Hfxf8w74Kawh+ReVyhVocth+JaC1zZSw==\\"},{\\"name\\":\\"DKIM-Signature\\",\\"value\\":\\"v=1; a=rsa-sha256; q=dns/txt; c=relaxed/simple; s=6gbrjpgwjskckoa6a5zn6fwqkn67xbtw; d=amazonses.com; t=1672893632; h=From:To:Subject:MIME-Version:Content-Type:Message-ID:Date:Feedback-ID; bh=Oo6rDhRu76NrY4mKA359Uk8/Q6/obY4v0Q1k64nQV3k=; b=TbaN1/6/JXTKDpU7Uo40WVq8VB3eIiWa2FtYj1sMInsPTFzIrqOSpzGMDgpOaf4Tb+C2QkmpgcvgPis6xoYv49rigQiU0mM4S3lmD4dL8K+g94kURTiGUpo8dCSbA6DKrvWx+z9DZoXoC9AFwBkruujaB4DSDFAZULGEwMy4SAs=\\"},{\\"name\\":\\"From\\",\\"value\\":\\"john.doe@huffymail.dev\\"},{\\"name\\":\\"To\\",\\"value\\":\\"jane.doe@huffymail.dev\\"},{\\"name\\":\\"Subject\\",\\"value\\":\\"Lorem ipsum dolor sit amet\\"},{\\"name\\":\\"MIME-Version\\",\\"value\\":\\"1.0\\"},{\\"name\\":\\"Content-Type\\",\\"value\\":\\"multipart/alternative;  boundary=\\\\\\"----=_Part_1838766_1986062955.1672893632000\\\\\\"\\"},{\\"name\\":\\"Message-ID\\",\\"value\\":\\"<01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@email.amazonses.com>\\"},{\\"name\\":\\"Date\\",\\"value\\":\\"Thu, 5 Jan 2023 04:40:32 +0000\\"},{\\"name\\":\\"Feedback-ID\\",\\"value\\":\\"1.us-east-1.f/5ArB7rZ3ysnxKpYTa4qYbo2oxRGmxayGXPc/+5wvA=:AmazonSES\\"},{\\"name\\":\\"X-SES-Outgoing\\",\\"value\\":\\"2023.01.05-54.240.48.106\\"}],\\"commonHeaders\\":{\\"returnPath\\":\\"01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com\\",\\"from\\":[\\"john.doe@huffymail.dev\\"],\\"date\\":\\"Thu, 5 Jan 2023 04:40:32 +0000\\",\\"to\\":[\\"jane.doe@huffymail.dev\\"],\\"messageId\\":\\"<01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@email.amazonses.com>\\",\\"subject\\":\\"Lorem ipsum dolor sit amet\\"}},\\"receipt\\":{\\"timestamp\\":\\"2023-01-05T04:40:32.611Z\\",\\"processingTimeMillis\\":744,\\"recipients\\":[\\"jane.doe@huffymail.dev\\"],\\"spamVerdict\\":{\\"status\\":\\"PASS\\"},\\"virusVerdict\\":{\\"status\\":\\"PASS\\"},\\"spfVerdict\\":{\\"status\\":\\"PASS\\"},\\"dkimVerdict\\":{\\"status\\":\\"PASS\\"},\\"dmarcVerdict\\":{\\"status\\":\\"GRAY\\"},\\"action\\":{\\"type\\":\\"S3\\",\\"topicArn\\":\\"arn:aws:sns:us-east-1:693359360369:kanzanburo-emailDelivered-withTest\\",\\"bucketName\\":\\"kanzanburo.emails.with-test\\",\\"objectKey\\":\\"gs8mnjh238kkct0cjqucmm2l6f96mp4kiip207g1\\"}}}",
  "Timestamp" : "2023-01-05T04:40:33.377Z",
  "SignatureVersion" : "1",
  "Signature" : "XAf1TzxmA53xJSXhk63LjmfSt4iLTLSntWDuqHtVBzNXZe0Q7zzWktEwYqTpB8uVuRWcPYU8B3HeApKsPn2/F2Q7sEefeygZmzDf2dH093JWgPD0napgVJ8MOfZlvC4D53ZHc8I6Xo4/C4GOjD3j6k5ZlSeP/Gn+Xcr4hC3LlRho8Uji+gU4A6sqFg5GqzSgCoq4ESFXXtcEMRU0FLAA2M+HizZy1KQpRbIQX8/J2ERpU+bfOaxF/Voql+bt24H/jaEw8raAQLgtavLAwS35A2L3au89l+dd5QjCwak3BNs4WP8Q42xmA9/LVfnFt7A4Hf69Ya5S8DE5V87DN4SGEQ==",
  "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",
  "UnsubscribeURL" : "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:693359360369:kanzanburo-emailDelivered-withTest:5bdf1289-753c-42d8-b33f-badf99a28563"
}
`.trim()

const validMailAsString = `
Return-Path: <01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com>
Received: from a48-106.smtp-out.amazonses.com (a48-106.smtp-out.amazonses.com [54.240.48.106])
 by inbound-smtp.us-east-1.amazonaws.com with SMTP id gs8mnjh238kkct0cjqucmm2l6f96mp4kiip207g1
 for jane.doe@huffymail.dev;
 Thu, 05 Jan 2023 04:40:32 +0000 (UTC)
X-SES-Spam-Verdict: PASS
X-SES-Virus-Verdict: PASS
Received-SPF: pass (spfCheck: domain of amazonses.com designates 54.240.48.106 as permitted sender) client-ip=54.240.48.106; envelope-from=01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com; helo=a48-106.smtp-out.amazonses.com;
Authentication-Results: amazonses.com;
 spf=pass (spfCheck: domain of amazonses.com designates 54.240.48.106 as permitted sender) client-ip=54.240.48.106; envelope-from=01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com; helo=a48-106.smtp-out.amazonses.com;
 dkim=pass header.i=@huffymail.dev;
 dkim=pass header.i=@amazonses.com;
 dmarc=none header.from=huffymail.dev;
X-SES-RECEIPT: AEFBQUFBQUFBQUFIRmNpK2U1czdTKytpUUdnODZKZU90L0lSN2Uva2lHcGdIOE1GWTJaU2dmUUNjMzlla3paS2tiUUEyVVBOeGtySU5yRG5TRTlvN2FVUEVSZkx4NXAwSEVucjBkaVRrN3A1Nk1VV005UHlhSy9pN2NDZ2t5WHhBcTIwSUQ1UTJnenFGeXJsTDRpZElxaWZKVlcvT1hIRW5UaHhzUFRpNkRjV3VxVTZWYjFkekgrL21FdjhjUkJJT3NsZzBIUU1kWitxdC85YUNGYzJiVVprUk9rMlFaeDRoekhoSHRKRVZDZDJxeEduTjJyYlNGZjM0bDVYRERRK2VrbzBVVEhFS2NFWXF1OTRnd1N0dXp5L2tCL0EzNDljZFI2QlBmWmRPQ1pOaXBHcW9kVXpxZFlEQy94aFdaRGFIc2xHV2NRMFdsUFlXa3djYi9zN3BPMDVNZ253cmRndkVITFZlRlo4dXdmQVpTNVB4SWdRQkdBPT0=
X-SES-DKIM-SIGNATURE: a=rsa-sha256; q=dns/txt; b=D4pAIFaJdBJBVuQvPDDKEnP1T2uDNjSn/OFlRasPyaq5RQMZT6q789NFDE1J8TBrbghWBh0Vg2dQ6TX+SIbfnBNwetP+9tEe3xuMp9Xf9sGNMu9gGF0n2ZPSf2XdjDPlaBJPch0oFvkT1948os3k7pEGtbJqsR9wBxDcLo9N1iI=; c=relaxed/simple; s=6gbrjpgwjskckoa6a5zn6fwqkn67xbtw; d=amazonses.com; t=1672893633; v=1; bh=Oo6rDhRu76NrY4mKA359Uk8/Q6/obY4v0Q1k64nQV3k=; h=From:To:Cc:Bcc:Subject:Date:Message-ID:MIME-Version:Content-Type:X-SES-RECEIPT;
DKIM-Signature: v=1; a=rsa-sha256; q=dns/txt; c=relaxed/simple;
\ts=n45shiwornr7llmrgcsom52qnaxlnu4b; d=huffymail.dev; t=1672893632;
\th=From:To:Subject:MIME-Version:Content-Type:Message-ID:Date;
\tbh=Oo6rDhRu76NrY4mKA359Uk8/Q6/obY4v0Q1k64nQV3k=;
\tb=C6FtBXBGW0CgfYUwSL8R7C144LFURhh8C28sAwnq0vq7dVk2TFRdbmaEHBz+OWhG
\tUDXBkfdDtYzKCdbD7vDzf6VTfrdJXU/IZshc0P6kbQ99K+nZIi4CiM5px6MvTCBu+ca
\twKJM/EVi/nTC6P/85FPN13dTQXmwwNqhzTn8ELPZkrxcNVD+uBo8dAJCMizedryyMpw
\tomykefB9Qld+Ncxi5v9fvvil9sqi/QvmlDzNC5oByk9tUYNkt0K2leWh8091tJJqXOd
\tJ+Gbp8o+4jQ6AgxU9QIZrWcyZQ4JAjvoHZNQMgATURU50Hfxf8w74Kawh+ReVyhVoct
\th+JaC1zZSw==
DKIM-Signature: v=1; a=rsa-sha256; q=dns/txt; c=relaxed/simple;
\ts=6gbrjpgwjskckoa6a5zn6fwqkn67xbtw; d=amazonses.com; t=1672893632;
\th=From:To:Subject:MIME-Version:Content-Type:Message-ID:Date:Feedback-ID;
\tbh=Oo6rDhRu76NrY4mKA359Uk8/Q6/obY4v0Q1k64nQV3k=;
\tb=TbaN1/6/JXTKDpU7Uo40WVq8VB3eIiWa2FtYj1sMInsPTFzIrqOSpzGMDgpOaf4T
\tb+C2QkmpgcvgPis6xoYv49rigQiU0mM4S3lmD4dL8K+g94kURTiGUpo8dCSbA6DKrvW
\tx+z9DZoXoC9AFwBkruujaB4DSDFAZULGEwMy4SAs=
From: john.doe@huffymail.dev
To: jane.doe@huffymail.dev
Subject: Lorem ipsum dolor sit amet
MIME-Version: 1.0
Content-Type: multipart/alternative; 
\tboundary="----=_Part_1838766_1986062955.1672893632000"
Message-ID: <01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@email.amazonses.com>
Date: Thu, 5 Jan 2023 04:40:32 +0000
Feedback-ID: 1.us-east-1.f/5ArB7rZ3ysnxKpYTa4qYbo2oxRGmxayGXPc/+5wvA=:AmazonSES
X-SES-Outgoing: 2023.01.05-54.240.48.106

------=_Part_1838766_1986062955.1672893632000
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 7bit

Lorem ipsum dolor sit amet
------=_Part_1838766_1986062955.1672893632000
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 7bit

Lorem ipsum dolor sit amet
------=_Part_1838766_1986062955.1672893632000--
`.trim()

const validParsedMessage = {
  messageId: 'gs8mnjh238kkct0cjqucmm2l6f96mp4kiip207g1',
  from: '01000185803b0dfb-4a835277-77fd-4297-991c-25e37dd55432-000000@amazonses.com',
  to: 'jane.doe@huffymail.dev',
  spamVerdict: true,
  virusVerdict: true,
  subject: 'Lorem ipsum dolor sit amet',
  html: 'Lorem ipsum dolor sit amet',
  date: new Date('2023-01-05T04:40:32.000Z')
}
