package com.br.GymSync.services;

import com.br.GymSync.domain.entities.ClassBooking;
import com.br.GymSync.domain.entities.FinancialTransaction;
import com.br.GymSync.domain.entities.PhysicalAssessment;
import com.br.GymSync.repositories.ClassBookingRepository;
import com.br.GymSync.repositories.FinancialTransactionRepository;
import com.br.GymSync.repositories.PhysicalAssessmentRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final FinancialTransactionRepository transactionRepository;
    private final PhysicalAssessmentRepository assessmentRepository;
    private final ClassBookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public byte[] generateFinancialExtractPdf(UUID gymId) {
        List<FinancialTransaction> transactions = transactionRepository.findByGymId(gymId);
        return createPdf("Gym Financial Extract", new String[]{"Date", "Description", "Type", "Amount (R$)"},
                table -> {
                    for (FinancialTransaction tx : transactions) {
                        table.addCell(tx.getTransactionDate().toString());
                        table.addCell(tx.getDescription());
                        table.addCell(tx.getType().name());
                        table.addCell(tx.getAmount().toString());
                    }
                });
    }

    @Transactional(readOnly = true)
    public byte[] generateClientAssessmentHistoryPdf(UUID clientId) {
        List<PhysicalAssessment> assessments = assessmentRepository.findByClientIdOrderByAssessmentDateAsc(clientId);
        return createPdf("Client Physical Assessment History", new String[]{"Date", "Weight (kg)", "Height (m)", "Body Fat (%)"},
                table -> {
                    for (PhysicalAssessment pa : assessments) {
                        table.addCell(pa.getAssessmentDate().toString());
                        table.addCell(String.valueOf(pa.getWeight()));
                        table.addCell(String.valueOf(pa.getHeight()));
                        table.addCell(String.valueOf(pa.getBodyFatPercentage()));
                    }
                });
    }

    @Transactional(readOnly = true)
    public byte[] generateClassOccupancyPdf(Long classId) {
        List<ClassBooking> bookings = bookingRepository.findByGroupClassId(classId);
        return createPdf("Class Attendance & Occupancy Report", new String[]{"Client Name", "Booking Date", "Status"},
                table -> {
                    for (ClassBooking booking : bookings) {
                        table.addCell(booking.getClient().getName());
                        table.addCell(booking.getBookingDateTime().toString());
                        table.addCell(booking.getStatus().name());
                    }
                });
    }

    private byte[] createPdf(String titleText, String[] headers, java.util.function.Consumer<PdfPTable> rowBuilder) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             Document document = new Document()) {

            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph(titleText, titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            PdfPTable table = new PdfPTable(headers.length);
            table.setWidthPercentage(100);
            for (String header : headers) {
                table.addCell(new Paragraph(header, new Font(Font.HELVETICA, 12, Font.BOLD)));
            }

            rowBuilder.accept(table);

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }
    }
}