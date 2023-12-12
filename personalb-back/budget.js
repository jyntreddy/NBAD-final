const jwt = require('jsonwebtoken');
const pool = require('./dbConfig');
const authFunctions = require('./authFunctions');
const JWT_SECRET_KEY = '12345';



function addBudget(token, months, budgetCriteria, amount, callback) {
  authFunctions.getUserIdFromToken(token, (result) => {
    if (!result.success) {
      return callback({ success: false, message: result.message });
    }

    const user_id = result.user_id;

    pool.getConnection((err, connection) => {
      if (err) {
        return callback({ success: false, message: 'Error connecting to the database' });
      }

      const getMonthIdsSql = 'SELECT month_id FROM Month WHERE month IN (?)';
      connection.query(getMonthIdsSql, [months], (err, monthRows) => {
        if (err) {
          connection.release();
          return callback({ success: false, message: 'Error fetching month IDs' });
        }
        const monthIds = monthRows.map(row => row.month_id);
        monthIds.forEach(month_id => {
          const checkBudgetSql = 'SELECT * FROM Budgets WHERE month_id = ? AND user_id = ? AND budget_criteria = ?';
          connection.query(checkBudgetSql, [month_id, user_id, budgetCriteria], (err, budgetRows) => {
            if (err) {
              connection.release();
              return callback({ success: false, message: 'Error checking budget' });
            }
            if (budgetRows.length > 0) {
              const updateBudgetSql = 'UPDATE Budgets SET amount = ? WHERE month_id = ? AND user_id = ? AND budget_criteria = ?';
              connection.query(updateBudgetSql, [amount, month_id, user_id, budgetCriteria], (err, result) => {
                if (err) {
                  connection.release();
                  return callback({ success: false, message: 'Error updating budget for specific month' });
                }
              });
            } else {
              const insertBudgetSql = 'INSERT INTO Budgets (month_id, user_id, budget_criteria, amount) VALUES (?, ?, ?, ?)';
              connection.query(insertBudgetSql, [month_id, user_id, budgetCriteria, amount], (err, result) => {
                if (err) {
                  connection.release();
                  return callback({ success: false, message: 'Error inserting budget for specific month' });
                }
                addExpenseByDefault(token, month_id, budgetCriteria, (result) => {
                  if (result.success) {
                  } else {
                  }
                });
              });
            }
          });
        });
        connection.release();
        return callback({ success: true, message: 'Budgets updated or inserted successfully' });
      });
    });
  });
}


function getBudgetByMonth(token, monthName, callback) {
  authFunctions.getUserIdFromToken(token, (result) => {
    if (!result.success) {
      return callback(result);
    }

    const user_id = result.user_id;

    pool.getConnection((err, connection) => {
      if (err) {
        return callback({ success: false, message: 'Error connecting to the database' });
      }

      const sql = `
          SELECT b.*
          FROM Budgets b
          INNER JOIN Month m ON b.month_id = m.month_id
          WHERE m.month = ? AND b.user_id = ?
        `;

      connection.query(sql, [monthName, user_id], (error, results) => {
        connection.release();
        if (error) {
          return callback({ success: false, message: 'Error fetching budgets' });
        }
        callback({ success: true, data: results });
      });
    });
  });
}


function addExpense(token, month, budgetCriteria, expense, callback) {

  authFunctions.getUserIdFromToken(token, (result) => {
    if (!result.success) {
      return callback({ success: false, message: result.message });
    }

    const user_id = result.user_id;

    pool.getConnection((err, connection) => {
      if (err) {
        return callback({ success: false, message: 'Error acquiring database connection' });
      }

      const getMonthIdSql = 'SELECT month_id FROM Month WHERE month = ?';
      connection.query(getMonthIdSql, [month], (err, monthRows) => {
        if (err || monthRows.length === 0) {
          connection.release();
          return callback({ success: false, message: 'Error fetching month' });
        }

        const month_id = monthRows[0].month_id;

        const getBudgetCriteriaIdSql = 'SELECT budget_id FROM Budgets WHERE budget_criteria = ?';
        connection.query(getBudgetCriteriaIdSql, [budgetCriteria], (err, budgetRows) => {
          if (err || budgetRows.length === 0) {
            connection.release();
            return callback({ success: false, message: 'Error fetching budget criteria' });
          }

          const budgetCriteria_id = budgetRows[0].budget_id;

          const selectSql = 'SELECT * FROM Expenses WHERE user_id = ? AND month_id = ? AND budget_criteria_id = ?';
          connection.query(selectSql, [user_id, month_id, budgetCriteria_id], (err, rows) => {
            if (err) {
              connection.release();
              return callback({ success: false, message: 'Error fetching expenses' });
            }

            if (rows.length > 0) {
              const currentSpentAmount = rows[0].spent_amount;
              const updatedSpentAmount = currentSpentAmount + expense;

              const updateSql = 'UPDATE Expenses SET spent_amount = ? WHERE user_id = ? AND month_id = ? AND budget_criteria_id = ?';
              connection.query(updateSql, [updatedSpentAmount, user_id, month_id, budgetCriteria_id], (err, result) => {
                if (err) {
                  connection.release();
                  return callback({ success: false, message: 'Error updating expenses' });
                }
                connection.release();
                return callback({ success: true, message: 'Expense updated successfully' });
              });
            } else {
              const insertSql = 'INSERT INTO Expenses (user_id, month_id, budget_criteria_id, spent_amount) VALUES (?, ?, ?, ?)';
              connection.query(insertSql, [user_id, month_id, budgetCriteria_id, expense], (err, result) => {
                if (err) {
                  connection.release();
                  return callback({ success: false, message: 'Error adding expense' });
                }
                connection.release();
                return callback({ success: true, message: 'Expense added successfully' });
              });
            }
          });
        });
      });
    });
  });
}

function getExpenseByMonth(token, monthName, callback) {
  authFunctions.getUserIdFromToken(token, (result) => {
    if (!result.success) {
      return callback(result);
    }

    const user_id = result.user_id;

    pool.getConnection((err, connection) => {
      if (err) {
        return callback({ success: false, message: 'Error connecting to the database' });
      }

      const getMonthIdSql = 'SELECT month_id FROM Month WHERE month = ?';
      connection.query(getMonthIdSql, [monthName], (err, monthRows) => {
        if (err || monthRows.length === 0) {
          connection.release();
          return callback({ success: false, message: 'Error fetching month ID' });
        }

        const monthId = monthRows[0].month_id;
        const getExpensesSql = `
                    SELECT e.expense_id, e.spent_amount, b.budget_criteria
                    FROM Expenses e 
                    INNER JOIN Budgets b ON e.budget_criteria_id = b.budget_id 
                    WHERE e.user_id = ? AND e.month_id = ?
                `;

        connection.query(getExpensesSql, [user_id, monthId], (err, expenseRows) => {
          connection.release();
          if (err) {
            return callback({ success: false, message: 'Error fetching expenses' });
          }
          const expenses = expenseRows.map(row => ({
            spent_amount: row.spent_amount,
            budget_criteria: row.budget_criteria
          }));

          callback({ success: true, data: expenses });
        });
      });
    });
  });
}

function addExpenseByDefault(token, month_id, budgetCriteria, callback) {
  authFunctions.getUserIdFromToken(token, (result) => {
    if (!result.success) {
      return callback({ success: false, message: result.message });
    }

    const user_id = result.user_id;

    pool.getConnection((err, connection) => {
      if (err) {
        return callback({ success: false, message: 'Error acquiring database connection' });
      }

      const getBudgetCriteriaIdSql = 'SELECT budget_id FROM Budgets WHERE budget_criteria = ?';
      connection.query(getBudgetCriteriaIdSql, [budgetCriteria], (err, budgetRows) => {
        if (err || budgetRows.length === 0) {
          connection.release();
          return callback({ success: false, message: 'Error fetching budget criteria' });
        }

        const budgetCriteria_id = budgetRows[0].budget_id;

        const insertExpenseSql = 'INSERT INTO Expenses (user_id, month_id, budget_criteria_id, spent_amount) VALUES (?, ?, ?, ?)';
        connection.query(insertExpenseSql, [user_id, month_id, budgetCriteria_id, 0], (err, result) => {
          connection.release();
          if (err) {
            return callback({ success: false, message: 'Error adding default expense' });
          }
          return callback({ success: true, message: 'Default expense added successfully' });
        });
      });
    });
  });
}


module.exports = {
  addBudget,
  getBudgetByMonth,
  addExpense,
  getExpenseByMonth,
  addExpenseByDefault
};
