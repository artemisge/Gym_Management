package com.climbinggym.service;

import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Hashtable;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;

@Service
public class QRCodeGeneratorService {

    private static final String QR_CODE_DIRECTORY = "climbing-gym-system/src/main/resources/static/qrcodes/";

    public String generateQRCodeForUser(int userId, String userName) throws Exception {
        String qrCodeData = createQRCodeData(userId, userName);

        // Ensure the directory exists
        Path path = Paths.get(QR_CODE_DIRECTORY);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        // Set file path
        String qrFilePath = QR_CODE_DIRECTORY + "userId" + userId + ".png";

        // Generate and save the QR code as an image
        createQRCodeImage(qrCodeData, qrFilePath);

        return qrFilePath;
    }

    public void deleteQRCodeForUser(int userId) {
        String qrFilePath = QR_CODE_DIRECTORY + "userId" + userId + ".png";
        File qrFile = new File(qrFilePath);

        if (qrFile.exists() && qrFile.isFile()) {
            if (qrFile.delete()) {
                System.out.println("QR code deleted successfully for user ID: " + userId);
            } else {
                System.err.println("Failed to delete QR code for user ID: " + userId);
            }
        } else {
            System.err.println("QR code not found for user ID: " + userId);
        }
    }

    private String createQRCodeData(int userId, String userName) {
        return "UserID:" + userId + ",Name:" + userName;
    }

    private void createQRCodeImage(String data, String filePath) throws Exception {
        int size = 250;
        Hashtable<EncodeHintType, Object> hintMap = new Hashtable<>();
        hintMap.put(EncodeHintType.MARGIN, 1);

        MultiFormatWriter qrCodeWriter = new MultiFormatWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, size, size, hintMap);

        BufferedImage bufferedImage = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                bufferedImage.setRGB(x, y, (bitMatrix.get(x, y) ? 0 : 0xFFFFFF));
            }
        }

        ImageIO.write(bufferedImage, "PNG", new File(filePath));
    }
}
