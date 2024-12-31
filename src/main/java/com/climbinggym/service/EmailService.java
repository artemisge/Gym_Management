package com.climbinggym.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendEmail(String toEmail, String subject, String body, String qrCodeFilePath) throws MessagingException {
        jakarta.mail.internet.MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setFrom("artemisartmail@gmail.com");
            helper.setSubject(subject);
            helper.setText(body, true); // Set to true for HTML content

            // Attach the QR code file
            File qrCodeFile = new File(qrCodeFilePath); // Create a File object from the string path
            if (qrCodeFile.exists() && qrCodeFile.isFile()) {
                helper.addAttachment("QRCode.png", qrCodeFile);
            } else {
                System.err.println("Error: File not found at path: " + qrCodeFilePath);
            }

            javaMailSender.send(message);
        } catch (jakarta.mail.MessagingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } // Enable multipart for attachments

        
    }
}
