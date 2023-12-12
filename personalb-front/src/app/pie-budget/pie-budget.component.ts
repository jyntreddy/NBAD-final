import { Component, OnDestroy } from '@angular/core';
import { BudgetService } from '../budget.service';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
} from 'chart.js';

@Component({
  selector: 'app-pie-budget',
  templateUrl: './pie-budget.component.html',
  styleUrl: './pie-budget.component.css',
})
export class PieBudgetComponent implements OnDestroy {
  selectedMonth: string = '';
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  pieChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  };
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartType: ChartType = 'pie';
  chartInstance: Chart | undefined;

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    this.selectedMonth = this.months[currentMonthIndex];
    this.fetchDataForPieChart();
  }

  fetchDataForPieChart(): void {
    this.budgetService.getBudgetByMonth(this.selectedMonth).subscribe(
      (budgetData) => {
        this.pieChartData.labels = budgetData.map(
          (item: any) => item.budget_criteria
        );
        this.pieChartData.datasets[0].data = budgetData.map(
          (item: any) => item.amount
        );
        this.pieChartData.datasets[0].backgroundColor = [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ];
        this.refreshChart();
      },
      (error) => {
        console.error('Error fetching budget data:', error);
      }
    );
  }

  refreshChart(): void {
    const chartConfig: ChartConfiguration = {
      type: this.pieChartType,
      data: this.pieChartData,
      options: this.pieChartOptions,
    };

    const chartElement = document.getElementById(
      'pieChart'
    ) as HTMLCanvasElement;
    if (chartElement) {
      this.chartInstance = new Chart(chartElement, chartConfig);
    }
  }

  onChangeMonth(): void {
    console.log('month changed to ' + this.selectedMonth);
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.fetchDataForPieChart();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
