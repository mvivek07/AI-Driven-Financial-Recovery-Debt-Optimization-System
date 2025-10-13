import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DashboardData } from './csvParser';

export const exportDashboardReport = async (data: DashboardData) => {
  try {
    console.log('Starting report generation...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yOffset = 20;

    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(102, 126, 234);
    pdf.text('Financial Analytics Report', pageWidth / 2, yOffset, { align: 'center' });
    
    yOffset += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yOffset, { align: 'center' });
    
    yOffset += 15;

    // Add KPI Summary
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Key Performance Indicators', 15, yOffset);
    yOffset += 8;

    const totalReturns = data.records.reduce((sum, r) => sum + r.returns, 0);
    const totalMarketing = data.records.reduce((sum, r) => sum + r.totalMarketingSpend, 0);
    const totalGrossProfit = data.records.reduce((sum, r) => sum + r.grossProfit, 0);
    const profitMargin = ((totalGrossProfit / data.summary.totalSales) * 100).toFixed(1);
    const netProfit = data.records.reduce((sum, r) => sum + r.netProfitLoss, 0);

    pdf.setFontSize(10);
    const kpis = [
      `Total Sales: ₹${(data.summary.totalSales / 1000000).toFixed(2)}M`,
      `Total Transactions: ${data.summary.totalTransactions.toLocaleString()}`,
      `Average Transaction: ₹${data.summary.avgTransaction.toFixed(0)}`,
      `Top Channel: ${data.summary.topCategory}`,
      `Total Returns: ₹${(totalReturns / 1000000).toFixed(2)}M`,
      `Marketing Spend: ₹${(totalMarketing / 1000000).toFixed(2)}M`,
      `Profit Margin: ${profitMargin}%`,
      `Net Profit: ₹${(netProfit / 1000000).toFixed(2)}M`,
    ];

    kpis.forEach((kpi, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      pdf.text(kpi, 15 + col * 95, yOffset + row * 7);
    });

    yOffset += 35;

    // Capture charts
    const chartElements = document.querySelectorAll('[data-chart-card]');
    console.log(`Found ${chartElements.length} chart elements to capture`);
    
    for (let i = 0; i < chartElements.length; i++) {
      const element = chartElements[i] as HTMLElement;
      
      if (yOffset > pageHeight - 80) {
        pdf.addPage();
        yOffset = 20;
      }

      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 30;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add chart title
        const title = element.querySelector('h6')?.textContent || `Chart ${i + 1}`;
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(title, 15, yOffset);
        yOffset += 7;

        pdf.addImage(imgData, 'PNG', 15, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight + 15;
      } catch (error) {
        console.error('Error capturing chart:', error);
      }
    }

    // Add footer on last page
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} of ${pageCount} | Financial Analytics Dashboard`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    console.log('Report generated successfully, downloading...');
    pdf.save(`financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};
