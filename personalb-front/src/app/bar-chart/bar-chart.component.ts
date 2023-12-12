// // import { Component, OnInit } from '@angular/core';
// // import { ExpenseService } from '../expense.service';
// // import { BudgetService } from '../budget.service';
// // import { Chart, ChartConfiguration, ChartDataset, ChartOptions, ChartType } from 'chart.js';

// // @Component({
// //   selector: 'app-bar-chart',
// //   templateUrl: './bar-chart.component.html',
// //   styleUrls: ['./bar-chart.component.css']
// // })
// // export class BarChartComponent implements OnInit {
// //   selectedMonth: string = ''; // Selected month from the dropdown
// //   barChartData: ChartDataset[] = [];
// //   barChartType: ChartType = 'bar';
// //   barChartLabels: string[] = [];
// //   barChartOptions: ChartOptions = {
// //     responsive: true,
// //     scales: {
// //       y: {
// //         beginAtZero: true
// //       }
// //     }
// //   };
// //   barChartLegend = true;
// //   months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// //   constructor(private expenseService: ExpenseService, private budgetService: BudgetService) { }

// //   ngOnInit(): void {
// //     const currentDate = new Date();
// //     const currentMonthIndex = currentDate.getMonth();
// //     this.selectedMonth = this.months[currentMonthIndex];
// //     this.fetchDataForChart();
// //   }

// //   fetchDataForChart(): void {
// //     this.budgetService.getBudgetByMonth(this.selectedMonth)
// //       .subscribe(
// //         (budgetData) => {
// //           this.expenseService.getExpenseByMonth(this.selectedMonth)
// //             .subscribe(
// //               (expenseData) => {
// //                 this.barChartLabels = budgetData.map((item: any) => item.budget_criteria);
// //                 this.barChartData = [
// //                   { data: budgetData.map((item: any) => item.amount), label: 'Budget' },
// //                   { data: expenseData.map((item: any) => item.spent_amount), label: 'Expense' }
// //                 ];
// //                 this.refreshChart();
// //               },
// //               (error) => {
// //                 console.error('Error fetching expense data:', error);
// //               }
// //             );
// //         },
// //         (error) => {
// //           console.error('Error fetching budget data:', error);
// //         }
// //       );
// //   }

// //   refreshChart(): void {
// //     const chartConfig: ChartConfiguration = {
// //       type: this.barChartType,
// //       data: {
// //         labels: this.barChartLabels,
// //         datasets: this.barChartData
// //       },
// //       options: this.barChartOptions
// //     };

// //     const chartElement = document.getElementById('barChart') as HTMLCanvasElement;
// //     if (chartElement) {
// //       const chart = new Chart(chartElement, chartConfig);
// //     }
// //   }

// //   onChangeMonth(): void {
// //     this.fetchDataForChart();
// //   }
// // }

// import { Component, OnInit } from '@angular/core';
// import { ExpenseService } from '../expense.service';
// import { BudgetService } from '../budget.service';
// import { Chart, ChartConfiguration, ChartDataset, ChartOptions, ChartType } from 'chart.js';

// @Component({
//   selector: 'app-bar-chart',
//   templateUrl: './bar-chart.component.html',
//   styleUrls: ['./bar-chart.component.css']
// })
// export class BarChartComponent implements OnInit {
//   selectedMonth: string = ''; // Selected month from the dropdown
//   barChartData: ChartDataset[] = [];
//   barChartType: ChartType = 'bar';
//   barChartLabels: string[] = [];
//   barChartOptions: ChartOptions = {
//     responsive: true,
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   };
//   barChartLegend = true;
//   months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//   constructor(private expenseService: ExpenseService, private budgetService: BudgetService) { }

//   ngOnInit(): void {
//     const currentDate = new Date();
//     const currentMonthIndex = currentDate.getMonth();
//     this.selectedMonth = this.months[currentMonthIndex];
//     this.fetchDataForChart();
//   }

//   fetchDataForChart(): void {
//     this.budgetService.getBudgetByMonth(this.selectedMonth)
//       .subscribe(
//         (budgetData) => {
//           this.expenseService.getExpenseByMonth(this.selectedMonth)
//             .subscribe(
//               (expenseData) => {
//                 this.barChartLabels = budgetData.map((item: any) => item.budget_criteria);
//                 this.barChartData = [
//                   { data: budgetData.map((item: any) => item.amount), label: 'Budget', backgroundColor: '#808000' },
//                   { data: expenseData.map((item: any) => item.spent_amount), label: 'Expense', backgroundColor: '#704000' }
//                 ];
//                 this.refreshChart();
//               },
//               (error) => {
//                 console.error('Error fetching expense data:', error);
//               }
//             );
//         },
//         (error) => {
//           console.error('Error fetching budget data:', error);
//         }
//       );
//   }

//   refreshChart(): void {
//     const chartConfig: ChartConfiguration = {
//       type: this.barChartType,
//       data: {
//         labels: this.barChartLabels,
//         datasets: this.barChartData
//       },
//       options: this.barChartOptions
//     };

//     const chartElement = document.getElementById('barChart') as HTMLCanvasElement;
//     if (chartElement) {
//       const chart = new Chart(chartElement, chartConfig);
//     }
//   }

//   onChangeMonth(): void {
//     this.fetchDataForChart();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { BudgetService } from '../budget.service';
import {
  Chart,
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartType,
} from 'chart.js/auto'; // Updated import

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit {
  selectedMonth: string = ''; // Selected month from the dropdown
  barChartData: ChartDataset[] = [];
  barChartType: ChartType = 'bar';
  barChartLabels: string[] = [];
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  barChartLegend = true;
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

  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) {}

  ngOnInit(): void {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    this.selectedMonth = this.months[currentMonthIndex];
    this.fetchDataForChart();
  }

  fetchDataForChart(): void {
    this.budgetService.getBudgetByMonth(this.selectedMonth).subscribe(
      (budgetData) => {
        this.expenseService.getExpenseByMonth(this.selectedMonth).subscribe(
          (expenseData) => {
            this.barChartLabels = budgetData.map(
              (item: any) => item.budget_criteria
            );
            this.barChartData = [
              {
                data: budgetData.map((item: any) => item.amount),
                label: 'Budget',
                backgroundColor: '#808000',
              },
              {
                data: expenseData.map((item: any) => item.spent_amount),
                label: 'Expense',
                backgroundColor: '#704000',
              },
            ];
            this.refreshChart();
          },
          (error) => {
            console.error('Error fetching expense data:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching budget data:', error);
      }
    );
  }

  refreshChart(): void {
    const chartConfig: ChartConfiguration = {
      type: this.barChartType,
      data: {
        labels: this.barChartLabels,
        datasets: this.barChartData,
      },
      options: this.barChartOptions,
    };

    const chartElement = document.getElementById(
      'barChart'
    ) as HTMLCanvasElement;
    if (chartElement) {
      const chart = new Chart(chartElement, chartConfig);
    }
  }

  onChangeMonth(): void {
    this.fetchDataForChart();
  }
}
