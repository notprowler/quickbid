export const generateQuestion = (): { question: string; answer: number } => {
  const num1: number = Math.floor(Math.random() * 10);
  const num2: number = Math.floor(Math.random() * 10);
  const operators: string[] = ["+", "-", "*"];
  const operator: string = operators[Math.floor(Math.random() * operators.length)];
  const question: string = `${num1} ${operator} ${num2}`;
  const answer: number = eval(question);
  return { question, answer };
};