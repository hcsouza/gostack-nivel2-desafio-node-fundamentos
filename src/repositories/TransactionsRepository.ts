import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {

    const totalIncome = this.transactions
      .filter(transaction => transaction.type === 'income')
      .map(incomes => incomes.value)
      .reduce((acc, income) => acc + income, 0);

    const totalOutcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(outcomes => outcomes.value)
      .reduce((acc, outcome) => acc + outcome, 0);

    return {  income: totalIncome,
              outcome: totalOutcome,
              total: totalIncome - totalOutcome
    }
  }

  public create({ title, type, value }:CreateTransactionDTO): Transaction {
    const transaction = new Transaction({
      title,
      type,
      value
    });

    this.isValid(transaction);

    this.transactions.push(transaction);
    return transaction;
  }

  private isValid(transaction: Transaction): Boolean {
    if (transaction.type === 'outcome' && transaction.value > this.getBalance().total) {
      throw Error('Outcome cannot be greater than your total income.')
    }
    return true;
  }

}

export default TransactionsRepository;
