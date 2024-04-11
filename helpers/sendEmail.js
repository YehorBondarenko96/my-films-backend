import ElasticEmail from "@elasticemail/elasticemail-client";

const { ELASTICEMAIL_API_KEY, ELASTICEMAIL_FROM } = process.env;

const defaultClient = ElasticEmail.ApiClient.instance;

const {apikey} = defaultClient.authentications;
apikey.apiKey = ELASTICEMAIL_API_KEY;

const api = new ElasticEmail.EmailsApi();

const sendEmail = (verifyEmailData) => {
const email = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [
    new ElasticEmail.EmailRecipient(verifyEmailData.to)
    ],
    Content: {
    Body: [
        ElasticEmail.BodyPart.constructFromObject({
        ContentType: "HTML",
        Content: verifyEmailData.html
        })
    ],
    Subject: verifyEmailData.subject,
    From: ELASTICEMAIL_FROM
    }
});

const callback = function(error, data, response) {
    if (error) {
        console.error(error);
    } else {
        console.log('API called successfully.');
    }
};

api.emailsPost(email, callback);
};

export default sendEmail;