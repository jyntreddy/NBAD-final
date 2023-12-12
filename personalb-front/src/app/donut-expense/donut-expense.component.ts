import { Component, OnDestroy } from '@angular/core';
import { ExpenseService } from '../expense.service';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
} from 'chart.js';

@Component({
  selector: 'app-donut-expense',
  templateUrl: './donut-expense.component.html',
  styleUrls: ['./donut-expense.component.css'],
})
export class DonutExpenseComponent implements OnDestroy {
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
  donutChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  };
  donutChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };
  donutChartType: ChartType = 'doughnut';
  chartInstance: Chart | undefined;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    this.selectedMonth = this.months[currentMonthIndex];
    this.fetchDataForDonutChart();
  }

  fetchDataForDonutChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.expenseService.getExpenseByMonth(this.selectedMonth).subscribe(
      (expenseData: any[]) => {
        this.donutChartData.labels = expenseData.map(
          (item: any) => item.budget_criteria
        );
        this.donutChartData.datasets[0].data = expenseData.map(
          (item: any) => item.spent_amount
        );
        this.donutChartData.datasets[0].backgroundColor = [
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
        console.error('Error fetching expense data:', error);
      }
    );
  }

  refreshChart(): void {
    const chartConfig: ChartConfiguration = {
      type: this.donutChartType,
      data: this.donutChartData,
      options: this.donutChartOptions,
    };

    const chartElement = document.getElementById(
      'donutChart'
    ) as HTMLCanvasElement;
    if (chartElement) {
      this.chartInstance = new Chart(chartElement, chartConfig);
    }
  }

  onChangeMonth(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.fetchDataForDonutChart();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
