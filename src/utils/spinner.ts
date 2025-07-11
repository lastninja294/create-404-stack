import ora from 'ora';

export async function withSpinner<T>(message: string, fn: () => Promise<T>): Promise<T | void> {
  const spinner = ora(message).start();
  try {
    const result = await fn();
    spinner.succeed(`${message} - done`);
    return result;
  } catch (error) {
    spinner.fail(`${message} - failed`);
    console.error(`❌ Error: ${(error as Error).message}`);
  }
}
