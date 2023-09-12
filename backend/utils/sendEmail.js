import nodemailer from 'nodemailer';

const sendEmail = async (to , subject , text) =>{
   
    const transpoter = nodemailer.createTransport({
     
            host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            auth: {
              user: process.env.SMPT_USER,
              pass: process.env.SMPT_PASS
            }
    });
    //     service: process.env.SMPT_SERVICE,
    //     auth:{
    //         user: process.env.SMPT_MAIL,
    //         pass: process.env.SMPT_PASSWORD,
    //     },
    // });

    await transpoter.sendMail({
        to, subject, text
    })

    // const mailOptions = {
    //     from: process.env.SMPT_MAIL ,
    //     to: options.email,
    //     subject: options.subject,
    //     tex: options.message,
    // };

//    await transpoter.sendMail(mailOptions);
}

export default sendEmail;

