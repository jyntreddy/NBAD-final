const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authFunctions = require('./authFunctions');
const budgetFunctions = require('./budget');
const app = express();
const port = process.env.port || 3001;

app.use(express.json());
app.use(cors());

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  authFunctions.signup(firstName, lastName, email, username, password, (result) => {
    if (result.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  authFunctions.login(username, password, (result) => {
    if (result.success) {
      res.json({ success: true, message: result.message, token: result.token });
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  });
});

app.post('/refresh-token', (req, res) => {
  const token = req.body.token;

  authFunctions.refreshToken(token, (result) => {
    if (result.success) {
      res.json({ success: true, token: result.token });
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  });
});

app.post('/forgot-password', async (req, res) => {
  const { username } = req.body;

  authFunctions.forgotPassword(username, (result) => {
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  });
});

app.post('/addBudget', (req, res) => {
  const token = req.headers.authorization;
  const { selectedMonths, budgetCriteria, amount } = req.body;

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  console.log("entered addBudget route");

  budgetFunctions.addBudget(token, selectedMonths, budgetCriteria, amount, (result) => {
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  });
});

app.get('/getBudget/:month', (req, res) => {
  const token = req.headers.authorization;
  const monthName = req.params.month;

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  budgetFunctions.getBudgetByMonth(token, monthName, (result) => {
    if (result.success) {
      res.json(result.data);
    } else {
      res.status(500).send(result.message);
    }
  });
});

app.post('/addExpense', (req, res) => {
  const token = req.headers.authorization;
  const { selectedBudget, expense, selectedMonth } = req.body;

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  budgetFunctions.addExpense(token, selectedMonth, selectedBudget, expense, (result) => {
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  });
});

app.get('/getExpense/:month', (req, res) => {
  const token = req.headers.authorization;
  const monthName = req.params.month;

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  budgetFunctions.getExpenseByMonth(token, monthName, (result) => {
    if (result.success) {
      res.json(result.data);
    } else {
      res.status(500).send(result.message);
    }
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
